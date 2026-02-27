const products = [
  {
    title: "Shadow Realm",
    desc: "Petualangan gelap penuh misteri.",
  },
  {
    title: "Galactic Huntress",
    desc: "Aksi sci-fi yang memukau.",
  },
  {
    title: "Neo Noir City",
    desc: "Drama kriminal penuh intrik.",
  },
  {
    title: "Mythic Quest",
    desc: "Fantasi epik penuh aksi.",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 px-8">
      <h3 className="text-3xl font-bold mb-10">Produk Unggulan</h3>

      <div className="grid md:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <div
            key={i}
            className="bg-gray-900 p-6 rounded-xl hover:scale-105 transition"
          >
            <div className="h-40 bg-gray-700 mb-4 rounded"></div>
            <h4 className="font-bold text-lg">{product.title}</h4>
            <p className="text-gray-400 text-sm mb-4">{product.desc}</p>
            <button className="bg-brand text-black px-4 py-2 rounded">
              Lihat Detail
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}