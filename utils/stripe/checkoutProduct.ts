import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const processPayment = async (productId: number) => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  const { data } = await axios.get(`/api/charge-card/${productId}`);
  await stripe?.redirectToCheckout({ sessionId: data.id });
};

export default processPayment;
