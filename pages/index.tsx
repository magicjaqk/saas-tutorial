import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { getCourses } from "../utils/db/getCourses";

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
          <div>
            <h3>Signed in as {session.user?.name}</h3>
            <button
              onClick={() => signOut()}
              className="p-2 px-3 rounded-md bg-black text-slate-50 hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                role="img"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Sign Out
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
        <svg
          className="h-5 w-5 mr-2"
          role="img"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
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
