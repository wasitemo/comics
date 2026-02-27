import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black px-8 py-4 flex justify-between items-center">
      <h1 className="text-brand font-bold text-xl">
        Bronze Climate Emporium
      </h1>

      <div className="space-x-6">
        <Link href="/">Beranda</Link>
        <Link href="/about">Tentang Kami</Link>
        <Link href="/products">Produk</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/support">Kontak</Link>
      </div>
    </nav>
  );
}