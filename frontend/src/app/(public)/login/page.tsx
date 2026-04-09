type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/profile";

  return (
    <section className="space-y-6 bg-paper px-4 py-8 text-ink sm:px-6">
      <h1 className="text-3xl font-bold">Login (Demo)</h1>
      <p className="max-w-3xl text-ink/70">
        Click one of the links below to create a demo auth cookie. You will be redirected to{" "}
        <code className="rounded bg-brand/10 px-1 py-0.5 text-ink">{next}</code>.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href={`/api/auth/mock-login?role=customer&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-brand/40 px-3 py-2 hover:bg-brand hover:text-ink"
        >
          Login as customer
        </a>
        <a
          href={`/api/auth/mock-login?role=seller&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-brand/40 px-3 py-2 hover:bg-brand hover:text-ink"
        >
          Login as seller
        </a>
        <a
          href={`/api/auth/mock-login?role=admin&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-brand/40 px-3 py-2 hover:bg-brand hover:text-ink"
        >
          Login as admin
        </a>
      </div>
    </section>
  );
}
