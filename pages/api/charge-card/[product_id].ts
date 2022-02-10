import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

type Data =
  | {
      id: string;
    }
  | unknown;

export default async function ChargeForProductID(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Secure API route
  const session = await getSession({ req });

  if (session) {
    // Signed in

    try {
      const { product_id } = req.query;
      const course = await prisma.course.findUnique({
        where: {
          id: parseInt(product_id.toString()),
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          email: session.user?.email!,
        },
      });

      // Set up stripe checkout
      const lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course?.title,
            },
            unit_amount: course?.price,
          },
          quantity: 1,
        },
      ];

      const stripeSession = await stripe.checkout.sessions.create({
        customer: user?.stripeId,
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/transaction/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/transaction/cancelled`,
        payment_intent_data: {
          metadata: {
            userId: user?.id,
            product_id,
          },
        },
      });

      res.json({ id: stripeSession.id });
    } catch (err) {
      res.send(err);
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
