"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";

interface Usta {
  id: string;
  ism: string;
  kasb: string;
  shahar: string;
  reyting: number;
}

export default function Home() {
  const [ustalar, setUstalar] = useState<Usta[]>([]);
  const [kasb, setKasb] = useState("Barchasi");
  const [shahar, setShahar] = useState("Barchasi");
  const [loading, setLoading] = useState(true);

  const kasblar = ["Barchasi", "Santexnik", "Elektrik", "Duradgor", "Bo'yoqchi", "Rassomchi", "Boshqa"];
  const shaharlar = ["Barchasi", "Toshkent", "Samarqand", "Buxoro", "Xorazm", "Andijon", "Boshqa viloyatlar"];

  useEffect(() => {
    fetchUstalar();
  }, [kasb, shahar]);

  const fetchUstalar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (kasb !== "Barchasi") params.append("kasb", kasb);
      if (shahar !== "Barchasi") params.append("shahar", shahar);

      const res = await fetch(`/api/ustalar?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUstalar(data);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Test ProfileCard placement here */}
      <div className="mb-16 border-b border-gray-200 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Yangi React Komponenti: ProfileCard</h2>
          <p className="text-gray-500">Bu siz hozirgina so'ragan tahrirlanadigan (editable) profil kartasi.</p>
        </div>
        <ProfileCard />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          O'zingizga kerakli <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">ishonchli ustani</span> toping
        </h1>
        <p className="text-lg text-gray-600">
          O'zbekiston bo'ylab malakali ustalar xizmatidan foydalaning. Tez, oson va ishonchli.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-center">
        <div className="w-full md:w-auto flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Kasb bo'yicha</label>
          <select 
            value={kasb} 
            onChange={(e) => setKasb(e.target.value)}
            className="w-full md:w-64 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          >
            {kasblar.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="w-full md:w-auto flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Shahar bo'yicha</label>
          <select 
            value={shahar} 
            onChange={(e) => setShahar(e.target.value)}
            className="w-full md:w-64 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
          >
            {shaharlar.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ustalar.length > 0 ? ustalar.map((usta) => (
            <div key={usta.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{usta.ism}</h3>
                  <p className="text-blue-600 font-medium mt-1">{usta.kasb}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg">
                  <span className="text-yellow-600 font-bold text-sm flex items-center gap-1">
                    ★ {usta.reyting > 0 ? usta.reyting.toFixed(1) : "Yangi"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {usta.shahar}
              </div>

              <Link href={`/usta/${usta.id}`} className="block w-full text-center bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white py-2.5 rounded-xl font-medium transition-colors">
                Batafsil ko'rish
              </Link>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-xl mb-2">Ustalar topilmadi</p>
              <p>Iltimos, boshqa filterlardan foydalaning</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
