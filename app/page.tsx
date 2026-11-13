import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Restaurant Survey</h1>
      <p className="text-muted-foreground">
        WhatsApp survey & engagement platform
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
        >
          Staff login
        </Link>
      </div>
    </main>
  );
}
