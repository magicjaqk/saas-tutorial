import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

type Data = {
  id: string;
};

export default async function Subscribe(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { price_id } = req.query;
  const session = await getSession({ req });

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email!,
    },
  });

  await prisma.$disconnect();

  const lineItems = [
    {
      price: price_id,
      quantity: 1,
    },
  ];

  const stripeSession = await stripe.checkout.sessions.create({
    customer: user?.stripeId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/transaction/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/transaction/cancelled`,
    metadata: {
      userId: user?.id,
    },
  });

  res.json({ id: stripeSession.id });
}
