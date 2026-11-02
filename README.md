# CampRent — DevOps/MLOps Kelompok 01

## Deskripsi Project

CampRent adalah prototype sistem informasi reservasi camping yang dirancang untuk memudahkan pengguna dalam mencari dan melakukan pemesanan paket camping secara lebih praktis.

Project ini dikembangkan sebagai bagian dari kegiatan pembelajaran DevOps/MLOps dengan menerapkan pengelolaan source code menggunakan Git dan GitHub.

## Tujuan Project

- Memudahkan pengggit statusuna mencari informasi paket camping.
- Membantu pengguna melakukan reservasi camping.
- Menyediakan informasi dan riwayat pemesanan.
- Mempelajari penerapan pengelolaan kode dan kolaborasi menggunakan Git dan GitHub.

## Teknologi yang Digunakan

- HTML
- CSS
- JavaScript
- PHP
- MySQL
- Git
- GitHub

## Menjalankan dengan Database MySQL (XAMPP)

1. Salin repository ke folder `C:\xampp\htdocs\camprent`.
2. Jalankan Apache dan MySQL dari XAMPP Control Panel.
3. Buka `http://localhost/phpmyadmin`, pilih tab **Import**, lalu impor file `database/camprent.sql`.
4. Buka `http://localhost/camprent/` untuk melihat paket camping yang dibaca dari tabel `packages`.
5. Jika username atau password MySQL berbeda dari konfigurasi XAMPP standar (`root` tanpa password), atur environment variable `CAMPRENT_DB_HOST`, `CAMPRENT_DB_NAME`, `CAMPRENT_DB_USER`, dan `CAMPRENT_DB_PASSWORD` untuk Apache/PHP.

Database menyediakan tabel `users` (peran user/admin), `packages`, `bbq_menus`, `bookings`, `booking_bbq_items`, `payment_transactions`, `admin_activity_logs`, dan `app_settings`. File SQL juga mengisi katalog awal paket/BBQ dan dua akun demo. Akun database demo memakai password `password`; segera ganti hash tersebut sebelum dipakai di lingkungan bersama atau produksi.

API `api/packages.php` menampilkan paket berstatus `active`. Catatan: autentikasi, pengelolaan akun/admin, BBQ, booking, pembayaran, dan riwayat pada halaman saat ini masih menggunakan `localStorage`; tabel-tabel tersebut sudah disiapkan tetapi belum dihubungkan ke alur aplikasi. Karena itu, impor skema belum otomatis memindahkan transaksi browser ke MySQL.

Pada checkout, pelanggan dapat memilih QRIS, transfer bank, atau cash di lokasi. QRIS dan transfer mengikuti instruksi admin karena QR merchant/rekening CampRent belum dikonfigurasi; jangan menganggap transaksi lunas sebelum dana diterima. Admin memperbarui status pembayaran menjadi **Lunas** setelah verifikasi. Pembayaran tunai dilakukan kepada petugas saat check-in.

## Struktur Repository

```text
devops-mlops-kelompok-01/
├── README.md
├── .gitignore
├── docs/
└── src/
    └── camprent/
```

- `README.md`: Informasi utama project.
- `.gitignore`: Mengatur file dan folder yang tidak perlu dimasukkan ke repository.
- `docs/`: Menyimpan dokumentasi project.
- `src/`: Menyimpan source code aplikasi CampRent.

## Anggota Kelompok

1. **Syafira Maulida Najah**
   - NIM: 23.01.53.0036
   - GitHub: [syafiramaulida](https://github.com/syafiramaulida)

2. **Dewi Ayu Anjani**
   - NIM: 23.01.53.0008
   - GitHub: [Dewiayuanjani](https://github.com/Dewiayuanjani)

3. **Muhammad Umar Al-Faruq**
   - NIM: 23.01.53.0016
   - GitHub: [umaralfaruq1](https://github.com/umaralfaruq1)

4. **Audri Kirana Dwi P.**
   - NIM: 23.01.53.0023
   - GitHub: [audriikirana](https://github.com/audriikirana)

## Status Project

Tahap awal: Persiapan repository dan pengelolaan source code menggunakan Git dan GitHub.