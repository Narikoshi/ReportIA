import { GoogleGenerativeAI } from '@google/generative-ai'; 

const apiKey = process.env.GEMINI_API_KEY; 
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Utilisez 1.5-flash ou 2.5-flash selon votre version
    
    // Le nouveau prompt métier
    const prompt = `Tu es un Account Manager Senior dans une agence de marketing digital haut de gamme. Ta mission est de traduire des données techniques brutes (SEO/SEA) en un rapport ultra-vulgarisé, structuré et orienté 'business' pour ton client (artisan ou gérant de PME).

RÈGLES ABSOLUES :
- Ne parle jamais de 'notre agence' ou 'notre CA'. Parle au client de SES résultats (ex: 'votre rentabilité', 'vos campagnes').
- BANNIS LE JARGON (Zéro mention de CPC, CTR, ROAS, Backlinks). Traduis tout en langage clair (ex: budget, visites, coût par visiteur, rentabilité).
- Utilise le ton : ${tone}.

FORMAT DE SORTIE STRICT IMPOSÉ :
Tu dois formater ta réponse exactement avec ces 3 titres (inclus les emojis) et faire des phrases très courtes. Mets les chiffres importants en gras avec des doubles astérisques (**chiffre**). Ne dis pas "Bonjour" et ne rajoute aucune phrase d'introduction ou de conclusion.

💰 1. INVESTISSEMENT & RENTABILITÉ
[1 à 2 phrases maximum expliquant clairement ce que le client a dépensé et ce que ça lui a rapporté de manière simple]

👁️ 2. TRAFIC & VISIBILITÉ
[1 à 2 phrases maximum expliquant l'évolution de son audience ou de l'intérêt pour ses publicités]

🚀 3. PLAN D'ACTION
[1 phrase rassurante expliquant l'action concrète que l'agence va mettre en place cette semaine pour améliorer ou consolider ces résultats. Invente une action logique si les données n'en fournissent pas]

Voici les données brutes à analyser :
${rawData}`;
    
    const result = await model.generateContent(prompt); 
    const text = result.response.text(); 
    
    return res.status(200).json({ success: true, text: text });
    
  } catch (error) { 
    console.error("Erreur d'exécution Gemini:", error); 
    return res.status(500).json({ 
      error: "L'IA a rencontré une erreur lors de la génération.", 
      details: error.message || error 
    });
  } 
}
