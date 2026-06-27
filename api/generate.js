import { GoogleGenAI } from '@google/generative-ai';

// Initialisation moderne conforme aux dernières normes du SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { rawData, tone = 'Rassurant' } = req.body;

  if (!rawData || !rawData.trim()) {
    return res.status(400).json({ error: 'Les données brutes (rawData) sont obligatoires' });
  }

  try {
    // Utilisation du modèle standard et ultra-rapide
    const model = ai.models.get('gemini-2.5-flash');

    const prompt = `Tu es un expert en analyse de données marketing et business nommé ReportAI. 
Analyse les données brutes suivantes et fais-en une synthèse claire, structurée et actionnable.
Tu dois impérativement adopter un ton ${tone}.

Données brutes à analyser :
"${rawData}"`;

    // Appel direct et asynchrone
    const response = await model.generateContent({
      contents: prompt
    });

    // Extraction directe de la propriété text (ce n'est plus une fonction)
    const aiText = response.text;

    if (!aiText) {
      throw new Error("Le modèle n'a renvoyé aucun texte.");
    }

    return res.status(200).json({ result: aiText });

  } catch (error) {
    // Ce log apparaîtra dans l'onglet "Logs" de votre tableau de bord Vercel
    console.error("Crash de la fonction Gemini:", error.message || error);
    
    return res.status(500).json({ 
      error: "Erreur interne du serveur lors de la génération",
      details: error.message 
    });
  }
}
