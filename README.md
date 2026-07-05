# 🎮 ISRARUDDIN - Retro Pokémon Developer Portfolio & Battle Game

Selamat datang di repositori portofolio developer bergaya retro Pokémon 8-bit milik **Israruddin**! Proyek ini menggunakan arsitektur full-stack modern dengan **Vite (React)** di sisi client, **Express** sebagai backend API, dan **TSX** sebagai runtime TypeScript server-side.

---

## 🚀 Cara Menjalankan Proyek Langsung di VS Code

Kami telah menyediakan konfigurasi otomatis VS Code di folder `.vscode`. Ikuti langkah-langkah mudah di bawah ini untuk menjalankannya secara instan:

### Langkah 1: Persyaratan Sistem
Pastikan komputer Anda sudah terpasang:
*   **Node.js** (Versi 18 ke atas direkomendasikan) — [Unduh di sini](https://nodejs.org/)
*   **Visual Studio Code** — [Unduh di sini](https://code.visualstudio.com/)

### Langkah 2: Buka Folder Proyek di VS Code
1.  Buka aplikasi Visual Studio Code.
2.  Pilih menu **File** > **Open Folder...** (atau **Open...** di macOS).
3.  Pilih folder root dari proyek ini (folder yang berisi file `package.json` ini).

### Langkah 3: Konfigurasi Environment Variables (Opsional)
Jika Anda membutuhkan integrasi AI atau fitur database persistensi:
1.  Salin file `.env.example` dan beri nama baru yaitu `.env` di folder utama.
2.  Buka file `.env` dan masukkan API Key Anda:
    ```env
    # Masukkan Google Gemini API Key Anda jika ingin menggunakan fitur AI server-side
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

### Langkah 4: Jalankan Otomatis dengan Sekali Klik (Sangat Direkomendasikan)
Kami telah mengonfigurasi fitur **Run and Debug** di VS Code:
1.  Tekan tombol **F5** di keyboard Anda, ATAU buka tab **Run and Debug** di sidebar kiri VS Code (ikon segitiga play dengan serangga 🐞).
2.  Klik tombol hijau **Play** (Jalankan Dev Server (Vite + Express)) di bagian atas sidebar.
3.  **Selesai!** VS Code akan otomatis:
    *   Menjalankan perintah `npm install` untuk memasang semua library yang dibutuhkan.
    *   Memulai server lokal di terminal terintegrasi.
    *   Aplikasi Anda siap diakses melalui browser di alamat: **`http://localhost:3000`**

---

## 🛠️ Cara Menjalankan Secara Manual via Terminal

Jika Anda lebih memilih menjalankan secara manual menggunakan Terminal, Anda bisa mengikuti perintah berikut:

1.  **Pasang Dependensi:**
    ```bash
    npm install
    ```
2.  **Jalankan Mode Pengembangan (Development):**
    ```bash
    npm run dev
    ```
    Setelah itu, buka browser Anda di: [http://localhost:3000](http://localhost:3000)

3.  **Kompilasi ke Produksi (Build):**
    ```bash
    npm run build
    ```
4.  **Jalankan Aplikasi Hasil Kompilasi (Production):**
    ```bash
    npm run start
    ```

---

## 📁 Struktur Folder Utama

*   `/src` — Folder utama source code aplikasi web (Vite & React).
    *   `/src/components` — Komponen interaktif (BattleArena, LoadingScreen, Hero, dll).
    *   `/src/utils` — Sound engine 8-bit & synthesizer sequencer musik latar.
    *   `/src/assets` — Aset gambar termasuk potret pixel art Israruddin.
*   `server.ts` — Server Express terintegrasi dengan Vite middleware untuk menangani aset dan API.
*   `.vscode` — Folder konfigurasi otomatis untuk memudahkan jalannya proyek di VS Code.

Selamat menjelajahi portofolio retro Pokémon ini! Semoga perjalanan petualangan Anda menyenangkan! ⚡👾
