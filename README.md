# E-Pocket Book

Aplikasi web mudah alih untuk profil anggota, catatan harian, rekod catatan dan paparan penyelia.

## Terbitkan melalui GitHub Pages

1. Log masuk ke [GitHub](https://github.com).
2. Pilih **New repository**.
3. Namakan repositori, contohnya `e-pocket-book`.
4. Pilih **Public**, kemudian tekan **Create repository**.
5. Pilih **uploading an existing file**.
6. Muat naik fail berikut ke bahagian utama repositori:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `.nojekyll`
7. Tekan **Commit changes**.
8. Buka **Settings → Pages**.
9. Di bawah **Build and deployment**, pilih:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
10. Tekan **Save**.

Selepas beberapa minit, aplikasi akan tersedia di:

`https://NAMA-PENGGUNA.github.io/e-pocket-book/`

## Nota data

Versi ini menyimpan profil dan catatan menggunakan `localStorage`. Data kekal pada pelayar dan peranti yang sama, tetapi belum dikongsi antara pengguna atau peranti. Pangkalan data diperlukan untuk penyimpanan pusat dan akses berbilang pengguna.
