# 🤖 HRD AI - Interview Simulator

HRD AI adalah aplikasi simulasi interview kerja berbasis web yang memanfaatkan AI (OpenRouter) untuk memberikan pertanyaan, menerima jawaban dari user, dan memberikan evaluasi secara otomatis. Cocok digunakan oleh jobseeker yang ingin latihan interview dengan nuansa real!

## 🔥 Fitur Unggulan

- Simulasi interview berbasis posisi & perusahaan pilihan user.
- AI bertindak sebagai HRD profesional.
- Bertanya secara bertahap (step-by-step).
- Evaluasi akhir: penilaian, saran, contoh jawaban, dan pesan penyemangat.
- UI modern, elegan, dan mobile-friendly.
- Dukungan follow-up jika jawaban terlalu pendek.

## 🛠️ Teknologi

- Next.js 14
- Tailwind CSS
- Framer Motion
- OpenRouter (model: `meta-llama/llama-3.3-70b-instruct`)
- OpenAI API Compatible (via OpenRouter)

## 🧪 Cara Menjalankan Lokal

1. **Clone Repository**

```bash
git clone https://github.com/gdslhack/HRD-AI.git
cd HRD-AI
```

2. **Install Dependencies**

```bash
npm install
```

3. **Buat file `.env.local`**

```env
OPENROUTER_API_KEY=sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. **Jalankan lokal**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy ke Vercel

1. Push ke GitHub
2. Buka [https://vercel.com/import](https://vercel.com/import)
3. Pilih repo HRD AI
4. Tambahkan Environment Variable:
   - `OPENROUTER_API_KEY`
5. Deploy 🎉

## 📄 Lisensi

MIT License

---

Made with ❤️ by [dpramadan](https://github.com/gdslhack)
