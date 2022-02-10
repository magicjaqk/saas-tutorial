import { InferGetStaticPropsType } from "next";

type Data = {
  id: string;
  name: string;
  price: number;
  interval: number;
  currency: string;
};

export default function pricingPage({
  plans,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(plans);
  return (
    <div className="flex flex-col items-center pt-12">
      <h1 className="font-bold text-4xl">Pricing</h1>
      <div className="flex flex-col items-center space-y-4 mt-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col p-6 max-w-sm border shadow rounded-md items-center justify-center space-y-2"
          >
            <h3 className="font-semibold text-2xl">{plan.name}</h3>
            <p className="font-bold text-indigo-600">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: plan.currency,
              }).format(plan.price / 100)}
            </p>
            <button
              className="w-full p-2 font-bold text-slate-50 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-md text-sm"
              onClick={async () => {
                console.log(plan.id);
                await createSubscription(plan.id);
              }}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { GetStaticProps } from "next";
import createSubscription from "../utils/stripe/createSubscription";

export const getStaticProps = async () => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();

  const productPromises = prices.map(async (price: any) => {
    const product = await stripe.products.retrieve(price.product);

    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount,
      interval: price.recurring.interval,
      currency: price.currency,
    };
  });

  const plans: Data[] = await Promise.all(productPromises);

  return {
    props: {
      plans,
    },
  };
};
