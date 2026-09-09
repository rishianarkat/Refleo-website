import Link from "next/link";

interface ShortLegalRedirectProps {
  title: string;
  destination: string;
}

export default function ShortLegalRedirect({
  title,
  destination,
}: ShortLegalRedirectProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-slate-900">
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="mt-4 text-base leading-relaxed">
          This document has moved. If you are not redirected automatically, {" "}
          <Link className="underline" href={destination}>
            view the current {title}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
