export default function ValuesSection() {
  return (
    <section className="py-16 px-8 text-center">
      <h3 className="text-3xl font-bold mb-12">Nilai-Nilai Kami</h3>

      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-brand font-bold text-xl mb-2">
            Kualitas Premium
          </h4>
          <p className="text-gray-400">
            Komik dengan finishing terbaik.
          </p>
        </div>

        <div>
          <h4 className="text-brand font-bold text-xl mb-2">
            Loyalitas Pembaca
          </h4>
          <p className="text-gray-400">
            Kami membangun komunitas pembaca setia.
          </p>
        </div>

        <div>
          <h4 className="text-brand font-bold text-xl mb-2">
            Semangat Kreativitas
          </h4>
          <p className="text-gray-400">
            Mendukung karya kreator komik.
          </p>
        </div>
      </div>
    </section>
  );
}