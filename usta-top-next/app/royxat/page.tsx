"use client";

import { useState } from "react";
import Link from "next/link";

export default function Royxat() {
  const [formData, setFormData] = useState({
    ism: "",
    kasb: "Santexnik",
    telefon: "+998",
    shahar: "Toshkent",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const kasblar = ["Santexnik", "Elektrik", "Duradgor", "Bo'yoqchi", "Rassomchi", "Boshqa"];
  const shaharlar = ["Toshkent", "Samarqand", "Buxoro", "Xorazm", "Andijon", "Boshqa viloyatlar"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/ustalar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }
      
      setSuccess(true);
      setFormData({
        ism: "",
        kasb: "Santexnik",
        telefon: "+998",
        shahar: "Toshkent",
        bio: ""
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-green-50 text-green-600 p-8 rounded-3xl shadow-sm border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Arizangiz qabul qilindi!</h2>
          <p className="text-lg text-green-700 mb-8">
            Tabriklaymiz, siz muvaffaqiyatli ro'yxatdan o'tdingiz. Endi mijozlar sizni topishlari mumkin.
          </p>
          <Link href="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Usta sifatida ro'yxatdan o'tish</h1>
        <p className="text-gray-600">O'z xizmatlaringizni taklif qiling va yangi mijozlar toping</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ism familiyangiz</label>
            <input 
              type="text" 
              required
              placeholder="Alisher Usmonov"
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={formData.ism}
              onChange={(e) => setFormData({...formData, ism: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kasbingiz</label>
              <select 
                className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                value={formData.kasb}
                onChange={(e) => setFormData({...formData, kasb: e.target.value})}
              >
                {kasblar.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon raqam</label>
              <input 
                type="text" 
                required
                placeholder="+998901234567"
                className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-mono"
                value={formData.telefon}
                onChange={(e) => setFormData({...formData, telefon: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shahar / Viloyat</label>
            <select 
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              value={formData.shahar}
              onChange={(e) => setFormData({...formData, shahar: e.target.value})}
            >
              {shaharlar.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">O'zingiz va tajribangiz haqida</label>
            <textarea 
              rows={4}
              placeholder="Qanday ishlar qila olasiz? Necha yillik tajribangiz bor?"
              className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-sm hover:shadow-md"
          >
            {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>
      </div>
    </div>
  );
}
