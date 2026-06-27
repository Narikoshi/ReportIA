import { GoogleGenerativeAI } from '@google/generative-ai';

// Récupération de la clé injectée automatiquement par Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { rawData, tone = 'Rassurant' } = req.body;

  if (!rawData || !rawData.trim()) {
    return res.status(400).json({ error: 'Les données brutes (rawData) sont obligatoires' });
  }

  try {
    // Utilisation du modèle de texte rapide recommandé
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Tu es un expert en analyse de données marketing et business nommé ReportAI. 
Analyse les données brutes suivantes et fais-en une synthèse claire, structurée et actionnable.
Tu dois impérativement adopter un ton ${tone}.

Données brutes à analyser :
"${rawData}"`;

    // Appel au SDK Google
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text(); // Méthode native pour extraire proprement la chaîne de caractères

    // Renvoi du résultat au format attendu par le bouton "Synthèse Magique"
    return res.status(200).json({ result: aiText });

  } catch (error) {
    console.error("Erreur d'exécution API Gemini:", error);
    return res.status(500).json({ error: "L'IA n'a pas pu traiter votre demande. Vérifiez la clé API." });
  }
}
