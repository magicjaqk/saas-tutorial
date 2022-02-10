import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

type Data =
  | {
      user: User;
    }
  | string;

export default async function GetUserData(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req });
  const email = session?.user?.email;

  if (!session) {
    res.send("No user!");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email!,
    },
  });
  res.send({ user: user! });
}
