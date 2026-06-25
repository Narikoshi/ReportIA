// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { rawData, tone } = req.body;

  try {
    // Ici, tu appelleras plus tard ton API OpenAI ou Anthropic
    // Pour l'instant, on simule l'intelligence pour valider la connexion
    const mockResponse = `Synthèse (${tone}) : Analyse des données "${rawData.substring(0, 20)}...". 
    Le ROAS est positif, mais le taux de rebond nécessite une action immédiate sur la landing page.`;

    return res.status(200).json({ result: mockResponse });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
