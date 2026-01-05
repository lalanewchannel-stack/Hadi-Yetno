
import React, { useState } from 'react';
import Header from './components/Header';
import LyricCard from './components/LyricCard';
import { generateRnBContent } from './services/geminiService';
import { GenerationResult, RnBStyle, Language } from './types';

const STYLE_DESCRIPTIONS: Record<RnBStyle, string> = {
  [RnBStyle.CLASSIC]: "Soul & blues roots; emotional vocals, traditional arrangements.",
  [RnBStyle.CONTEMPORARY]: "Modern, pop-infused; smooth electronic production.",
  [RnBStyle.NEO_SOUL]: "R&B mixed with jazz/funk; organic and artistic vibe.",
  [RnBStyle.ALTERNATIVE]: "Experimental & atmospheric; minimalist beats, dark mood.",
  [RnBStyle.HIPHOP_SOUL]: "R&B vocals over heavy hip-hop beats and rhythms.",
  [RnBStyle.FUNK]: "Groovy rhythms, thick basslines, danceable tempo.",
  [RnBStyle.QUIET_STORM]: "Soft and romantic; slow jams for relaxed settings."
};

const MOODS = ['Soulful', 'Romantic', 'Melancholic', 'Groovy', 'Chill', 'Energetic', 'Sensual', 'Sad', 'Upbeat'];

type ActiveTab = 'info' | 'lyrics' | 'suno';

export default function App() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<RnBStyle>(RnBStyle.CONTEMPORARY);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [customLanguage, setCustomLanguage] = useState('');
  const [vocal, setVocal] = useState('Female');
  const [bpm, setBpm] = useState(90);
  const [mood, setMood] = useState('Soulful');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (language === Language.CUSTOM && !customLanguage.trim()) return;
    setLoading(true);
    try {
      const data = await generateRnBContent(topic, style, vocal, language, customLanguage, bpm, mood);
      setResult(data);
      setActiveTab('info');
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat lagu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const getAllLyrics = () => {
    if (!result) return '';
    const { lyrics } = result;
    return `${lyrics.title}

[Intro]
${lyrics.intro}

[Verse 1]
${lyrics.verse1}

[Chorus]
${lyrics.chorus}

[Instrumental Break]
${lyrics.instrumentalBreak}

[Verse 2]
${lyrics.verse2}

[Chorus]
${lyrics.chorus}

[Bridge]
${lyrics.bridge}

[Final Chorus (Extended)]
${lyrics.finalChorus}

[Outro]
${lyrics.outro}`;
  };

  const downloadLyrics = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([getAllLyrics()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${result.lyrics.title.replace(/\s+/g, '_')}_Lyrics.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-purple-500/30">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Settings Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/5 shadow-2xl">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-purple-400 text-sm"></i>
                Song Studio
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Tema / Vibe</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Malam yang tenang di Jakarta..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Bahasa</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-2"
                  >
                    {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {language === Language.CUSTOM && (
                    <input 
                      type="text"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Masukkan bahasa (contoh: Javanese)"
                      className="w-full bg-purple-900/10 border border-purple-500/30 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none animate-in fade-in duration-300"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Mood</label>
                    <select 
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">BPM</label>
                    <input 
                      type="number"
                      min="40"
                      max="200"
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Gaya R&B</label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value as RnBStyle)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none mb-1"
                  >
                    {Object.values(RnBStyle).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic px-1">{STYLE_DESCRIPTIONS[style]}</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Vokal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Female', 'Male'].map(v => (
                      <button
                        key={v}
                        onClick={() => setVocal(v)}
                        className={`py-2 rounded-xl text-sm font-medium transition-all ${vocal === v ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={loading || !topic}
                  className="w-full mt-2 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <><i className="fa-solid fa-circle-notch animate-spin"></i> Brewin' Soul...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate Music</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Navigation Tabs */}
                <div className="flex gap-2 bg-slate-900/40 p-1 rounded-xl border border-white/5">
                  {(['info', 'lyrics', 'suno'] as ActiveTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {tab === 'info' ? 'Info' : tab === 'lyrics' ? 'Lirik' : 'Suno AI'}
                    </button>
                  ))}
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 relative min-h-[500px]">
                  {/* TAB 1: INFO */}
                  {activeTab === 'info' && (
                    <div className="animate-in fade-in duration-500">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                          <i className="fa-solid fa-compact-disc text-2xl text-purple-400 animate-spin-slow"></i>
                        </div>
                        <div>
                          <h3 className="text-3xl font-serif italic gradient-text">{result.lyrics.title}</h3>
                          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Generated Project Info</p>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20">
                        <table className="w-full text-left border-collapse">
                          <tbody>
                            {[
                              { label: 'Title', value: result.lyrics.title, icon: 'fa-heading' },
                              { label: 'Language', value: language === Language.CUSTOM ? customLanguage : language, icon: 'fa-language' },
                              { label: 'Tempo', value: `${result.suno.bpm} BPM`, icon: 'fa-heartbeat' },
                              { label: 'Atmosphere', value: result.suno.mood, icon: 'fa-masks-theater' },
                              { label: 'Style', value: style, icon: 'fa-music' },
                              { label: 'Vocals', value: vocal, icon: 'fa-microphone-lines' }
                            ].map((row, idx) => (
                              <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                <td className="p-4 w-48 text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-3">
                                  <i className={`fa-solid ${row.icon} w-4 text-purple-500/50`}></i>
                                  {row.label}
                                </td>
                                <td className="p-4 text-sm text-slate-200 font-medium">{row.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LIRIK */}
                  {activeTab === 'lyrics' && (
                    <div className="animate-in fade-in duration-500">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Lirik Lagu</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={downloadLyrics}
                            className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-slate-700"
                          >
                            <i className="fa-solid fa-download"></i> Save .txt
                          </button>
                          <button 
                            onClick={() => copyToClipboard(getAllLyrics(), 'Lyrics')}
                            className="px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-purple-500/30"
                          >
                            {copyStatus === 'Lyrics' ? <><i className="fa-solid fa-check"></i> Copied</> : <><i className="fa-solid fa-copy"></i> Copy All</>}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <LyricCard label="Intro" content={result.lyrics.intro} />
                        <LyricCard label="Verse 1" content={result.lyrics.verse1} />
                        <LyricCard label="Chorus" content={result.lyrics.chorus} />
                        <div className="border-y border-white/5 py-4 my-6 italic text-slate-500 text-sm font-mono flex items-center gap-4">
                          <span className="shrink-0 font-bold tracking-tighter">[Instrumental Break]</span>
                          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>
                        <div className="pl-6 text-sm text-slate-400 border-l border-white/5 italic mb-8">{result.lyrics.instrumentalBreak}</div>
                        <LyricCard label="Verse 2" content={result.lyrics.verse2} />
                        <LyricCard label="Bridge" content={result.lyrics.bridge} />
                        <LyricCard label="Final Chorus" content={result.lyrics.finalChorus} />
                        <LyricCard label="Outro" content={result.lyrics.outro} />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROMPT SUNO */}
                  {activeTab === 'suno' && (
                    <div className="animate-in fade-in duration-500 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold flex items-center gap-2">
                          <i className="fa-solid fa-bolt text-yellow-500"></i>
                          Suno AI Configuration
                        </h3>
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-tighter rounded border border-indigo-500/20">Optimized for v3.5 / v4</span>
                      </div>

                      <div className="space-y-6">
                        {/* Style Box */}
                        <div className="relative group">
                          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Style Prompt</label>
                          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl text-sm font-mono text-purple-300 relative">
                            {result.suno.style}
                            <button 
                              onClick={() => copyToClipboard(result.suno.style, 'SunoStyle')}
                              className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className={`fa-solid ${copyStatus === 'SunoStyle' ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                            </button>
                          </div>
                        </div>

                        {/* Description Box */}
                        <div className="relative group">
                          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Description / Lyrics Meta</label>
                          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl text-sm leading-relaxed text-slate-300 relative italic">
                            {result.suno.description}
                            <button 
                              onClick={() => copyToClipboard(result.suno.description, 'SunoDesc')}
                              className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className={`fa-solid ${copyStatus === 'SunoDesc' ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                            </button>
                          </div>
                        </div>

                        {/* Tags Box */}
                        <div className="relative group">
                          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Tags / Keywords</label>
                          <div className="bg-slate-900/60 border border-white/5 p-4 rounded-xl text-sm font-mono text-indigo-300 relative flex flex-wrap gap-2">
                            {result.suno.tags.split(',').map((tag, i) => (
                              <span key={i} className="bg-indigo-500/10 px-2 py-1 rounded text-[11px] border border-indigo-500/20">{tag.trim()}</span>
                            ))}
                            <button 
                              onClick={() => copyToClipboard(result.suno.tags, 'SunoTags')}
                              className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <i className={`fa-solid ${copyStatus === 'SunoTags' ? 'fa-check text-green-400' : 'fa-copy'}`}></i>
                            </button>
                          </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                          <div className="space-y-4">
                            <div>
                               <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-2">
                                <span className="text-slate-500">Weirdness</span>
                                <span className="text-purple-400">{result.suno.weirdness}</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" style={{ width: `${result.suno.weirdness}%` }}></div>
                              </div>
                            </div>
                            <div>
                               <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-2">
                                <span className="text-slate-500">Style Influence</span>
                                <span className="text-indigo-400">{result.suno.styleInfluence}</span>
                              </div>
                              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${result.suno.styleInfluence}%` }}></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-center items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                            <i className="fa-solid fa-circle-info text-slate-600 mb-2"></i>
                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-tighter leading-tight font-bold">
                              Use these parameters in Suno's "Custom Mode" for the best results.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                  <i className="fa-solid fa-music text-3xl text-slate-800"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-serif italic text-slate-400">Ready to Create?</h3>
                  <p className="text-slate-600 max-w-sm mx-auto text-sm">
                    Configure your preferences and hit "Generate Music" to start your R&B journey.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
