import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Utilisation de la clé de service (service_role) de Supabase pour contourner le RLS lors des mises à jour système
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export const config = {
  api: {
    bodyParser: false, // Requis pour valider la signature brute (raw body) de Stripe
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error(`❌ Erreur de signature de Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // 1. L'utilisateur vient de payer son premier abonnement via le lien
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id; // Passer l'UID Supabase dans l'URL Stripe (ex: ?client_reference_id=YOUR_USER_ID)
        const customerId = session.customer;

        if (userId) {
          const { error } = await supabase
            .from('profiles')
            .upsert({ id: userId, is_premium: true, stripe_customer_id: customerId });
          
          if (error) throw error;
          console.log(`⭐ Utilisateur ${userId} est maintenant PRO.`);
        }
        break;
      }

      // 2. Le paiement mensuel a échoué définitivement ou l'utilisateur a annulé son abonnement
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // On cherche le profil correspondant au Customer ID Stripe
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const { error } = await supabase
            .from('profiles')
            .update({ is_premium: false })
            .eq('id', profile.id);

          if (error) throw error;
          console.log(`🕊️ Abonnement caduc : L'utilisateur ${profile.id} repasse en version gratuite.`);
        }
        break;
      }

      default:
        console.log(`Événement non géré : ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erreur interne du traitement du webhook :", error);
    return res.status(500).json({ error: error.message });
  }
}
