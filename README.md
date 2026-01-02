# Sistem Sertifikat Gedung Sekolah

## 1. Setup Google Apps Script
1. Buka https://script.google.com/
2. Buat project baru → paste `Code.gs`
3. Ganti `SPREADSHEET_ID` dengan ID spreadsheet kamu
4. Ganti `API_TOKEN` dengan token rahasia
5. Deploy → "Deploy as web app" → Pilih "Anyone with the link" → Salin URL
6. Paste URL di `script.js` sebagai `API`

## 2. Setup GitHub Pages
1. Buat repo baru → upload semua file (`index.html`, `login.html`, `style.css`, `script.js`, `logo.png`)
2. Aktifkan GitHub Pages → Branch main / folder root
3. Buka URL GitHub Pages → sistem siap digunakan

## 3. Login
- Username / Password bisa hardcode di `login.js` atau pakai Google Apps Script / Firebase
- Setelah login → redirect ke `index.html`

## 4. Upload Sertifikat
- Klik tombol upload per sekolah → file akan tersimpan di Google Drive
- URL file otomatis tersimpan di sheet → bisa dilihat & diunduh

## 5. Dashboard & Rekap
- Progress % sertifikasi otomatis
- Rekap jumlah sekolah & sertifikat per kecamatan
