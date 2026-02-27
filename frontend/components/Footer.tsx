import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8 px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-brand text-xl font-bold mb-4">
            Bronze Climate Emporium
          </h2>
          <p className="text-sm">
            Toko komik premium untuk pembaca dewasa dengan kualitas dan
            finishing superior. Kami membangun komunitas pembaca setia
            dengan semangat kreativitas.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-white font-semibold mb-4">Navigasi</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-brand transition">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand transition">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-brand transition">
                Produk
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Bantuan</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/support" className="hover:text-brand transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-brand transition">
                Hubungi Kami
              </Link>
            </li>
            <li>
              <a
                href="mailto:support@bronzeclimate.com"
                className="hover:text-brand transition"
              >
                support@bronzeclimate.com
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand transition">
              Facebook
            </a>
            <a href="#" className="hover:text-brand transition">
              Instagram
            </a>
            <a href="#" className="hover:text-brand transition">
              Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bronze Climate Emporium. All rights reserved.
      </div>
    </footer>
  );
}