import * as XLSX from 'xlsx';
import pdfParse from 'pdf-parse'; // Importation ESM conforme à votre package.json

// Configuration pour permettre à Vercel de recevoir des fichiers volumineux en binaire brut
export const config = {
  api: {
    bodyParser: false, // Désactive le parser automatique pour lire le flux binaire brut
  },
};

// Fonction utilitaire pour convertir le flux binaire d'entrée en un seul Buffer
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  // Gestion du CORS pré-vol
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const fileExtension = req.headers['x-file-extension'];
    const buffer = await getRawBody(req);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Le fichier est vide ou manquant.' });
    }

    let extractedText = '';

    // --- ENCOURS DE TRAITEMENT EXCEL (.xlsx, .xls) ---
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        extractedText += `--- Feuille : ${sheetName} ---\n`;
        extractedText += XLSX.utils.sheet_to_txt(worksheet) + '\n\n';
      });
    } 
    // --- ENCOURS DE TRAITEMENT PDF (.pdf) ---
    else if (fileExtension === 'pdf') {
      try {
        // Extraction native, robuste et complète grâce à pdf-parse
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } catch (pdfError) {
        console.error("Erreur spécifique pdf-parse:", pdfError);
        throw new Error("Échec du décodage du contenu binaire du PDF.");
      }
    } else {
      return res.status(400).json({ error: 'Format de fichier non supporté. Utilisez un PDF ou un fichier Excel.' });
    }

    if (!extractedText || !extractedText.trim()) {
      return res.status(422).json({ error: "Aucun texte lisible n'a pu être extrait de ce document." });
    }

    // Tout s'est bien passé, on renvoie le JSON propre
    return res.status(200).json({ success: true, text: extractedText.trim() });

  } catch (error) {
    console.error("Erreur API Parse :", error);
    return res.status(500).json({
      error: "L'analyseur de fichiers a rencontré une erreur interne.",
      details: error.message
    });
  }
}
