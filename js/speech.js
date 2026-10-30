// 瀏覽器內建的語音合成（NPC 說話）與語音辨識（玩家開口）。

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const asrSupported = !!SR;
export const ttsSupported = 'speechSynthesis' in window;

let voice = null;
function pickVoice() {
  const ja = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('ja'));
  voice = ja.find(v => /Kyoko|Otoya|O-ren|Google/i.test(v.name)) || ja[0] || null;
}
if (ttsSupported) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}
export const hasJaVoice = () => !!voice;

export function speak(text, { rate = 1, pitch = 1 } = {}) {
  return new Promise(resolve => {
    if (!ttsSupported) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/……/g, '、'));
    u.lang = 'ja-JP';
    if (voice) u.voice = voice;
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
