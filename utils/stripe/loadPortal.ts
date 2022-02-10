import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const loadPortal = async () => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  const { data } = await axios.get("/api/customer-portal");
  window.location.href = data.url;
};

export default loadPortal;
