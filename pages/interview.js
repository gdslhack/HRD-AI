import { useState } from "react";
import { motion } from "framer-motion";

export default function Interview() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [followupMessage, setFollowupMessage] = useState("");
  const [isAwaitingDetail, setIsAwaitingDetail] = useState(false);

  const handleStart = async () => {
    if (!name || !company || !position) return alert("Harap isi semua data.");
    setStep(2);
    await fetchFirstQuestion();
  };

  const fetchFirstQuestion = async () => {
    setLoading(true);
    try {
      const prompt = `Kamu adalah HRD profesional yang ramah dan bersahabat dari perusahaan ${company}. Kamu sedang melakukan interview untuk posisi ${position}. Mulailah dengan 1 pertanyaan yang santai, dan jangan terlalu formal.`;
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setCurrentQuestion(data.result);
    } catch (err) {
      setCurrentQuestion("Gagal mendapatkan pertanyaan dari AI.");
    }
    setLoading(false);
  };

  const handleAnswerSubmit = async () => {
    if (!userAnswer) return;
    setFollowupMessage("");

    // Jika sebelumnya minta detail, lanjut saja ke pertanyaan berikutnya
    if (isAwaitingDetail || userAnswer.length < 30) {
      if (!isAwaitingDetail) {
        setFollowupMessage("🙏 Jawaban kamu masih cukup singkat. Boleh ceritakan lebih lengkap lagi?");
        setIsAwaitingDetail(true);
        return;
      }
    }

    const newAnswers = [...answers, { question: currentQuestion, answer: userAnswer }];
    setAnswers(newAnswers);
    setUserAnswer("");
    setIsAwaitingDetail(false);

    if (newAnswers.length >= 3) {
      await fetchFinalEvaluation(newAnswers);
      setStep(3);
      return;
    }

    setLoading(true);
    try {
      const prompt = `Kamu adalah HRD ramah dari ${company}. Berikut adalah ${newAnswers.length} jawaban dari pelamar bernama ${name} untuk posisi ${position}:

` +
        newAnswers.map((q, i) => `${i + 1}. Q: ${q.question}\nA: ${q.answer}`).join("\n\n") +
        `\n\nBerikan pertanyaan interview ke-${newAnswers.length + 1} dengan nada santai tapi profesional. Tambahkan komentar kasual setelahnya jika cocok.`;

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setCurrentQuestion(data.result);
    } catch (err) {
      setCurrentQuestion("Gagal mendapatkan pertanyaan berikutnya.");
    }
    setLoading(false);
  };

  const fetchFinalEvaluation = async (answers) => {
    setLoading(true);
    try {
      const prompt = `Sebagai HRD yang ramah dan suportif dari ${company}, nilai jawaban pelamar bernama ${name} untuk posisi ${position}. Berikut adalah jawabannya:

` +
        answers.map((q, i) => `${i + 1}. Pertanyaan: ${q.question}\nJawaban: ${q.answer}`).join("\n\n") +
        `\n\nBerikan:\n- Penilaian umum\n- Saran perbaikan yang membangun\n- Contoh jawaban ideal\n- Skor dari 1-10\n- Kalimat penyemangat\n\nGunakan gaya bahasa luwes, manusiawi, dan sopan. Jangan terlalu kaku.`;

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("Gagal mendapatkan hasil evaluasi dari AI.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-black text-white flex items-center justify-center px-4 py-10">
      <motion.div layout className="w-full max-w-3xl bg-slate-900 p-8 rounded-3xl shadow-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-400">💼 HRD AI</h1>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm text-center text-gray-400 mb-6">Masukkan informasi berikut untuk memulai simulasi interview.</p>
            <div className="space-y-4">
              <input type="text" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="Perusahaan impian" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="Posisi yang dilamar" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button onClick={handleStart} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold">🚀 Mulai Interview</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-xl font-bold mb-4">🗣️ Pertanyaan {answers.length + 1}</h2>
            <p className="text-base mb-4 whitespace-pre-line bg-gray-800 p-4 rounded-xl text-gray-300">{currentQuestion}</p>
            <textarea rows={4} className="w-full p-3 rounded-xl bg-gray-800 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tulis jawaban Anda..." value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
            {followupMessage && <p className="text-yellow-400 mb-2">{followupMessage}</p>}
            <button onClick={handleAnswerSubmit} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold text-black" disabled={loading}>{loading ? "Memproses..." : "Kirim Jawaban"}</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left space-y-6">
            <h2 className="text-2xl font-bold text-green-400">✅ Evaluasi HRD Selesai</h2>
            <div className="bg-gray-800 p-4 rounded-xl text-sm max-h-[400px] overflow-y-auto whitespace-pre-line text-gray-200">
              {result || "Menunggu hasil..."}
            </div>
            <button onClick={() => { setStep(1); setAnswers([]); setQuestionIndex(0); setQuestions([]); setUserAnswer(""); setCurrentQuestion(""); setResult(""); setFollowupMessage(""); setIsAwaitingDetail(false); }} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-white font-semibold">
              🔁 Ulangi Interview
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
