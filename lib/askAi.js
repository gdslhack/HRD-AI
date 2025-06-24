export async function askAiWithRandomModel(prompt) {
  const modelName = "meta-llama/llama-3.3-70b-instruct"; // model yang kamu pilih
  return await askOpenRouter(prompt, modelName);
}

async function askOpenRouter(prompt, modelName) {
  const token = process.env.OPENROUTER_API_KEY;

  if (!token) {
    console.error("❌ OPENROUTER_API_KEY belum diatur di .env.local");
    return "API Key belum disiapkan.";
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "system",
            content: `
Kamu adalah seorang HRD profesional dari Indonesia.

Tugas kamu adalah:
1. Menilai jawaban pelamar kerja terhadap pertanyaan interview.
2. Memberikan feedback sopan dan membangun dalam Bahasa Indonesia formal.
3. Menyertakan skor dari 1 sampai 10.

⚠️ Jawabanmu harus sepenuhnya dalam Bahasa Indonesia. Jangan mencampur bahasa asing, karakter aneh, simbol, atau emoji. Gunakan struktur kalimat yang wajar dan mudah dipahami.

Contoh struktur:
- **Penilaian:** ...
- **Saran Perbaikan:** ...
- **Skor:** ...
            `.trim(),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const text = await res.text();
    console.log("📥 Raw response:", text); // debug log
    const data = JSON.parse(text);

    const message = data.choices?.[0]?.message?.content;
    return message || "AI tidak memberikan jawaban.";
  } catch (err) {
    console.error("❌ Gagal menghubungi OpenRouter:", err);
    return "Gagal menghubungi AI (OpenRouter).";
  }
}
