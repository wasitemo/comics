import Link from "next/link";

export default function SupportSection() {
  return (
    <section className="py-16 px-8 bg-gray-950 text-center">
      <h3 className="text-3xl font-bold mb-6">Butuh Bantuan?</h3>
      <p className="text-gray-400 mb-8">
        Tim kami siap membantu Anda.
      </p>

      <div className="space-x-4">
        <Link
          href="/support"
          className="bg-brand text-black px-6 py-3 rounded"
        >
          Lihat FAQ
        </Link>
        <Link
          href="/support"
          className="border border-brand text-brand px-6 py-3 rounded"
        >
          Hubungi Kami
        </Link>
      </div>
    </section>
  );
}