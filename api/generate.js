// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // 🌟 Ajout d'une sécurité de repli pour la variable tone
  const { rawData, tone = 'Rassurant' } = req.body;

  if (!rawData) {
    return res.status(400).json({ error: 'Les données brutes (rawData) sont obligatoires' });
  }

  try {
    // Simulation temporaire d'analyse
    const mockResponse = `Synthèse (${tone}) : Analyse des données "${rawData.substring(0, 20)}...". 
Le ROAS est positif, mais le taux de rebond nécessite une action immédiate sur la landing page.`;

    return res.status(200).json({ result: mockResponse });
  } catch (error) {
    console.error("Erreur d'exécution backend:", error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
