export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <p className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
        Private Area: this section is protected by auth + role checks.
      </p>
      {children}
    </section>
  );
}
