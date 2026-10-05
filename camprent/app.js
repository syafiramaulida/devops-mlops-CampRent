import React, { useState, useMemo } from 'react';

// 1. DATA MASTER (Sesuai Request Anda)
const paketCamp = {
  solo: {
    id: "solo",
    nama: "Paket Solo Backpacker",
    harga: 95000,
    fitur: "Kapasitas 1 Orang, Tenda Single Dome, Matras Foam, Hammock Santai, Kupon Kopi Hangat",
    gambar: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=700&q=80"
  },

  ekonomi: {
    id: "ekonomi",
    nama: "Paket Ekonomi",
    harga: 150000,
    fitur: "2 Orang, Tenda Dome Standar, Matras, Lampu Camping, Akses Toilet & Mushola",
    gambar: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=700&q=80"
  },

  vip: {
    id: "vip",
    nama: "Paket VIP Sunrise",
    harga: 350000,
    fitur: "4 Orang, Tenda Premium Waterproof, Kasur Angin, Sleeping Bag, Kompor Portable",
    gambar: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=700&q=80"
  },

  glamping: {
    id: "glamping",
    nama: "Paket Glamping Luxury",
    harga: 600000,
    fitur: "4-5 Orang, Tempat Tidur Queen Size, Listrik, Sarapan Gratis, View Sunrise",
    gambar: "https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=700&q=80"
  },

  family: {
    id: "family",
    nama: "Paket Family Ultimate",
    harga: 850000,
    fitur: "6-8 Orang, 2 Tenda Besar, BBQ Set, Api Unggun, Air Mineral, Matras Lengkap",
    gambar: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=700&q=80"
  },

  couple: {
    id: "couple",
    nama: "Paket Couple Romantic",
    harga: 275000,
    fitur: "2 Orang, Tenda Premium, Dekorasi Romantis, Sleeping Bag, Snack & Kopi",
    gambar: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=700&q=80"
  },

  adventure: {
    id: "adventure",
    nama: "Paket Adventure",
    harga: 225000,
    fitur: "3 Orang, Tenda Dome, Tracking Guide, Headlamp, Trekking Pole",
    gambar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80"
  },

  campervan: {
    id: "campervan",
    nama: "Paket Campervan Area",
    harga: 300000,
    fitur: "Area Campervan, Listrik, Air Bersih, Toilet, Area Parkir Luas",
    gambar: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80"
  },

  bbq: {
    id: "bbq",
    nama: "Paket BBQ Night",
    harga: 200000,
    fitur: "Grill BBQ, Arang, Alat BBQ, Meja Piknik, Jagung Bakar, Marshmallow",
    gambar: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=700&q=80"
  },

  bbqPremium: {
    id: "bbqPremium",
    nama: "Paket BBQ Premium",
    harga: 450000,
    fitur: "BBQ Grill Premium, Daging Sapi, Ayam, Sosis, Seafood, Minuman, Chef BBQ",
    gambar: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80"
  }
};

// Helper Format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

export default function App() {
  const [page, setPage] = useState('home'); 
  const [selectedCamp, setSelectedCamp] = useState(paketCamp['solo']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [historyBooking, setHistoryBooking] = useState([]);

  const navigateTo = (targetPage, data = null) => {
    if (data) setSelectedCamp(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(targetPage);
  };

  // Filter & Search Reaktif
  const filteredPaket = useMemo(() => {
    let items = Object.values(paketCamp);
    
    if (searchQuery) {
      items = items.filter(item => 
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.fitur.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'low') items.sort((a, b) => a.harga - b.harga);
    if (sortBy === 'high') items.sort((a, b) => b.harga - a.harga);

    return items;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      
      {/* NAVBAR */}
      <nav className="bg-emerald-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-black text-2xl cursor-pointer" onClick={() => navigateTo('home')}>
            <span>🏕️</span> 
            <span>Camp<span className="text-orange-500">Rent</span></span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-2 bg-emerald-950 p-1 rounded-full">
            <button onClick={() => navigateTo('home')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${page === 'home' ? 'bg-orange-500 text-white shadow' : 'hover:text-orange-400'}`}>Home</button>
            <button onClick={() => navigateTo('explore')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${page === 'explore' || page === 'detail' ? 'bg-orange-500 text-white shadow' : 'hover:text-orange-400'}`}>Explore Paket</button>
            <button onClick={() => navigateTo('history')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition relative ${page === 'history' ? 'bg-orange-500 text-white shadow' : 'hover:text-orange-400'}`}>
              Riwayat
              {historyBooking.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{historyBooking.length}</span>}
            </button>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 font-bold rounded-lg shadow-md transition">Daftar</button>
          </div>
        </div>
      </nav>

      {/* RENDER VIEW */}
      <main className="container mx-auto p-4 md:p-8 min-h-[calc(100vh-140px)]">
        {page === 'home' && <HomePage onExplore={() => navigateTo('explore')} onSelectCamp={(camp) => navigateTo('detail', camp)} />}
        {page === 'explore' && <ExplorePage items={filteredPaket} searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} onSelectCamp={(camp) => navigateTo('detail', camp)} />}
        {page === 'detail' && <DetailPage camp={selectedCamp} onBack={() => navigateTo('explore')} onBook={() => navigateTo('booking')} />}
        {page === 'booking' && <BookingPage camp={selectedCamp} onCancel={() => navigateTo('detail')} onSaveBooking={(newBooking) => { setHistoryBooking([newBooking, ...historyBooking]); navigateTo('history'); }} />}
        {page === 'history' && <HistoryPage bookings={historyBooking} onMulaiCari={() => navigateTo('explore')} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>© 2026 CampRent ID. Dibuat dengan cinta untuk petualangan Anda. 🌲</p>
      </footer>
    </div>
  );
}

// --- SUB KOMPONEN 1: HOME ---
function HomePage({ onExplore, onSelectCamp }) {
  const highlightPaket = Object.values(paketCamp); 

  return (
    <div className="space-y-12">
      <div className="relative rounded-2xl overflow-hidden h-[400px] bg-cover bg-center flex items-center justify-start px-6 md:px-12 text-left shadow-lg" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1470246973918-29a93221c455?w=1200')` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white max-w-lg space-y-4">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium Camping Outfitter</span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">Gak Perlu Beli,<br/>Sewa Aja Jadi!</h1>
          <p className="text-gray-200 text-sm">Temukan beragam pilihan paket kemah instan terintegrasi dengan fasilitas lengkap di sekitar lokasi terbaik.</p>
          <button onClick={onExplore} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-md">
            Jelajahi Paket Sekarang →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-3xl mb-2">✨</div>
          <h4 className="font-bold text-gray-900">Peralatan Premium</h4>
          <p className="text-xs text-gray-500 mt-1">Tenda anti badai water-proof bersih terjamin.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-3xl mb-2">🔥</div>
          <h4 className="font-bold text-gray-900">Siap Terima Beres</h4>
          <p className="text-xs text-gray-500 mt-1">Tenda dipasang & dibongkar langsung oleh kru ahli.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-3xl mb-2">💳</div>
          <h4 className="font-bold text-gray-900">Transaksi Instan</h4>
          <p className="text-xs text-gray-500 mt-1">Pilih e-wallet andalan Anda, konfirmasi otomatis.</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-emerald-900 mb-6">Rekomendasi Terpopuler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlightPaket.map(camp => (
            <div key={camp.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between border">
              <img src={camp.gambar} alt={camp.nama} className="h-48 w-full object-cover" />
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{camp.nama}</h3>
                  <p className="text-orange-500 font-extrabold text-xl my-1">{formatRupiah(camp.harga)} <span className="text-xs text-gray-400 font-normal">/ malam</span></p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">{camp.fitur}</p>
                </div>
                <button onClick={() => onSelectCamp(camp)} className="w-full bg-emerald-900 hover:bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold transition">
                  Lihat Paket Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- SUB KOMPONEN 2: EXPLORE ---
function ExplorePage({ items, searchQuery, setSearchQuery, sortBy, setSortBy, onSelectCamp }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit space-y-4">
        <h3 className="font-bold text-lg text-emerald-900 border-b pb-2">🎛️ Urutan Harga</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 focus:outline-none">
          <option value="default">Rekomendasi Terbaik</option>
          <option value="low">Termurah ke Termahal</option>
          <option value="high">Termahal ke Termurah</option>
        </select>
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center bg-white p-2 rounded-2xl shadow-sm border">
          <span className="pl-2 pr-2 text-gray-400">🔍</span>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari paket (contoh: VIP, BBQ, Tenda)..." className="w-full p-2 text-sm focus:outline-none" />
        </div>

        <div className="space-y-4">
          {items.length > 0 ? (
            items.map(camp => (
              <div key={camp.id} className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">
                <img src={camp.gambar} alt={camp.nama} className="w-full md:w-44 h-32 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-grow w-full flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{camp.nama}</h3>
                    <p className="text-xs text-gray-500">✨ {camp.fitur}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-orange-500 font-black text-lg">{formatRupiah(camp.harga)}<span className="text-xs text-gray-400 font-normal"> /malam</span></span>
                    <button onClick={() => onSelectCamp(camp)} className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition">
                      Pilih Paket →
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed text-gray-500">
              Paket tidak ditemukan. Coba ketik kata kunci lain.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB KOMPONEN 3: DETAIL ---
function DetailPage({ camp, onBack, onBook }) {
  const listFitur = camp.fitur.split(', ');

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto border">
      <div className="relative h-64 md:h-80">
        <img src={camp.gambar} alt={camp.nama} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-xs font-bold">
          ← Kembali
        </button>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{camp.nama}</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-orange-500">{formatRupiah(camp.harga)}<span className="text-xs text-gray-400 font-normal">/malam</span></p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-gray-900">📦 Fasilitas Termausk:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {listFitur.map((fiturItem, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-xl border text-xs text-gray-700">
                ✅ {fiturItem}
              </div>
            ))}
          </div>
        </div>

        <button onClick={onBook} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
          Lanjut Isi Form Pemesanan
        </button>
      </div>
    </div>
  );
}

// --- SUB KOMPONEN 4: BOOKING & LIVE BILLING ---
function BookingPage({ camp, onCancel, onSaveBooking }) {
  const [formData, setFormData] = useState({ nama: '', wa: '', checkIn: '', checkOut: '', payment: 'GOPAY' });

  // Live Hitung Durasi Malam
  const hitungMalam = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const tgl1 = new Date(formData.checkIn);
    const tgl2 = new Date(formData.checkOut);
    const selisihWaktu = tgl2.getTime() - tgl1.getTime();
    const hitungHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
    return hitungHari > 0 ? hitungHari : 1;
  }, [formData.checkIn, formData.checkOut]);

  const totalBiaya = camp.harga * hitungMalam;

  const handleKirimForm = (e) => {
    e.preventDefault();
    onSaveBooking({
      ...formData,
      idBooking: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      paket: camp.nama,
      durasi: hitungMalam,
      total: totalBiaya,
      tanggalDibuat: new Date().toLocaleDateString('id-ID')
    });
  };

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl border overflow-hidden shadow-sm">
        <div className="bg-emerald-900 p-4 text-white font-bold text-center">Formulir Check-In</div>
        <form onSubmit={handleKirimForm} className="p-6 space-y-4">
          <input type="text" required placeholder="Nama Lengkap" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none" />
          <input type="tel" required placeholder="Nomor WhatsApp" value={formData.wa} onChange={(e) => setFormData({...formData, wa: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm focus:outline-none" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Check-In</label>
              <input type="date" required value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} className="w-full border p-2 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Check-Out</label>
              <input type="date" required value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} className="w-full border p-2 rounded-xl text-sm" />
            </div>
          </div>
          <div className="flex space-x-2 pt-4 border-t">
            <button type="button" onClick={onCancel} className="w-1/2 py-2 border rounded-xl text-sm text-gray-500">Kembali</button>
            <button type="submit" className="w-1/2 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm">Bayar Sekarang</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-2xl border h-fit space-y-4">
        <h3 className="font-bold text-sm border-b pb-2">🧾 Ringkasan Tagihan</h3>
        <div className="text-xs space-y-1 text-gray-600">
          <p>Paket: <strong className="text-gray-900">{camp.nama}</strong></p>
          <p>Durasi: <strong>{hitungMalam} Malam</strong></p>
        </div>
        <div className="bg-orange-50 p-3 rounded-xl text-right">
          <span className="text-[10px] text-gray-500 block">Total Bayar:</span>
          <span className="text-lg font-black text-orange-500">{formatRupiah(totalBiaya)}</span>
        </div>
      </div>
    </div>
  );
}

// --- SUB KOMPONEN 5: HISTORY ---
function HistoryPage({ bookings, onMulaiCari }) {
  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-black text-emerald-900">Riwayat Booking Anda</h2>
      {bookings.length > 0 ? (
        bookings.map((b) => (
          <div key={b.idBooking} className="bg-white rounded-2xl p-4 border flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400">{b.idBooking} • {b.tanggalDibuat}</span>
              <h4 className="font-bold text-gray-900 mt-1">{b.paket}</h4>
              <p className="text-xs text-gray-500">Penyewa: {b.nama} ({b.durasi} Malam)</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase block mb-1">Lunas</span>
              <p className="font-bold text-orange-500 text-sm">{formatRupiah(b.total)}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border text-gray-500 text-sm">
          Belum ada riwayat pemesanan. <br />
          <button onClick={onMulaiCari} className="mt-4 bg-emerald-900 text-white px-4 py-2 rounded-xl font-bold">Cari Paket Sekarang</button>
        </div>
      )}
    </div>
  );
}