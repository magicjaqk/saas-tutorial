import { PrismaClient } from "@prisma/client";
import NextAuth, { User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import initStripe from "stripe";

const prisma = new PrismaClient();
const stripe = new initStripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: async (profile) => {
        const existingCustomer = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (existingCustomer) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
            stripeId: existingCustomer.stripeId,
          };
        }

        const customer = await stripe.customers.create({
          email: profile.email,
        });

        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          stripeId: customer.id,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});
