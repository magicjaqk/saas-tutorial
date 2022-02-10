import { PrismaClient } from "@prisma/client";
import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { getCourses } from "../utils/db/getCourses";
import { getUser } from "../utils/db/getUser";
import loadPortal from "../utils/stripe/loadPortal";

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  courses,
}) => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="bg-slate-50 flex flex-col items-center p-4 min-h-screen">
        <Head>
          <title>SaaS Tutorial</title>
        </Head>
        <main className="max-w-2xl">
          <h1 className="text-5xl font-bold mt-10">SaaS Tutorial</h1>
          {courses.map((course, id) => (
            <div key={id} className="my-4">
              <div className="flex space-x-2 items-center">
                <h3 className="font-semibold text-xl">Lesson Name:</h3>
                <code className="px-1 rounded-md bg-gray-300 text-sm">
                  {course.title}
                </code>
              </div>
              <ul className="ml-4">
                {course.lessons.map((lesson, id) => (
                  <li key={id} className="flex items-center group">
                    <ArrowIcon />
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col items-center my-4 space-y-2">
            <h3 className="text-2xl">Signed in as {session.user?.name}</h3>
            <button
              onClick={() => signOut()}
              className="p-2 px-3 rounded-md bg-black text-slate-50 hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Sign Out
            </button>
            <button
              className="p-2 px-3 rounded-md bg-blue-600 text-slate-50 hover:bg-blue-700 transition-colors flex items-center justify-center"
              onClick={async () => await loadPortal()}
            >
              Customer Portal
            </button>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Not signed in</h1>
      <button
        onClick={() => signIn()}
        className="p-2 px-3 rounded-md bg-black text-slate-50 hover:bg-gray-800 transition-colors flex items-center justify-center"
      >
        Sign in
      </button>
    </div>
  );
};

export const getStaticProps = async () => {
  const data = await getCourses();

  return {
    props: {
      courses: data,
    },
  };
};

export default Home;
