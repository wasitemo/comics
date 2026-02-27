export default function Hero() {
  return (
    <section className="text-center py-24 bg-gradient-to-r from-black to-gray-900">
      <h2 className="text-5xl font-bold mb-6">
        Komik Premium untuk Pembaca Dewasa
      </h2>
      <p className="text-gray-400 mb-8">
        Koleksi eksklusif dengan kualitas dan finishing terbaik.
      </p>

      <div className="space-x-4">
        <button className="bg-brand text-black px-6 py-3 rounded-lg font-semibold">
          Lihat Produk
        </button>
        <button className="border border-brand text-brand px-6 py-3 rounded-lg">
          Berlangganan Newsletter
        </button>
      </div>
    </section>
  );
}