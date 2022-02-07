import { Prisma } from "@prisma/client";

// 1: Define a type that includes the relation to `Post`
const courseWithLessons = Prisma.validator<Prisma.CourseArgs>()({
  include: { lessons: true },
});

// 3: This type will include a user and all their posts
export type CourseWithLessons = Prisma.CourseGetPayload<
  typeof courseWithLessons
>;
