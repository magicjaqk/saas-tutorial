import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const createSubscription = async (priceId: string) => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  const { data } = await axios.get(`/api/subscription/${priceId}`);
  await stripe?.redirectToCheckout({ sessionId: data.id });
};

export default createSubscription;
