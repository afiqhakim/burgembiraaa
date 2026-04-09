type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next ?? "/profile";

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Login (Demo)</h1>
      <p className="text-muted-foreground">
        Click one of the links below to create a demo auth cookie. You will be redirected to{" "}
        <code className="rounded bg-muted px-1 py-0.5">{next}</code>.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <a
          href={`/api/auth/mock-login?role=customer&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-border px-3 py-2 hover:bg-muted"
        >
          Login as customer
        </a>
        <a
          href={`/api/auth/mock-login?role=seller&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-border px-3 py-2 hover:bg-muted"
        >
          Login as seller
        </a>
        <a
          href={`/api/auth/mock-login?role=admin&next=${encodeURIComponent(next)}`}
          className="rounded-md border border-border px-3 py-2 hover:bg-muted"
        >
          Login as admin
        </a>
      </div>
    </div>
  );
}
