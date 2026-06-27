import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VITE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { rawData, tone = 'Rassurant' } = req.body;

  if (!rawData || !rawData.trim()) {
    return res.status(400).json({ error: 'Les données brutes (rawData) sont obligatoires.' });
  }

  if (!genAI) {
    return res.status(500).json({ error: "Configuration manquante : La clé GEMINI_API_KEY n'est pas configurée sur Vercel." });
  }

  try {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  // 1. Appeler l'API Gemini
  const prompt = `Génère un contenu avec un ton ${tone} basé sur ces données : ${rawData}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 2. Renvoyer une réponse HTTP 200 au frontend
  return res.status(200).json({ success: true, text: text });
  
  } catch (error) {
    console.error("Erreur d'exécution Gemini:", error);
    return res.status(500).json({ error: "L'IA a rencontré une erreur lors de la génération.", details: error.message || error });
  }
}
