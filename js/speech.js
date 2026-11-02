// 瀏覽器內建的語音合成（NPC 說話）與語音辨識（玩家開口）。

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
// Brave 有語音辨識的介面，但關掉了背後的 Google 服務，一按就失敗（network 錯誤），所以當作不支援
export const isBrave = !!navigator.brave;
export const asrSupported = !!SR && !isBrave;
export const ttsSupported = 'speechSynthesis' in window;

let sysVoice = null;
function pickVoice() {
  const ja = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('ja'));
  sysVoice = ja.find(v => /Kyoko|Otoya|O-ren|Google/i.test(v.name)) || ja[0] || null;
}
if (ttsSupported) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}
export const hasJaVoice = () => !!sysVoice;

// 預先用 VOICEVOX 做好的音檔：audio/index.json 是「聲音|台詞」對應到檔名的表
// 找得到就播音檔，找不到（例如之後新加的台詞）才用瀏覽器的語音合成
const AUDIO_DIR = 'audio/';
let clips = {};
fetch(AUDIO_DIR + 'index.json').then(r => r.ok ? r.json() : {}).then(m => { clips = m; }).catch(() => {});
let playing = null;

export function speak(text, { rate = 1, pitch = 1, voice = 'guide' } = {}) {
  stopSpeaking();
  const file = clips[`${voice}|${text}`];
  if (file) return playClip(AUDIO_DIR + file, rate);
  return synth(text, rate, pitch);
}

function playClip(src, rate) {
  return new Promise(resolve => {
    const a = new Audio(src);
    a.playbackRate = rate;   // 慢速播放時保持音高（瀏覽器預設 preservesPitch）
    a.onended = a.onerror = a.onpause = () => resolve();
    playing = a;
    a.play().catch(() => resolve());
  });
}

function synth(text, rate, pitch) {
  return new Promise(resolve => {
    if (!ttsSupported) return resolve();
    const u = new SpeechSynthesisUtterance(text.replace(/……/g, '、'));
    u.lang = 'ja-JP';
    if (sysVoice) u.voice = sysVoice;
    u.rate = rate;
    u.pitch = pitch;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    // 有些瀏覽器不會觸發 onend，用時間保底
    setTimeout(finish, 1500 + (text.length * 300) / rate);
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (playing) { playing.pause(); playing = null; }
  if (ttsSupported) speechSynthesis.cancel();
}

// 回傳 { promise, stop }；promise 解析為候選文字陣列，失敗時以錯誤代碼 reject
export function listen({ onInterim } = {}) {
  const rec = new SR();
  rec.lang = 'ja-JP';
  rec.interimResults = true;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  let alternatives = [];
  const promise = new Promise((resolve, reject) => {
    rec.onresult = e => {
      const res = e.results[e.results.length - 1];
      if (res.isFinal) alternatives = [...res].map(a => a.transcript.trim()).filter(Boolean);
      else onInterim?.(res[0].transcript);
    };
    rec.onerror = e => { if (e.error !== 'aborted') reject(e.error); };
    rec.onend = () => resolve(alternatives);
  });
  rec.start();
  return { promise, stop: () => rec.stop() };
}
