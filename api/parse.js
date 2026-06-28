import * as XLSX from 'xlsx';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  try {
    const fileExtension = req.headers['x-file-extension'];
    const buffer = await getRawBody(req);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Le fichier est vide.' });
    }

    let extractedText = '';

    // --- LOGIQUE POUR EXCEL ET CSV (gérés tous les deux par XLSX) ---
    if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
      // XLSX.read sait lire un fichier CSV brut passé sous forme de buffer binaire
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        extractedText += XLSX.utils.sheet_to_txt(worksheet) + '\n\n';
      });
    } 
    // --- LOGIQUE POUR LES PDF ---
    else if (fileExtension === 'pdf') {
      try {
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } catch (pdfError) {
        throw new Error("Échec du décodage du PDF.");
      }
    } else {
      return res.status(400).json({ error: 'Format non supporté. Utilisez PDF, Excel ou CSV.' });
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(422).json({ error: "Impossible d'extraire du texte de ce document." });
    }

    return res.status(200).json({ success: true, text: extractedText.trim() });

  } catch (error) {
    console.error("Erreur API Parse :", error);
    return res.status(500).json({ error: "Erreur interne de l'analyseur.", details: error.message });
  }
}
