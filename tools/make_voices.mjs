// 用 VOICEVOX 把遊戲裡所有固定台詞做成音檔，輸出到 audio/，並寫出 audio/index.json。
// 用法：先啟動 VOICEVOX 引擎（http://127.0.0.1:50021），再執行 node tools/make_voices.mjs
// 已經做過的音檔會跳過，之後新增台詞時重跑一次即可。
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PHRASES, QUESTS, EVENTS, CONFUSED, voiceOf } from '../js/data.js';

const ENGINE = 'http://127.0.0.1:50021';
const OUT = fileURLToPath(new URL('../audio/', import.meta.url));

// 每個聲音代號對應 VOICEVOX 的角色和風格；speed / pitch / intonation 是微調
// 只選「商用・非商用都可以、標註來源即可」的聲音（もち子さん不能用在遊戲、No.7 商用要先申請，所以沒選）
export const VOICES = {
  guide:         { speaker: '東北ずん子', style: 'ノーマル' },
  announce:      { speaker: 'WhiteCUL', style: 'ノーマル' },
  yui:           { speaker: '冥鳴ひまり', style: 'ノーマル' },
  npc_konbini:   { speaker: '玄野武宏', style: 'ノーマル' },
  npc_obasan:    { speaker: '東北イタコ', style: 'ノーマル', pitch: -0.05, speed: 0.9 },
  npc_ramen:     { speaker: '青山龍星', style: 'ノーマル' },
  npc_cafe:      { speaker: '九州そら', style: 'ノーマル' },
  npc_omiyage:   { speaker: '雀松朱司', style: 'ノーマル' },
  npc_drugstore: { speaker: '波音リツ', style: 'ノーマル' },
  npc_izakaya:   { speaker: '白上虎太郎', style: 'わーい' },
  npc_salaryman: { speaker: '麒ヶ島宗麟', style: 'ノーマル' },
  npc_yatai:     { speaker: '青山龍星', style: '熱血' },
};

// 遊戲裡會唸出來的每一句：{ voice, text }
function collectLines() {
  const lines = new Map();
  const add = (voice, text) => lines.set(`${voice}|${text}`, { voice, text });
  for (const p of Object.values(PHRASES)) add('guide', p.ja);
  for (const q of QUESTS) {
    for (const n of Object.values(q.nodes)) if (n.npc) add(voiceOf(q.cast[n.npc.who]), n.npc.ja);
    // 說錯時，這個地點的每個角色都可能說 CONFUSED 的話
    for (const c of Object.values(q.cast)) for (const [ja] of CONFUSED) add(voiceOf(c), ja);
  }
  for (const e of EVENTS) add(e.voice, e.ja);
  return [...lines.values()];
}

async function resolveStyles() {
  const speakers = await (await fetch(`${ENGINE}/speakers`)).json();
  const ids = {};
  for (const [key, v] of Object.entries(VOICES)) {
    const sp = speakers.find(s => s.name === v.speaker);
    const st = sp?.styles.find(s => s.name === v.style);
    if (!st) throw new Error(`找不到聲音 ${v.speaker}（${v.style}）`);
    ids[key] = st.id;
  }
  return ids;
}

// 引擎會讀錯的詞：唸之前換成正確的讀音（例如「十分」會唸成「じゅうぶん」）
const READINGS = [
  ['十分くらい', 'じゅっぷんくらい'],
  ['何ですか', 'なんですか'],
  ['日本に', 'にほんに'],
  ['数日', 'すうじつ'],
];
const spoken = text => READINGS.reduce((t, [from, to]) => t.replaceAll(from, to), text).replace(/……/g, '…');

async function synth(text, id, v) {
  const q = await (await fetch(`${ENGINE}/audio_query?speaker=${id}&text=${encodeURIComponent(text)}`, { method: 'POST' })).json();
  q.speedScale *= v.speed ?? 1;
  q.pitchScale += v.pitch ?? 0;
  q.intonationScale *= v.intonation ?? 1;
  q.prePhonemeLength = 0.05;
  q.postPhonemeLength = 0.15;
  const res = await fetch(`${ENGINE}/synthesis?speaker=${id}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q),
  });
  if (!res.ok) throw new Error(`合成失敗：${text}`);
  return Buffer.from(await res.arrayBuffer());
}

const ids = await resolveStyles();
mkdirSync(OUT, { recursive: true });
const index = {};
let made = 0;
for (const { voice, text } of collectLines()) {
  const v = VOICES[voice];
  if (!v) throw new Error(`沒有設定聲音：${voice}`);
  // 檔名包含聲音設定和實際唸的內容，換聲音或改讀音時會重做
  const hash = createHash('sha1').update(JSON.stringify([v, spoken(text)])).digest('hex').slice(0, 10);
  const file = `${voice}_${hash}.mp3`;
  index[`${voice}|${text}`] = file;
  if (existsSync(OUT + file)) continue;
  const wav = OUT + file.replace('.mp3', '.wav');
  writeFileSync(wav, await synth(spoken(text), ids[voice], v));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-b:a', '64k', OUT + file]);
  unlinkSync(wav);
  made++;
}
const old = existsSync(OUT + 'index.json') ? JSON.parse(readFileSync(OUT + 'index.json', 'utf8')) : {};
const used = new Set(Object.values(index));
for (const f of readdirSync(OUT)) if (f.endsWith('.mp3') && !used.has(f)) unlinkSync(OUT + f);
writeFileSync(OUT + 'index.json', JSON.stringify(index, null, 1));
console.log(`共 ${Object.keys(index).length} 句，這次新做 ${made} 個音檔（原本 ${Object.keys(old).length} 句）`);
