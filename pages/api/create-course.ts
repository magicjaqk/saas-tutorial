// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // await prisma.course.create({
  //   data: {
  //     title: "Learning to Code!",
  //     lessons: {
  //       create: {
  //         title: "Learn the Terminal",
  //       },
  //     },
  //   },
  // });
  // const courses = await prisma.course.findMany({
  //   include: {
  //     lessons: true,
  //   },
  // });
  // res.send(courses);
  res.send("This is a test function.");
}
