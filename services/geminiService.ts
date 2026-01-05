
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

export const generateRnBContent = async (
  userInput: string, 
  style: string, 
  vocal: string, 
  language: Language,
  customLanguage: string,
  userBpm: number,
  userMood: string
) => {
  // Always initialize client inside the service function to ensure it uses the correct context/key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const selectedLang = language === Language.CUSTOM ? customLanguage : language;

  const prompt = `Hasilkan lagu R&B lengkap bertema: "${userInput}". 
  Gaya Musik: ${style}. 
  Vokal: ${vocal}. 
  Bahasa Lirik: ${selectedLang}.
  Target BPM: ${userBpm}.
  Mood/Atmosphere: ${userMood}.
  
  Patuhi struktur lagu berikut:
  1. Intro
  2. Verse 1
  3. Chorus
  4. Instrumental Break (Deskripsikan instrumennya secara mendalam)
  5. Verse 2
  6. Bridge
  7. Final Chorus (Extended & Soulful)
  8. Outro

  Instruksi Lirik:
  - Tulis lirik dalam ${selectedLang}. 
  - Gunakan metafora yang elegan dan emosi yang dalam khas R&B.
  - Untuk K-R&B, J-R&B, atau bahasa non-English lainnya, sisipkan sedikit frase Bahasa Inggris (2-3 kata) di bagian Chorus atau Bridge untuk nuansa pop modern.

  Berikan output dalam format JSON yang valid:
  {
    "lyrics": {
      "title": "Judul Lagu",
      "intro": "Lirik Intro",
      "verse1": "Lirik Verse 1",
      "chorus": "Lirik Chorus",
      "instrumentalBreak": "Deskripsi Instrumental (English)",
      "verse2": "Lirik Verse 2",
      "bridge": "Lirik Bridge",
      "finalChorus": "Lirik Final Chorus",
      "outro": "Lirik Outro"
    },
    "suno": {
      "style": "Technical style string (e.g. 90s Soul, slow jam, female vocals, rhodes piano)",
      "description": "Short poetic vibe description (English)",
      "tags": "Suno keywords: bpm, genre, mood, instruments, vocals",
      "weirdness": 10-40,
      "styleInfluence": 60-90,
      "bpm": ${userBpm},
      "mood": "${userMood}"
    }
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: 'Anda adalah Songwriter dan Produser R&B kelas dunia (seperti Babyface atau Teddy Park). Anda ahli dalam menulis lirik puitis dan membuat instruksi teknis produksi musik (Suno Prompt). Output HARUS berupa JSON murni.',
      responseMimeType: "application/json",
    },
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("Parsing error:", e);
    throw new Error("Gagal memproses respons AI.");
  }
};
