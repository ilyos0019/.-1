"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Usta {
  id: string;
  ism: string;
  kasb: string;
  telefon: string;
  shahar: string;
  bio: string;
  reyting: number;
}

export default function UstaProfili() {
  const { id } = useParams();
  const [usta, setUsta] = useState<Usta | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    mijoz_ism: "",
    mijoz_tel: "+998",
    xabar: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Aslida bu yerda GET /api/ustalar/[id] bo'lishi kerak.
    // Sodda bo'lishi uchun hozircha barcha ustalarni olib, ichidan filter qilamiz 
    // yoki API ga id filter qoshib olishimiz mumkin.
    fetchUsta();
  }, [id]);

  const fetchUsta = async () => {
    try {
      const res = await fetch(`/api/ustalar`);
      if (res.ok) {
        const data = await res.json();
        const found = data.find((u: Usta) => u.id === id);
        if (found) setUsta(found);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/murojaat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          usta_id: id
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Xatolik yuz berdi");
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usta) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Usta topilmadi</h1>
        <Link href="/" className="text-blue-600 hover:underline">Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Orqaga qaytish
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chap tomon: Usta ma'lumotlari */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{usta.ism}</h1>
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-medium">
                  {usta.kasb}
                </span>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-xl text-center">
                <span className="block text-yellow-600 font-bold text-xl">
                  ★ {usta.reyting > 0 ? usta.reyting.toFixed(1) : "Yangi"}
                </span>
                <span className="text-yellow-700 text-xs font-medium">Reyting</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <div className="bg-gray-50 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span>{usta.shahar}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Usta haqida</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {usta.bio || "Usta o'zi haqida ma'lumot qoldirmagan."}
              </p>
            </div>
          </div>
        </div>

        {/* O'ng tomon: Murojaat formasi */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Murojaat qilish</h3>
            
            {success ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="font-medium mb-1">Murojaatingiz yuborildi!</p>
                <p className="text-sm opacity-80">Usta tez orada siz bilan bog'lanadi.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ismingiz</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Masalan, Alisher"
                    className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={formData.mijoz_ism}
                    onChange={(e) => setFormData({...formData, mijoz_ism: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon raqamingiz</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+998901234567"
                    className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-mono"
                    value={formData.mijoz_tel}
                    onChange={(e) => setFormData({...formData, mijoz_tel: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Muammo nima? (Ixtiyoriy)</label>
                  <textarea 
                    rows={3}
                    placeholder="Ish tafsilotlarini qisqacha yozing..."
                    className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                    value={formData.xabar}
                    onChange={(e) => setFormData({...formData, xabar: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-70 mt-2 shadow-sm"
                >
                  {submitLoading ? "Yuborilmoqda..." : "Xizmatga buyurtma berish"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
