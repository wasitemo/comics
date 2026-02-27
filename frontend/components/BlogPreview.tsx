export default function BlogPreview() {
  return (
    <section className="py-16 px-8 bg-gray-950">
      <h3 className="text-3xl font-bold mb-10">Blog Terbaru</h3>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-gray-900 p-6 rounded-xl">
            <div className="h-40 bg-gray-700 mb-4 rounded"></div>
            <h4 className="font-bold">
              Rekomendasi Komik Sci-Fi Terbaik
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Artikel pilihan untuk penggemar komik dewasa.
            </p>
            <button className="bg-brand text-black px-4 py-2 rounded">
              Baca Selengkapnya
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}