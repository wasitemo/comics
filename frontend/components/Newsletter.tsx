export default function Newsletter() {
  return (
    <section className="py-20 px-8 text-center">
      <h3 className="text-3xl font-bold mb-4">
        Berlangganan Buletin Kami
      </h3>
      <p className="text-gray-400 mb-8">
        Dapatkan update komik terbaru dan artikel menarik langsung ke email Anda.
      </p>

      <div className="flex justify-center">
        <input
          type="email"
          placeholder="Email Anda"
          className="px-4 py-3 w-80 text-black rounded-l-lg"
        />
        <button className="bg-brand text-black px-6 py-3 rounded-r-lg font-semibold">
          Subscribe
        </button>
      </div>
    </section>
  );
}