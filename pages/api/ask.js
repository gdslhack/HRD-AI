import { askAiWithRandomModel } from "@/lib/askAi";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method tidak diizinkan. Gunakan POST." });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt tidak boleh kosong dan harus berupa teks." });
  }

  try {
    const result = await askAiWithRandomModel(prompt);
    return res.status(200).json({ result });
  } catch (error) {
    console.error("❌ ERROR saat panggil AI:", error);
    return res.status(500).json({
      error: "Gagal menghubungi AI",
      detail: error.message || "Terjadi kesalahan internal.",
    });
  }
}
