# Product Requirements Document (PRD) - Rental Jek (Updated)

### Overview
Rental Jek merupakan platform rental mobil berbasis web yang dirancang untuk memberikan layanan penyewaan kendaraan secara cepat, modern, dan efisien. Sistem ini memudahkan pengguna dalam mencari, melihat detail, dan memesan mobil secara online tanpa harus datang langsung ke tempat rental.

Sistem memiliki dua role utama, yaitu Admin dan User (Customer). User dapat melakukan registrasi, login, melihat katalog mobil, memfilter kendaraan, melihat detail spesifikasi dan harga, serta melakukan pemesanan mobil. Sementara itu, Admin memiliki akses penuh untuk mengelola data mobil, memantau pemesanan, serta mengatur status transaksi penyewaan.

Rental Jek dikembangkan menggunakan Laravel 11 sebagai backend API dan React (Vite) sebagai frontend untuk menciptakan aplikasi yang responsif dan interaktif. Sistem juga menggunakan MySQL sebagai database (SQLite untuk lingkungan pengembangan lokal) dan Laravel Sanctum untuk autentikasi berbasis token. Dengan desain modern bergaya glassmorphism dan performa Single Page Application (SPA), Rental Jek memberikan pengalaman pengguna yang premium, aman, dan nyaman di berbagai perangkat.

---

### Problem Space (Job to be done)
Masalah utama yang ingin diselesaikan oleh Rental Jek adalah proses penyewaan mobil super dan mewah yang seringkali masih menggunakan metode tradisional yang lambat, antarmuka pemesanan yang membingungkan, dan ketiadaan transparansi ketersediaan armada secara real-time. Di sisi lain, pihak pengelola rental mewah membutuhkan sistem manajemen inventaris yang cepat, aman, dan mudah dipantau dari satu dashboard terpusat. Untuk itu, Rental Jek dirancang sebagai platform web-based premium yang menghubungkan pelanggan VIP dan pengelola rental secara langsung melalui antarmuka glassmorphism yang super responsif.

> Sebagai pelanggan yang membutuhkan kendaraan premium untuk keperluan bisnis maupun pribadi, saya ingin mencari dan memesan mobil sport kelas atas secara digital dengan antarmuka yang mewah dan instan, agar saya bisa segera menggunakannya untuk perjalanan bisnis tanpa proses verifikasi manual yang berbelit-belit.

> Sebagai seorang pengelola rental (Admin), saya ingin mengelola inventaris mobil dan melacak pesanan yang masuk secara real-time melalui dashboard terpusat, agar saya dapat mengatur ketersediaan armada dengan efisien dan aman.

---

### Requirements
Aplikasi ini memiliki beberapa fitur inti yang disesuaikan dengan peran pengguna yang terlibat, yakni Pelanggan (Customer) dan Admin (Pengelola). Berdasarkan kesepakatan pemfokusan sistem pada **ketersediaan armada mobil** dan penyederhanaan alur, berikut adalah penyesuaian kebutuhan MVP (*Minimum Viable Product*):

#### Role Pengguna
Pelanggan (Customer):
- Dapat mendaftar dan login di halaman `/login` untuk masuk ke akun mereka.
- Melihat katalog mobil mewah lengkap dengan fitur filter (Merek, Kategori, Transmisi) tanpa memuat ulang halaman.
- Melakukan estimasi harga sewa secara interaktif (Kalkulator Harga) di halaman detail mobil.
- Melakukan pemesanan sewa mobil (pesanan masuk ke database dengan status `pending`).
- Melakukan konfirmasi dan kelanjutan sewa secara langsung via chat WhatsApp otomatis dengan Admin.

Admin (Pengelola):
- Dapat login khusus sebagai administrator di halaman `/admin/login`.
- Mengelola data inventaris mobil (CRUD: Menambah, Mengubah, Melihat, dan Menghapus mobil).
- Mengatur harga sewa per hari dan status ketersediaan armada (`available` / `rented`).
- Melihat seluruh pengajuan pesanan masuk dari pelanggan secara terpusat di `/admin/bookings`.
- Mengubah status reservasi pengguna (`Approved` / `Completed` / `Cancelled`). 
  - Jika disetujui (`Approved`), status mobil otomatis berubah menjadi `rented`.
  - Jika selesai (`Completed`), status mobil kembali menjadi `available`.
* Membuka link pesan WhatsApp otomatis dari dashboard admin untuk menghubungi pelanggan guna konfirmasi pembayaran/penyerahan mobil.
- Mengakses Dashboard untuk melihat metrik statistik penyewaan.

---

#### Penjelasan Detail Fitur
1. **Register & Login Pengguna (Critical P0)**
   Pengguna, baik pelanggan maupun admin, dapat membuat akun baru dan masuk ke aplikasi menggunakan email. Login pelanggan berada di `/login` dan admin di `/admin/login`. Sistem menggunakan Laravel Sanctum untuk melindungi token sesi sesi backend.
2. **Manajemen CRUD Mobil (Critical P0)**
   Fitur ini memungkinkan Admin untuk mengelola armada. Admin dapat memasukkan data mobil baru lengkap dengan spesifikasi teknis, harga sewa harian, gambar, dan deskripsi. Rute ini diamankan menggunakan middleware di backend (Admin Token).
3. **Katalog & Filter Interaktif (Critical P0)**
   Pelanggan dapat mencari kendaraan secara instan. Sistem menampilkan filter kategori (Merek, Kategori, Transmisi) serta pengurutan harga/kecepatan secara dinamis tanpa memuat ulang halaman (*no refresh*).
4. **Sistem Booking & Kalkulator Harga (Critical P0)**
   Pelanggan dapat menentukan tanggal mulai dan selesai sewa. Sistem secara otomatis menghitung total harga di layar:
   - Durasi hari sewa.
   - Diskon sewa jangka panjang (10% untuk 3-6 hari, 20% untuk $\ge$ 7 hari).
   - Deposit keamanan flat sebesar `Rp 15.000.000`.
   - Mengirim pengajuan pemesanan bertipe `pending` ke database.
5. **Animasi & Transisi Premium (Important P1)**
   Aplikasi menampilkan efek visual premium seperti *staggered entrance* dan *smooth zoom hover* menggunakan Framer Motion untuk menjaga identitas brand mewah Rental Jek.
6. **Role-based UI (Critical P0)**
   Aplikasi menyesuaikan antarmuka berdasarkan peran pengguna yang masuk. Pelanggan menggunakan UI publik glassmorphism, sedangkan Admin diarahkan ke antarmuka Dashboard admin.
7. **Integrasi WhatsApp Admin & Konfirmasi Manual (Critical P0 - Penyesuaian)**
   Menghilangkan kebutuhan upload KTP/SIM di web dan riwayat transaksi rumit. Verifikasi dilakukan langsung saat COD (bertemu di tempat). Setelah admin menyetujui pemesanan di dashboard, admin dapat mengklik tombol "Hubungi Pelanggan" untuk otomatis mengalihkan admin ke WhatsApp chat dengan teks template berisi rincian sewa pelanggan.
8. **Dashboard Metrik Admin (Nice to Have P2)**
   Tampilan grafis di halaman utama Admin yang menunjukkan metrik statistik secara dinamis berdasarkan database, seperti total armada, mobil yang sedang disewa (*rented*), dan mobil siap pakai (*available*).

---

### Tasks & Status Proyek
Berikut adalah daftar prioritas kebutuhan beserta status implementasinya saat ini:

| Requirement | Priority | Keterangan | Status Proyek |
| :--- | :--- | :--- | :--- |
| **Register & Login Pengguna** | Critical P0 | Pemisahan rute login `/login` dan `/admin/login` serta penyimpanan token Sanctum. | ✅ Completed |
| **CRUD Mobil** | Critical P0 | Admin mengelola armada. Frontend perlu mengirimkan token Authorization agar tidak ditolak backend. | ✅ Completed |
| **Katalog & Filter Interaktif** | Critical P0 | Filter instan berdasarkan Brand, Kategori, Transmisi, dan Sorting. | ✅ Completed |
| **Sistem Booking & Kalkulator Harga** | Critical P0 | Pilihan tanggal sewa, kalkulasi diskon & deposit secara real-time, serta post reservasi. | ✅ Completed |
| **Role-based UI** | Critical P0 | Pemisahan tampilan antarmuka publik pelanggan dan dashboard manajemen admin. | ✅ Completed |
| **WhatsApp Admin & Status Otomatis** | Critical P0 | Tombol WA dengan pesan otomatis dinamis dari panel admin serta pembaruan otomatis ketersediaan mobil. | ✅ Completed |
| **Animasi & Transisi Premium** | Important P1 | Visual premium glassmorphism, hover zoom, dan transisi Framer Motion. | ✅ Completed |
| **Dashboard Metrik Admin** | Nice to have P2 | Tampilan visual statistik ketersediaan mobil secara dinamis dari database. | ✅ Completed |

---

### Kanban Board

**Not started (0)**

**In progress (0)**

**Completed (7)**
- Katalog & Filter Interaktif (Critical P0)
- Animasi & Transisi Premium (Important P1)
- Register & Login pelanggan & admin (Critical P0)
- CRUD Mobil (Critical P0)
- Role-based UI (Critical P0)
- Sistem Booking & Kalkulator Harga (Critical P0)
- WhatsApp Admin & Status Otomatis (Critical P0)
- Dashboard Metrik Admin (Nice to have P2)

