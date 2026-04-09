import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Forbidden</h1>
      <p className="text-muted-foreground">
        You are logged in, but your role does not have permission to view this page.
      </p>
      <Link href="/" className="inline-block rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
        Back to main page
      </Link>
    </div>
  );
}
