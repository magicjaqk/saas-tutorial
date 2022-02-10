# SaaS Tutorial

## Following along with [Jon Meyers](https://jonmeyers.io/blog/tech-stack-and-initial-project-setup).

This is a project built by following along with Jon Meyers's tutorial to build a SaaS service. In this case, he is building Courses, a "video tutorial/course platform that contains a collection of free and paid courses."

I will likely change some essential pieces along the way as proofs to myself that I understand what is going on.

## Things I have changed:

- Using [SuperJSON](https://github.com/blitz-js/superjson#using-with-nextjs) to avoid the hacky `JSON.parse(JSON.stringify(courses))` workaround to avoid the serializability error of DateTime from Prisma with Next.js's `getStaticProps`.
- Using [Next-Auth](https://next-auth.js.org/)'s [Prisma Adapter](https://next-auth.js.org/adapters/prisma) rather than [Auth0](https://auth0.com/).
- User StripeID initialization done on a per-OAuth Provider basis in `[...nextauth].ts`.
