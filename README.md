# NgamarIn - Hotel Booking Website

## 🎯 Fitur Utama

### 1. **Halaman Beranda (Home)**
   - Hero section yang menarik dengan background image
   - Tampilan featured hotels dari database
   - Setiap hotel menampilkan informasi dasar:
     - Nama hotel
     - Harga minimum per malam (dalam Rupiah)
     - Deskripsi singkat
     - Rating bintang
   - Date picker untuk memilih tanggal check-in dan check-out

### 2. **Halaman Pencarian (Search)**
   - Daftar lengkap semua hotel yang tersedia
   - **Dua tampilan mode:**
     - **List View**: Tampilan baris dengan informasi detail
     - **Grid View**: Tampilan grid seperti kartu
   - **Fitur Pencarian & Filter:**
     - Pencarian berdasarkan nama hotel
     - Filter berdasarkan rating (1-5 bintang)
     - Filter berdasarkan price range (harga minimum dan maksimum)
   - **Sorting:**
     - Urutkan berdasarkan rating (tertinggi/terendah)
     - Urutkan berdasarkan harga (termurah/termahal)
   - **Bookmark/Wishlist:**
     - Simpan hotel favorit dengan fitur bookmark
     - Data wishlist disimpan di localStorage
     - Tombol untuk menampilkan hanya hotel yang di-bookmark
   - Informasi fasilitas hotel ditampilkan dengan badge
   - Detail ruangan dengan harga

### 3. **Halaman Detail Hotel (Detail)**
   - Galeri foto hotel dengan multiple images
   - Informasi lengkap hotel:
     - Nama dan lokasi
     - Rating dan review summary
     - Badge khusus (Top Rated, Luxury Array, dll)
     - Deskripsi detail
   - **Daftar ruangan dengan:**
     - Jenis ruangan
     - Kapasitas tamu
     - Harga per malam
     - Gambar ruangan
   - **Fitur pemesanan:**
     - Date picker untuk check-in dan check-out
     - Pilihan jumlah tamu
     - Perhitungan harga total
   - Tombol "Book Now" untuk melanjutkan proses pemesanan

### 4. **Fitur Umum**
   - **Responsive Design**: Optimal di semua ukuran layar (mobile, tablet, desktop)
   - **Navigasi Intuitif**: Navigation bar yang konsisten di semua halaman
   - **Format Currency**: Menampilkan harga dalam format Rupiah Indonesia
   - **Local Storage**: Menyimpan data bookmark user
   - **Data Persistence**: Perubahan tidak hilang saat refresh halaman

## 💻 Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur markup semantik
- **CSS3**: Styling dan responsive layout
- **Vanilla JavaScript (ES6+)**: Logic aplikasi tanpa framework tambahan
  - Async/await untuk operasi asynchronous
  - Array methods untuk manipulasi data
  - Event listeners untuk interaksi user

### UI Framework & Library
- **Bootstrap 5.3.2**: Framework CSS untuk responsive design dan komponen UI
- **Bootstrap Icons**: Icon library untuk berbagai keperluan UI
- **Flatpickr**: Date picker library untuk memilih tanggal

### Data & Storage
- **JSON**: Format data untuk menyimpan informasi hotel
- **LocalStorage**: Browser storage untuk menyimpan bookmark/wishlist user

### External Resources
- **Unsplash Images**: Gambar hotel berkualitas tinggi dari API Unsplash
- **Google Fonts**: Font eksternal untuk typography yang lebih baik

## 📁 Struktur Folder

```
ets-hotel/
├── index.html              # Halaman beranda
├── script.js               # Logic untuk halaman beranda
├── style.css               # Styling global
├── data/
│   └── data.json          # Database hotel dan room
├── search/
│   ├── index.html         # Halaman pencarian
│   ├── script.js          # Logic untuk halaman pencarian
│   └── style.css          # Styling khusus halaman pencarian
└── detail/
    ├── index.html         # Halaman detail hotel
    ├── script.js          # Logic untuk halaman detail
    └── style.css          # Styling khusus halaman detail
```

## 📊 Data Hotel

File `data/data.json` berisi array hotel dengan struktur:
```json
{
  "id": 1,
  "name": "Hotel Name",
  "location": "City",
  "rating": 4.8,
  "badge": "Top Rated",
  "image": "thumbnail_url",
  "images": ["url1", "url2", ...],
  "description": "Hotel description",
  "features": ["Free Wifi", "Free Cancellation", ...],
  "rooms": [
    {
      "id": "1-r1",
      "type": "Room Type",
      "capacity": 2,
      "price": 4500000,
      "image": "room_image_url"
    }
  ]
}
```
