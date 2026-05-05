import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-lg p-1.5 leading-none">U</span>
          Usta Top
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">Bosh sahifa</Link>
          <Link href="/royxat" className="hover:text-blue-600 transition-colors">Usta bo'lish</Link>
        </nav>

        <Link 
          href="/royxat" 
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          Ro'yxatdan o'tish
        </Link>
      </div>
    </header>
  );
}
