import React, { useState, useRef } from 'react';
import { Camera, Star } from 'lucide-react';

export default function ProfileCard() {
  const [job, setJob] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-5 font-sans">
      
      {/* Top: Job Title */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Kasb</label>
        <input 
          type="text" 
          value={job}
          onChange={(e) => setJob(e.target.value)}
          placeholder="Kasbni kiriting..."
          className="w-[140px] px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Middle Row */}
      <div className="flex gap-4">
        {/* Left: Avatar */}
        <div className="flex flex-col shrink-0">
          <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Rasm</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-[140px] h-[140px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden group relative"
          >
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-gray-500">
                <Camera size={28} strokeWidth={1.5} />
                <span className="text-xs font-medium">Rasm yuklash</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Right: Name & Address */}
        <div className="flex flex-col flex-1 gap-3 justify-center">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Ism</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="F.I.SH."
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Manzil</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shahar, tuman"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col mt-1">
        <label className="text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Sharx va yulduzlar</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="O'zingiz haqingizda qisqacha ma'lumot qoldiring..."
          rows={3}
          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
        />
        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={26} 
                className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} 
                strokeWidth={1}
              />
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-2 font-medium">{rating > 0 ? `${rating}/5` : ''}</span>
        </div>
      </div>

      <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors active:scale-[0.98] shadow-sm">
        Murojat uchun
      </button>

    </div>
  );
}
