import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="space-y-6 bg-paper px-4 py-8 text-ink sm:px-6">
      <h1 className="text-3xl font-bold">Forbidden</h1>
      <p className="max-w-2xl text-ink/70">
        You are logged in, but your role does not have permission to view this page.
      </p>
      <Link href="/" className="inline-block rounded-md border border-brand/40 px-3 py-2 text-sm hover:bg-brand hover:text-ink">
        Back to main page
      </Link>
    </section>
  );
}
