import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };

type Data =
  | {
      received: boolean;
    }
  | string;

export default async function StripHooks(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const reqBuffer = await buffer(req);
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature!,
      signingSecret!
    );
  } catch (err: any | unknown) {
    console.error(err);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { metadata }: any | unknown = event.data.object;
  const stripeId = event.data.object.customer;

  switch (event.type) {
    case "charge.succeeded":
      // update user in prisma
      if (metadata?.userId && metadata?.courseId) {
        const user = await prisma.user.update({
          where: {
            id: metadata.userId,
          },
          data: {
            courses: {
              connect: {
                id: parseInt(metadata.courseId),
              },
            },
          },
        });
      }
      break;
    case "customer.subscription.created":
      if (stripeId) {
        await prisma.user.update({
          where: {
            stripeId,
          },
          data: {
            isSubscribed: true,
          },
        });
        console.log(`Stripe user ${stripeId} subscribed.`);
      }
      break;
    case "customer.subscription.deleted":
      await prisma.user.update({
        where: {
          stripeId,
        },
        data: {
          isSubscribed: false,
        },
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ received: true });
}
