import { getProviders, signIn } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!providers) {
    console.error("No OAuth Providers set up.");
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full min-h-screen">
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="p-2 px-3 rounded-md bg-slate-900 hover:bg-slate-700 text-slate-50 transition-colors"
            onClick={() => signIn(provider.id)}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
