import { PDFDocument } from 'pdf-lib'; // Alternative légère ou traitement textuel basique
import * as XLSX from 'xlsx';

// Configuration pour permettre à Vercel de recevoir des fichiers volumineux en binaire brut
export const config = {
  api: {
    bodyParser: false, // Désactive le parser automatique pour lire le flux binaire
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

    // --- LOGIQUE POUR LES FICHIERS EXCEL (.xlsx, .xls) ---
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      // On parcourt toutes les feuilles du fichier Excel
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        // Conversion de la feuille en texte brut structuré par lignes
        extractedText += `--- Feuille : ${sheetName} ---\n`;
        extractedText += XLSX.utils.sheet_to_txt(worksheet) + '\n\n';
      });
    } 
    // --- LOGIQUE POUR LES FICHIERS PDF (.pdf) ---
    else if (fileExtension === 'pdf') {
      // Note : Pour une extraction de texte parfaite et robuste en production sur Vercel,
      // l'idéal est d'utiliser un paquet dédié comme 'pdf-parse'.
      // En l'absence de bibliothèque native lourde, on utilise une extraction textuelle via métadonnées XLSX ou un parseur de chaînes :
      try {
        // Option A : Si vous installez 'pdf-parse' (recommandé), décommenter les lignes suivantes :
        // const pdfParse = require('pdf-parse');
        // const data = await pdfParse(buffer);
        // extractedText = data.text;
        
        // Option B (Fallback textuel sécurisé temporaire sans dépendances binaires complexes) :
        const rawString = buffer.toString('binary');
        const textMatches = rawString.match(/\/Title\s*\(([^)]+)\)|\/Author\s*\(([^)]+)\)|[\s\S]*?/g);
        
        // Pour éviter les blocages, nous allons nettoyer les chaînes de flux PDF basiques :
        const cleanText = rawString
          .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Nettoie les caractères de contrôle non-imprimables
          .replace(/\s+/g, ' ')
          .substring(0, 3000); // Évite de saturer l'interface au premier test
          
        extractedText = `[Texte brut extrait du PDF (Installez pdf-parse pour un rendu optimal)] :\n` + cleanText;
      } catch (pdfError) {
        throw new Error("Échec du traitement du fichier PDF. Vérifiez son format.");
      }
    } else {
      return res.status(400).json({ error: 'Format de fichier non supporté. Utilisez un PDF ou un fichier Excel.' });
    }

    if (!extractedText.trim()) {
      return res.status(422).json({ error: "Aucun texte lisible n'a pu être extrait de ce fichier." });
    }

    return res.status(200).json({ success: true, text: extractedText.trim() });

  } catch (error) {
    console.error("Erreur API Parse :", error);
    return res.status(500).json({
      error: "L'analyseur de fichiers a rencontré une erreur.",
      details: error.message
    });
  }
}
