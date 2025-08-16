# eCustomers - Modern Fashion Store

## Deskripsi
eCustomers adalah platform belanja online yang menyediakan produk fashion muslimah dengan desain modern dan pengalaman belanja yang mudah. 

## Struktur Proyek
```
/assets
  /css
    - modern-style.css
  /data
    - products.seed.json
  /images
    - [daftar gambar produk]
  /js
    - modern.js
index.html
pages
  - kategori.html
  - kontak.html
  - tentang.html
  - cart.html
  - promo.html
```

## Mengedit Produk
1. **File Data Produk**: 
   - Semua data produk disimpan dalam file `assets/data/products.seed.json`.
   - Format data produk:
     ```json
     {
       "id": 101,
       "name": "Nama Produk",
       "price": 15000,
       "category": "Kategori",
       "promo": true,
       "discount": 10,
       "rating": 4.5,
       "image": "nama_gambar.jpg",
       "source": "sumber_produk"
     }
     ```
   - Anda dapat menambahkan, menghapus, atau mengedit produk dengan mengikuti format di atas.

2. **Mengganti Nomor WhatsApp**:
   - Nomor WhatsApp dapat diubah di file `assets/js/modern.js`.
   - Temukan bagian berikut dan ganti dengan nomor WhatsApp Anda:
     ```javascript
     const CONFIG = {
       whatsappNumber: '6281234567890', // Ganti dengan nomor WhatsApp Anda
     };
     ```

## Fitur
- **Responsive Design**: Menggunakan Bootstrap 5 untuk memastikan tampilan yang baik di perangkat mobile dan desktop.
- **WhatsApp Checkout**: Pengguna dapat melakukan pemesanan langsung melalui WhatsApp.
- **Promo dan Diskon**: Terdapat fitur promo untuk produk tertentu.

## Cara Menjalankan Proyek
1. Pastikan Anda memiliki server lokal seperti XAMPP atau MAMP.
2. Tempatkan folder proyek di dalam direktori `htdocs` (XAMPP) atau `htdocs` (MAMP).
3. Akses proyek melalui browser dengan URL: `http://localhost/eCustomers`.

## Kontak
Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, silakan hubungi kami melalui WhatsApp di [nomor WhatsApp Anda].

---

Terima kasih telah menggunakan eCustomers!
