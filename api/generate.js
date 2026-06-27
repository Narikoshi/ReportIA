import { GoogleGenAI } from '@google/generative-ai';

// Initialisation du SDK avec votre clé API secrète stockée dans les variables d'environnement
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
    // 1. Choix du modèle le plus rapide et efficace pour du texte (Gemini 2.5 Flash)
    const model = ai.models.get('gemini-2.5-flash');

    // 2. Écriture du prompt pour forcer l'IA à respecter vos consignes métiers et le ton
    const prompt = `Tu es un expert en analyse de données marketing et business nommé ReportAI. 
Analyse les données brutes suivantes et fais-en une synthèse claire, structurée et actionnable.
Tu dois impérativement adopter un ton ${tone}.

Données brutes à analyser :
"${rawData}"`;

    // 3. Appel de l'API Gemini
    const response = await model.generateContent({
      contents: prompt,
    });

    // 4. Extraction du texte généré par l'IA
    const aiText = response.text;

    // 5. Renvoi du résultat au format attendu par votre composant React
    return res.status(200).json({ result: aiText });

  } catch (error) {
    console.error("Erreur API Gemini:", error);
    return res.status(500).json({ error: "Erreur lors de la génération du rapport par l'IA" });
  }
}
