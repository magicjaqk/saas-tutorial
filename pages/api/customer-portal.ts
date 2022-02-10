import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

type Data = {
  url: string;
};

export default async function CustomerPortal(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });

  const email = session?.user?.email;

  const user = await prisma.user.findUnique({
    where: {
      email: email!,
    },
  });

  await prisma.$disconnect();

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: user?.stripeId,
    return_url: process.env.NEXTAUTH_URL,
  });

  res.send({
    url: stripeSession.url,
  });
}
