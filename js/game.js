// 遊戲引擎：排行程（每天三個時段）→ 地點劇情 → 玩家回合（選意思 → 學說法 → 開口）→ 熟練度與養成數值 → 事件 → 結局。
// 跟語言無關的部分都在這裡，語言內容在 data.js。

import { PHRASES, QUESTS, STATS, TIMES, TRIP, EVENTS, ENDINGS, META_REPEAT } from './data.js';
import { judge } from './judge.js';
import { speak, stopSpeaking, listen, asrSupported, ttsSupported, hasJaVoice } from './speech.js';

const SAVE_KEY = 'nihongo-trip-v3';
const MAX_MASTERY = 4;
const LEVEL_LABEL = ['🌱 新句子：先聽，再跟著說', '🔁 跟讀練習', '🧠 回想看看', '✨ 自然說出來'];
const CONFUSED = [['え？', '欸？'], ['すみません、もう一度……？', '不好意思，可以再說一次嗎……？'], ['えっと……？', '呃……？']];

const app = document.getElementById('app');

// keep：再玩一輪時保留學過的句子、看過的結局和設定，旅程本身重新開始
function freshSave(keep = {}) {
  return {
    day: 1, slot: 0, money: TRIP.money, stamina: TRIP.stamina,
    stats: Object.fromEntries(Object.keys(STATS).map(k => [k, 0])),
    usage: {}, today: [], done: [], flags: {}, affection: 0, started: false, finished: false, ending: null,
    mastery: {}, listen: {}, heard: {}, exposure: {}, endings: [],
    settings: { quiet: !asrSupported, alwaysSub: false },
    ...keep,
  };
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.mastery) return { ...freshSave(), ...s, settings: { ...freshSave().settings, ...s.settings } };
  } catch { /* 沒有存檔或無法讀取 */ }
  return null;
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* 私密模式等情況 */ }
}

let save = load() || freshSave();
let screen = 'title';
let cur = null;      // 進行中的支線
let bookOpen = false;
let toast = '';
let events = [];     // 等著顯示的事件結果

// ---------- 素材（assets/ 資料夾裡的圖片和影片） ----------
// 開始時先檢查哪些檔案存在：有圖就顯示圖，沒有就維持 emoji 和漸層背景
const ASSET_DIR = 'assets/';
const FACES = ['normal', 'smile', 'shy', 'surprised', 'confused'];
const IMG_EXT = ['.jpg', '.png', '.webp'];
const assets = new Set();
const assetFound = list => list.find(n => assets.has(n));

const probe = names => Promise.all([...new Set(names)].map(n => fetch(ASSET_DIR + n, { method: 'HEAD', cache: 'no-store' })
  .then(r => { if (r.ok) assets.add(n); }).catch(() => {})));

async function probeAssets() {
  const imgs = new Set(QUESTS.flatMap(q => Object.values(q.cast).map(c => c.img)).filter(Boolean));
  const first = [...imgs].flatMap(img => [`${img}.png`, `${img}_normal.png`]);
  for (const q of QUESTS) {
    if (q.bgImg) first.push(...IMG_EXT.map(ext => q.bgImg + ext));
    for (const n of Object.values(q.nodes)) if (n.cg) first.push(...['.mp4', ...IMG_EXT].map(ext => n.cg + ext));
  }
  await probe(first);
  // 有基本立繪的角色，才去找其他表情（避免一堆找不到檔案的請求）
  await probe([...imgs].filter(img => assets.has(`${img}.png`) || assets.has(`${img}_normal.png`))
    .flatMap(img => FACES.slice(1).map(f => `${img}_${f}.png`)));
  if (assets.size) render();
}

const portraitOf = (who, face) => who.img && assetFound([`${who.img}_${face}.png`, `${who.img}_normal.png`, `${who.img}.png`]);
const bgOf = q => q.bgImg && assetFound(IMG_EXT.map(ext => q.bgImg + ext));

// 事件大圖：有 .mp4 就靜音循環播放（同名圖片當作載入前的畫面）
function viewCg(name) {
  const video = assetFound([`${name}.mp4`]);
  const still = assetFound(IMG_EXT.map(ext => name + ext));
  if (video) return `<video class="cg" src="${ASSET_DIR + video}" ${still ? `poster="${ASSET_DIR + still}"` : ''} autoplay muted loop playsinline></video>`;
  return still ? `<img class="cg" src="${ASSET_DIR + still}" alt="">` : '';
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mastery = id => save.mastery[id] ?? 0;
const listenLevel = concept => save.listen[concept] ?? 0;
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
const stars = n => '★'.repeat(n) + '☆'.repeat(MAX_MASTERY - n);
// 最後一天只有上午和下午（下午搭車回台灣）
const slotsOf = day => day === TRIP.days ? TRIP.lastDaySlots : TIMES.length;
const unlocked = q => !q.requires || (save.flags[q.requires] && (!q.nextDay || save.day > save.flags[q.requires]));
const meets = need => !need || Object.entries(need).every(([k, v]) => save.stats[k] >= v);
const yen = n => `¥${n.toLocaleString()}`;
// 選項的額外效果（數值門檻選項的獎勵），顯示在通過畫面
const effectText = c => [
  c.money > 0 && `💴 省下 ${yen(c.money)}`, c.money < 0 && `💴 多花 ${yen(-c.money)}`,
  c.stamina && `⚡ +${c.stamina}`, c.affection > 0 && `💗 結衣的好感度 +${c.affection}`, c.affection < 0 && `💔 結衣的好感度 −${-c.affection}`,
].filter(Boolean).join('　');
const needText = need => Object.entries(need).map(([k, v]) => `${STATS[k].emoji} ${STATS[k].name} ${v}`).join('、');
const quiet = () => save.settings.quiet || !asrSupported;
const speakerOf = () => cur.lastSpeaker || Object.values(cur.quest.cast)[0];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
// 假名跟原文只差標點時，不必重複顯示
const differs = (a, b) => a.replace(/[\s、。！？!?…]/g, '') !== b.replace(/[\s、。！？!?…]/g, '');

// ---------- 畫面 ----------

function topbar(title, homeAct = 'home') {
  const s = save.settings;
  return `<header class="topbar">
    <button class="icon" data-act="${homeAct}" title="${homeAct === 'leave' ? '離開支線' : '回到上一頁'}">‹</button>
    <span class="tb-title">${title}</span>
    <span class="tb-tools">
      ${asrSupported ? `<button class="icon ${s.quiet ? 'on' : ''}" data-act="toggleQuiet" title="${s.quiet ? '目前：打字模式' : '目前：麥克風模式'}">${s.quiet ? '⌨️' : '🎤'}</button>` : ''}
      <button class="icon ${s.alwaysSub ? 'on' : ''}" data-act="toggleSub" title="一律顯示字幕">字</button>
      <button class="icon" data-act="book" title="句子本">📖</button>
    </span>
  </header>`;
}

function viewTitle() {
  const hasSave = save.started;
  return `<main class="page title">
    <div class="hero">
      <div class="hero-emoji">🗾</div>
      <h1>日本自由行<span>口說冒險</span></h1>
      <p class="lead">你是第一次來日本的旅客。<br>排好每天的行程，開口說日文，看看這趟旅程會怎麼結束。</p>
    </div>
    <ul class="checks">
      <li>${asrSupported ? '✅ 語音辨識可用' : '⚠️ 這個瀏覽器不支援語音辨識，會改用打字模式（建議用 Chrome）'}</li>
      <li>${!ttsSupported ? '⚠️ 不支援語音朗讀' : hasJaVoice() ? '✅ 日文語音可用' : '⚠️ 找不到日文語音，NPC 的發音可能不正確'}</li>
    </ul>
    <div class="actions">
      ${hasSave
        ? `<button class="btn primary" data-act="continue">繼續旅程（${save.finished ? '已結束' : `Day ${save.day}・${TIMES[save.slot].name}`}）</button>
           <button class="btn ghost" data-act="reset">從頭開始</button>`
        : '<button class="btn primary" data-act="start">開始旅程</button>'}
    </div>
    <p class="fine">建議戴耳機、在安靜的地方玩。原型版本：5 天 4 夜、${QUESTS.length} 個地點、${ENDINGS.length} 種結局。</p>
  </main>`;
}

function viewStatus() {
  const dots = Array.from({ length: TRIP.days }, (_, d) => `<span>${Array.from({ length: slotsOf(d + 1) }, (_, i) => {
    const cls = d + 1 < save.day || (d + 1 === save.day && i < save.slot) ? 'past' : d + 1 === save.day && i === save.slot ? 'now' : '';
    return `<i class="${cls}"></i>`;
  }).join('')}</span>`).join('');
  const bars = Object.entries(STATS).map(([k, st]) =>
    `<li><span>${st.emoji} ${st.name}</span><div class="bar"><i style="width:${save.stats[k]}%"></i></div><b>${save.stats[k]}</b></li>`).join('');
  return `<section class="status">
    <div class="res">
      <span>💴 <b>${yen(save.money)}</b></span>
      <span>⚡ <b>${save.stamina}</b>/${TRIP.stamina}</span>
      ${save.done.includes('ramen') ? `<span>💗 結衣 <b>${save.affection}</b>/10</span>` : ''}
    </div>
    <div class="dots" title="旅程進度">${dots}</div>
    <ul class="skills compact">${bars}</ul>
  </section>`;
}

const INTRO = {
  '1-0': '飯店房間裡，你拉開窗簾。第一次來日本，有點緊張，也有點期待。<br>每天有<b>上午、下午、晚上</b>三個時段，排好要去哪裡吧。',
  '2-0': '第二天。學過的句子這次<b>不顯示字幕</b>，聽過的店員用語會先考你聽不聽得懂。',
  '3-0': '第三天。已經漸漸習慣東京的街道了。',
  '4-0': '第四天。明天就要回台灣了，好好把握吧。',
  '5-0': '旅程的最後一天。下午就要去車站，搭車到機場了。',
  '5-1': '該去車站了。行李已經收好。',
};

function viewPlan() {
  const time = TIMES[save.slot];
  const intro = INTRO[`${save.day}-${save.slot}`] ||
    (save.slot === 1 ? '下午了，接下來去哪裡？' : '天黑了，街上的燈籠亮了起來。');
  // hidden 的地點（結衣的約會）解鎖之前不顯示；day 限定某一天
  const visible = QUESTS.filter(q => (!q.hidden || unlocked(q)) && (!q.day || q.day === save.day))
    .sort((a, b) => !!b.hidden - !!a.hidden);
  const now = visible.filter(q => q.times.includes(time.key));
  const later = visible.filter(q => !q.times.includes(time.key));
  const card = q => {
    const open = unlocked(q);
    const why = !open ? '' : q.once && save.done.includes(q.id) ? '已經去過了'
      : save.today.includes(q.id) ? '今天去過了'
      : save.money < q.cost ? '錢不夠' : save.stamina < q.stamina ? '太累了，先休息一下' : '';
    const ok = open && !why;
    return `<button class="quest ${save.done.includes(q.id) ? 'done' : ''} ${ok ? '' : 'locked'} ${q.hidden ? 'date' : ''}" ${ok ? `data-act="quest" data-id="${q.id}"` : 'disabled'}>
      <span class="q-emoji">${open ? q.emoji : '🔒'}</span>
      <span class="q-body"><strong>${open ? esc(q.title) : '？？？'}</strong><small>${esc(open ? q.desc : save.flags[q.requires] ? q.waitDesc : q.lockedDesc)}</small>
        ${open ? `<span class="tags"><span>${q.cost ? yen(q.cost) : '免費'}</span><span>⚡ ${q.stamina}</span><span>${STATS[q.skill].emoji} ${STATS[q.skill].name}</span></span>` : ''}</span>
      <span class="q-state">${why ? `<em>${why}</em>` : save.done.includes(q.id) ? '✓ 去過' : ''}</span>
    </button>`;
  };
  const night = save.slot === slotsOf(save.day) - 1;
  const t = toast;
  toast = '';
  return `<main class="page plan">
    ${topbar(`Day ${save.day}・${time.name}`)}
    ${t ? `<div class="toast">${t}</div>` : ''}
    ${viewStatus()}
    <section class="morning">
      <div class="sun">${time.emoji}</div>
      <h2>Day ${save.day}・${time.name}</h2>
      <p>${intro}</p>
    </section>
    <h3 class="section-title">${time.name}可以去的地方</h3>
    <div class="quests">${now.map(card).join('')}</div>
    <div class="actions">
      <button class="btn" data-act="rest">${night
        ? save.day < TRIP.days ? '🌙 回旅館睡覺（結束今天）' : '✈️ 搭車去機場（結束旅程）'
        : `🏨 回旅館休息（⚡ +${TRIP.rest}）`}</button>
    </div>
    ${later.length ? `<details class="later"><summary>其他時段才開的地方</summary>
      <ul>${later.map(q => `<li>${q.emoji} ${esc(q.title)}<small>${q.times.map(k => TIMES.find(x => x.key === k).name).join('、')}</small></li>`).join('')}</ul>
    </details>` : ''}
  </main>`;
}

function viewScene() {
  const { quest, node } = cur;
  const npc = node.npc;
  const talking = npc ? quest.cast[npc.who] : null;
  const speaker = talking || speakerOf();
  const bg = bgOf(quest);
  const cg = node.cg && viewCg(node.cg);
  const portrait = portraitOf(speaker, cur.face);
  return `<main class="page scene ${quest.dark ? 'dark' : ''} ${bg ? 'has-img' : ''}"
      style="--scene-bg:${bg ? `url('${new URL(ASSET_DIR + bg, location.href)}') center / cover no-repeat, ` : ''}${quest.bg}">
    ${topbar(`${quest.emoji} ${esc(quest.title)}`, 'leave')}
    <div class="stage">
      ${cg || (portrait
        ? `<img class="portrait ${talking ? 'talking' : ''}" src="${ASSET_DIR + portrait}" alt="${esc(speaker.name)}">`
        : `<div class="avatar ${talking ? 'talking' : ''}">${speaker.emoji}</div>`)}
      <div class="who">${esc(speaker.name)}</div>
    </div>
    ${node.narr ? `<p class="narr">${esc(node.narr)}</p>` : ''}
    ${npc ? viewBubble(npc) : ''}
    <section class="panel">${viewPanel()}</section>
  </main>`;
}

function viewBubble(npc) {
  const quiz = cur.quiz;
  const pending = quiz && quiz.picked === null;
  const show = !pending && (cur.subShown || cur.subRevealed || quiz);
  const answer = quiz?.options.find(o => o.correct)?.text;
  return `<div class="bubble">
    ${show
      ? `<p class="ja">${esc(npc.ja)}</p>${differs(npc.kana, npc.ja) ? `<p class="kana">${esc(npc.kana)}</p>` : ''}<p class="zh">${esc(npc.zh)}</p>
         ${npc.keys ? `<p class="keys">${npc.keys.map(([ja, zh]) => `<span><b>${esc(ja)}</b>＝${esc(zh)}</span>`).join('')}</p>` : ''}`
      : `<p class="nosub">🔊 ・・・<small>${pending ? '先不看字幕，用耳朵聽聽看。可以多聽幾次！' : '這句你聽過了，這次沒有字幕。'}</small></p>`}
    ${quiz && !pending
      ? `<p class="feedback ${quiz.correct ? 'ok' : 'warn'}">${quiz.correct ? '👂 聽懂了！' : `沒關係，答案是「${esc(answer)}」。記住上面的關鍵字，下次就聽得出來。`}</p>`
      : ''}
    <div class="tools">
      <button class="chip" data-act="replay">🔊 再聽</button>
      <button class="chip" data-act="replaySlow">🐢 慢速</button>
      ${show ? '' : `<button class="chip" data-act="reveal">${pending ? '聽不出來，看字幕' : '字 顯示字幕'}</button>`}
    </div>
  </div>`;
}

function viewQuiz(quiz) {
  return `<p class="prompt">👂 ${esc(quiz.q)}</p>
    <div class="choices">${quiz.options.map((o, i) => `<button class="choice" data-act="quizPick" data-i="${i}">${esc(o.text)}</button>`).join('')}</div>`;
}

function viewPanel() {
  const t = cur.turn;
  if (cur.quiz && cur.quiz.picked === null) return viewQuiz(cur.quiz);
  if (!t) return '<button class="btn primary wide" data-act="next">繼續 ▶</button>';
  if (t.result) return viewSuccess(t);
  if (t.chosen === null && t.free) {
    return `<p class="prompt">✨ 這些句子你都練過了，直接用日文回答吧！</p>
      <p class="meanings">可以表達的意思：${t.choices.map(c => `<span>${esc(c.zh)}</span>`).join('')}
        ${t.locked.map(c => `<span class="locked">🔒 ${esc(c.zh)}（需要 ${needText(c.need)}）</span>`).join('')}</p>
      ${viewInput()}${viewFeedback(t)}
      <button class="link" data-act="showChoices">還是給我提示好了</button>`;
  }
  if (t.chosen === null) {
    return `<p class="prompt">你想怎麼回答？</p>
      <div class="choices">${t.choices.map((c, i) => `<button class="choice" data-act="choose" data-i="${i}">${esc(c.zh)}</button>`).join('')}
        ${t.locked.map(c => `<button class="choice locked" disabled>🔒 ${esc(c.zh)}<small>需要 ${needText(c.need)}</small></button>`).join('')}</div>
      ${viewFeedback(t)}`;
  }
  return viewTeach(t);
}

function viewTeach(t) {
  const c = t.choices[t.chosen];
  const p = PHRASES[c.phrase];
  const m = mastery(c.phrase);
  const h = t.hint;
  // 熟練度越高，顯示越少；每按一次提示（或答錯一次）多顯示一點
  const full = m === 0 || (m === 1 && h >= 2) || h >= 3;
  const showKana = full || m === 1;
  const showRomaji = full || (m === 1 && h >= 1);
  const context = !full && m >= 2 && h >= 1;
  const partial = !full && m >= 2 && h >= 2;
  return `<div class="teach">
      <div class="teach-head">
        <span class="level">${LEVEL_LABEL[Math.min(m, 3)]}</span>
        ${t.choices.length + t.locked.length > 1 ? '<button class="link" data-act="unchoose">換個意思</button>' : ''}
      </div>
      <p class="meaning">想說：「${esc(c.zh)}」</p>
      ${full ? `<p class="t-ja">${esc(p.ja)}</p>` : ''}
      ${showKana && (!full || differs(p.kana, p.ja)) ? `<p class="t-kana">${esc(p.kana)}</p>` : ''}
      ${showRomaji ? `<p class="t-romaji">${esc(p.romaji)}</p>` : ''}
      ${context ? `<p class="t-hint">💡 ${esc(c.hint || '想想看，之前在哪裡用過這句？')}</p>` : ''}
      ${partial ? `<p class="t-kana partial">${esc(p.kana.slice(0, Math.max(2, Math.ceil(p.kana.length / 3))))}……</p>` : ''}
      ${full && p.note ? `<p class="t-note">${esc(p.note)}</p>` : ''}
      <div class="tools">
        ${showKana ? '<button class="chip" data-act="say">🔊 聽發音</button><button class="chip" data-act="saySlow">🐢 慢速</button>' : ''}
        ${full ? '' : '<button class="chip" data-act="hint">💡 提示</button>'}
      </div>
    </div>
    ${viewInput()}${viewFeedback(t)}
    ${t.attempts >= 3 ? '<button class="link" data-act="skip">說不出來？先跳過，之後會再練</button>' : ''}`;
}

function viewInput() {
  const listening = !!cur.turn.listening;
  return `<div class="input-row">
      ${quiet() ? '' : `<button class="mic ${listening ? 'on' : ''}" data-act="mic">${listening ? '● 聆聽中…說完會自動結束' : '🎤 按一下，開口說'}</button>`}
      <form class="type-row ${quiet() ? '' : 'compact'}">
        <input id="answer" autocomplete="off" autocapitalize="off" placeholder="${quiet() ? '輸入日文或羅馬拼音（例：kore kudasai）' : '或用打字回答（日文或羅馬拼音）'}">
        <button class="btn small">送出</button>
      </form>
    </div>
    <p id="interim" class="interim"></p>`;
}

function viewFeedback(t) {
  return t.feedback ? `<p class="feedback ${t.fbType || ''}">${t.feedback}</p>` : '';
}

function viewSuccess(t) {
  const c = t.choices[t.result.idx];
  const p = PHRASES[c.phrase];
  const g = cur.gains[c.phrase];
  return `<div class="success">
      <p class="ok">✅ 通じた！對方聽懂了</p>
      <p class="heard">你說：「${esc(t.heard)}」</p>
      ${t.switched ? `<p class="tip">你表達的是「${esc(c.zh)}」，劇情就照你說的走 👍</p>` : ''}
      <p class="stars-line">${esc(p.ja)} <span class="stars">${stars(g.after)}</span></p>
      ${t.statGain ? `<p class="gain">${STATS[t.statGain.skill].emoji} ${STATS[t.statGain.skill].name} +${t.statGain.amount}</p>` : ''}
      ${effectText(c) ? `<p class="gain bonus">${c.need ? '🔓 練好日文的獎勵：' : ''}${effectText(c)}</p>` : ''}
      <button class="btn primary wide" data-act="advance">繼續 ▶</button>
    </div>`;
}

function viewResult() {
  const rows = Object.entries(cur.gains).map(([id, g]) => {
    const p = PHRASES[id];
    const delta = g.after - g.before;
    return `<li><div><b>${esc(p.ja)}</b><small>${esc(p.zh)}</small></div>
      <span class="stars">${stars(g.after)}</span><em class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '↑' : delta < 0 ? '再練練' : '—'}</em></li>`;
  }).join('');
  const listenRows = Object.entries(cur.listenGains).map(([id, g]) => {
    const h = save.heard[id];
    const delta = g.after - g.before;
    return `<li><div><b>${esc(h.ja)}</b><small>${esc(h.zh)}</small></div>
      <span class="stars">${stars(g.after)}</span><em class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${delta > 0 ? '↑' : delta < 0 ? '再聽聽' : '—'}</em></li>`;
  }).join('');
  const statRows = Object.entries(cur.statGains).filter(([, v]) => v > 0)
    .map(([k, v]) => `<span>${STATS[k].emoji} ${STATS[k].name} <b>+${v}</b>（${save.stats[k]}）</span>`).join('');
  const r = cur.resources;
  return `<main class="page result">
    ${topbar(`${cur.quest.emoji} 完成`)}
    <section class="morning"><div class="sun">${cur.quest.emoji}</div><h2>${esc(cur.quest.title)}</h2><p>${esc(cur.endNarr)}</p></section>
    <section class="summary">
      <div class="res"><span>💴 ${r.money ? `−${yen(r.money)}` : '沒花錢'}${r.refund > 0 ? `（省下 ${yen(r.refund)}）` : ''}</span><span>⚡ ${r.stamina > 0 ? `−${r.stamina}` : `+${-r.stamina}`}</span></div>
      <div class="gains">${statRows || '<span>這次數值沒有成長，下次試著不看提示說出來吧</span>'}</div>
    </section>
    <h3 class="section-title">🗣️ 這次說出口的句子</h3>
    <ul class="book">${rows}</ul>
    ${listenRows ? `<h3 class="section-title">👂 這次聽力測驗的句子</h3><ul class="book">${listenRows}</ul>` : ''}
    <p class="fine">★ 越多，下次出現時字幕和提示就越少。</p>
    <div class="actions"><button class="btn primary" data-act="nextSlot">繼續 ▶</button></div>
  </main>`;
}

function viewFinal() {
  const end = ENDINGS.find(e => e.id === save.ending) || ENDINGS[ENDINGS.length - 1];
  const ids = Object.keys(save.mastery);
  const strong = ids.filter(id => mastery(id) >= 2).length;
  const bars = Object.entries(STATS).map(([k, st]) =>
    `<li><span>${st.emoji} ${st.name}</span><div class="bar"><i style="width:${save.stats[k]}%"></i></div><b>${save.stats[k]}</b></li>`).join('');
  const unseen = QUESTS.filter(q => !save.done.includes(q.id));
  return `<main class="page final">
    ${topbar('旅程結束')}
    <section class="morning ending"><div class="sun">${end.emoji}</div><p class="fine">結局</p><h2>${esc(end.title)}</h2><p>${esc(end.text)}</p></section>
    <h3 class="section-title">這趟旅程的能力</h3>
    <ul class="skills">${bars}</ul>
    <p class="fine">剩下的旅費 ${yen(save.money)}・學了 ${ids.length} 個句子，其中 ${strong} 個不看字幕也說得出來</p>
    <h3 class="section-title">收集到的結局 ${save.endings.length} / ${ENDINGS.length}</h3>
    <ul class="endings">${ENDINGS.map(e => save.endings.includes(e.id)
      ? `<li><span>${e.emoji}</span>${esc(e.title)}</li>` : '<li class="unseen"><span>❔</span>？？？</li>').join('')}</ul>
    ${unseen.length ? `<p class="fine">這次沒去的地方：${unseen.map(q => `${q.emoji} ${esc(q.title)}`).join('、')}</p>` : ''}
    <div class="actions">
      <button class="btn primary" data-act="newRun">再玩一輪（保留學過的句子）</button>
      <button class="btn ghost" data-act="reset">從頭開始（清除全部）</button>
    </div>
  </main>`;
}

function viewEvent() {
  const e = events[0];
  return `<main class="page event">
    ${topbar(`Day ${save.day}・${e.at === 'morning' ? '早上' : '晚上'}`)}
    <section class="morning"><div class="sun">${e.emoji}</div><h2>${esc(e.title)}</h2><p>${esc(e.story)}</p></section>
    <div class="bubble">
      <p class="ja">${esc(e.ja)}</p><p class="zh">${esc(e.zh)}</p>
      ${e.keys ? `<p class="keys">${e.keys.map(([ja, zh]) => `<span><b>${esc(ja)}</b>＝${esc(zh)}</span>`).join('')}</p>` : ''}
      <div class="tools"><button class="chip" data-act="sayEvent">🔊 再聽</button></div>
    </div>
    <section class="panel check">
      <p class="need">${Object.entries(e.need).map(([k, v]) =>
        `<span class="${e.stats[k] >= v ? 'pass' : 'miss'}">${STATS[k].emoji} ${STATS[k].name} ${e.stats[k]} / ${v}</span>`).join('')}</p>
      <p class="feedback ${e.ok ? 'ok' : 'warn'}">${e.ok ? '✅ ' : ''}${esc(e.outcome.text)}</p>
      ${e.effects ? `<p class="fine">${e.effects}</p>` : ''}
      <button class="btn primary wide" data-act="nextEvent">繼續 ▶</button>
    </section>
  </main>`;
}

function viewBook() {
  const ids = Object.keys(save.mastery);
  const rows = ids.map(id => {
    const p = PHRASES[id];
    return `<li><button class="chip" data-act="sayId" data-id="${id}">🔊</button>
      <div><b>${esc(p.ja)}</b><small>${esc(p.romaji)}・${esc(p.zh)}</small></div>
      <span class="stars">${stars(mastery(id))}</span></li>`;
  }).join('');
  const heard = Object.entries(save.heard).map(([id, h]) => `<li><button class="chip" data-act="sayHeard" data-id="${id}">🔊</button>
      <div><b>${esc(h.ja)}</b><small>${esc(h.zh)}</small></div>
      <span class="stars">${stars(listenLevel(id))}</span></li>`).join('');
  return `<div class="overlay" data-act="closeBook">
    <div class="sheet" data-act="noop">
      <header><h3>📖 句子本</h3><button class="icon" data-act="closeBook">✕</button></header>
      ${ids.length ? `<h4>🗣️ 我會說的</h4><ul class="book">${rows}</ul>` : '<p class="empty">還沒學到句子，先去完成一個行程吧！</p>'}
      ${heard ? `<h4>👂 我聽過的（店員、路人說的話）</h4><ul class="book">${heard}</ul>` : ''}
      <p class="fine">🗣️ ★ 越多，字幕和提示就越少；★★ 以上的句子會進入「直接開口」模式。<br>👂 ★★ 以上，對方會用接近真實的速度說話。</p>
    </div>
  </div>`;
}

const VIEWS = { title: viewTitle, plan: viewPlan, scene: viewScene, result: viewResult, final: viewFinal, event: viewEvent };

function render() {
  app.innerHTML = VIEWS[screen]() + (bookOpen ? viewBook() : '');
  const t = cur?.turn;
  if (screen === 'scene' && quiet() && t && !t.result && (t.chosen !== null || t.free)) {
    document.getElementById('answer')?.focus();
  }
}

// ---------- 劇情流程 ----------

function startQuest(id) {
  cur = { quest: QUESTS.find(q => q.id === id), gains: {}, listenGains: {}, statGains: {}, refund: 0, staminaBonus: 0, lastSpeaker: null };
  screen = 'scene';
  goto(cur.quest.start);
}

function goto(id) {
  stopSpeaking();
  cur.turn?.listening?.stop();
  const node = cur.quest.nodes[id];
  // 數值不夠的節點（例如聽力不夠就聽不懂的話）改走 else
  if (node.need && !meets(node.need)) return goto(node.else);
  // 分歧節點：依存檔狀態（例如好感度）決定往哪走
  if (node.branch) return goto(node.branch.find(b => !b.when || b.when(save)).next);
  cur.node = node;
  cur.turn = null;
  cur.subRevealed = false;
  cur.face = node.npc?.face || 'normal';
  cur.quiz = null;
  if (node.end) return finishQuest(node);
  if (node.npc) {
    const npc = node.npc;
    const { concept, who } = npc;
    cur.subShown = save.settings.alwaysSub || (save.exposure[concept] || 0) < 1;
    // 聽過的台詞（或價錢、路線這類一定要聽懂的）先考聽力，答完才顯示字幕
    if (!save.settings.alwaysSub) {
      if (npc.quiz) cur.quiz = makeQuiz(npc.quiz.q, npc.quiz.options, npc.quiz.answer);
      else if (!cur.subShown) cur.quiz = makeQuiz('對方剛剛說的是？', [npc.zh, ...distractors(npc)], 0);
    }
    save.exposure[concept] = (save.exposure[concept] || 0) + 1;
    save.heard[concept] = { ja: npc.ja, zh: npc.zh };
    save.listen[concept] ??= 0;
    cur.lastSpeaker = cur.quest.cast[who];
    persist();
  }
  if (node.choices) startTurn(node.choices);
  render();
  if (node.npc) sayNpc();
}

function startTurn(all) {
  // 數值不夠的選項鎖住，只顯示不能選
  const choices = all.filter(c => meets(c.need));
  const locked = all.filter(c => !meets(c.need));
  const free = choices.every(c => mastery(c.phrase) >= 2);
  cur.turn = {
    choices, free, locked,
    // 只有一個選項時直接進入教學；有鎖住的選項時仍然列出來，讓玩家看到「數值夠就能這樣說」
    chosen: !free && choices.length === 1 && !locked.length ? 0 : null,
    hint: 0, attempts: 0, feedback: '', result: null, listening: null,
  };
}

function makeQuiz(q, options, answer) {
  return { q, options: shuffle(options.map((text, i) => ({ text, correct: i === answer }))), picked: null, correct: false };
}

function distractors(npc) {
  if (npc.alt?.length >= 2) return npc.alt.slice(0, 2);
  const pool = new Set(QUESTS.flatMap(q => Object.values(q.nodes))
    .filter(n => n.npc && n.npc.concept !== npc.concept).map(n => n.npc.zh));
  return shuffle([...pool]).slice(0, 2);
}

function pickQuiz(i) {
  const quiz = cur.quiz;
  const concept = cur.node.npc.concept;
  quiz.picked = i;
  quiz.correct = i >= 0 && quiz.options[i].correct;
  const before = listenLevel(concept);
  const after = quiz.correct ? Math.min(MAX_MASTERY, before + 1) : Math.max(0, before - 1);
  save.listen[concept] = after;
  cur.listenGains[concept] = { before: cur.listenGains[concept]?.before ?? before, after };
  if (quiz.correct) addStat('listen', `l:${concept}`, 5);
  persist();
  render();
}

// 聽力越熟練，NPC 講話越接近真實速度
function sayNpc(slow = false) {
  const npc = cur.node.npc;
  if (!npc) return;
  const rate = slow || npc.slow ? 0.65 : listenLevel(npc.concept) >= 2 ? 1.1 : 0.92;
  speak(npc.ja, { rate, pitch: cur.quest.cast[npc.who].pitch });
}

function finishQuest(node) {
  const q = cur.quest;
  const cost = node.cost ?? q.cost;
  const money = Math.max(0, cost - cur.refund);
  save.money -= money;
  const stamina = q.stamina - cur.staminaBonus;
  save.stamina = Math.min(TRIP.stamina, Math.max(0, save.stamina - stamina));
  save.today.push(q.id);
  if (!save.done.includes(q.id)) save.done.push(q.id);
  save.flags[`quest:${q.id}`] = save.day;
  cur.resources = { money, refund: cost ? cur.refund : 0, stamina };
  persist();
  cur.endNarr = node.narr;
  screen = 'result';
  render();
}

// 同一句在這趟旅程說得越多次，成長越少（鼓勵去新的地方）
function addStat(skill, key, base) {
  const uses = save.usage[key] || 0;
  save.usage[key] = uses + 1;
  const amount = Math.max(1, Math.round(base / (1 + uses)));
  save.stats[skill] = Math.min(100, save.stats[skill] + amount);
  cur.statGains[skill] = (cur.statGains[skill] || 0) + amount;
  return amount;
}

function skillOf(choice) {
  const npc = cur.node.npc;
  return choice.skill || (npc && cur.quest.cast[npc.who].skill) || cur.quest.skill;
}

function recordResult(choice, { hint, attempts, skipped }) {
  const phraseId = choice.phrase;
  const before = mastery(phraseId);
  let after = before;
  if (skipped || hint >= 3) after = Math.max(0, before - 1);
  else if (hint === 0 && attempts === 0) after = Math.min(MAX_MASTERY, before + 1);
  save.mastery[phraseId] = after;
  cur.gains[phraseId] = { before: cur.gains[phraseId]?.before ?? before, after };
  // 數值：不看提示一次說對 4，有用提示或說錯過 3，跳過 0
  let gain = null;
  if (!skipped) {
    const skill = skillOf(choice);
    gain = { skill, amount: addStat(skill, `p:${phraseId}`, hint === 0 && attempts === 0 ? 4 : 3) };
  }
  persist();
  return gain;
}

// 選了之後才發生的效果：旗標（記下是第幾天）、金額、體力、好感度
function applyChoice(c) {
  if (c.flag) save.flags[c.flag] = save.day;
  if (c.money) cur.refund += c.money;
  if (c.stamina) cur.staminaBonus += c.stamina;
  if (c.affection) save.affection = Math.max(0, Math.min(10, save.affection + c.affection));
  persist();
}

// ---------- 行程、事件、結局 ----------

function nextSlot() {
  cur = null;
  save.slot++;
  if (save.slot >= slotsOf(save.day)) return endDay();
  persist();
  screen = 'plan';
  render();
}

function endDay() {
  events = runEvents('night');
  save.day++;
  save.slot = 0;
  save.stamina = TRIP.stamina;
  save.today = [];
  if (save.day > TRIP.days) {
    save.day = TRIP.days;
    save.slot = TRIP.lastDaySlots - 1;
    save.finished = true;
    save.ending = ENDINGS.find(e => e.when(save)).id;
    if (!save.endings.includes(save.ending)) save.endings.push(save.ending);
  } else {
    events.push(...runEvents('morning'));
    toast = '🌙 你在旅館睡了一晚，體力恢復了。新的一天開始！';
  }
  persist();
  showNext();
}

// 符合條件的事件馬上結算，結果排隊顯示
function runEvents(at) {
  return EVENTS.filter(e => e.at === at && (!e.day || e.day === save.day)
      && (!e.after || save.today.includes(e.after))
      && (!e.requires || save.flags[e.requires] || save.done.includes(e.requires)))
    .map(e => {
      const stats = { ...save.stats };
      const ok = meets(e.need) || !!(e.pass && save.flags[e.pass]);
      const outcome = ok ? e.success : e.fail;
      const fx = [];
      if (outcome.money) { save.money += outcome.money; fx.push(`💴 ${outcome.money > 0 ? '+' : '−'}${yen(Math.abs(outcome.money))}`); }
      if (outcome.stamina) { save.stamina = Math.max(0, save.stamina + outcome.stamina); fx.push(`⚡ ${outcome.stamina > 0 ? '+' : '−'}${Math.abs(outcome.stamina)}`); }
      for (const [k, v] of Object.entries(outcome.stats || {})) {
        save.stats[k] = Math.min(100, save.stats[k] + v);
        fx.push(`${STATS[k].emoji} ${STATS[k].name} +${v}`);
      }
      if (outcome.flag) save.flags[outcome.flag] = save.day;
      if (outcome.affection) { save.affection = Math.min(10, save.affection + outcome.affection); fx.push(`💗 結衣的好感度 +${outcome.affection}`); }
      return { ...e, ok, outcome, stats, effects: fx.join('　') };
    });
}

function showNext() {
  if (events.length) {
    screen = 'event';
    render();
    speak(events[0].ja, { rate: 0.9 });
    return;
  }
  screen = save.finished ? 'final' : 'plan';
  render();
}

function handleAnswer(alternatives) {
  const t = cur?.turn;
  if (!t || t.result) return;
  const r = judge(alternatives, t.choices, PHRASES, t.chosen ?? -1, PHRASES[META_REPEAT]);
  t.heard = r.heard;
  if (r.meta === 'repeat') {
    t.feedback = `你說「${esc(r.heard)}」——對方放慢速度再說一次 👍（遇到聽不懂，這句在日本很好用）`;
    t.fbType = 'info';
    render();
    sayNpc(true);
    return;
  }
  if (r.idx < 0) {
    t.attempts++;
    t.hint = Math.min(3, t.hint + 1);
    if (r.heard) { save.stamina = Math.max(0, save.stamina - 2); persist(); }
    const [ja, zh] = pick(CONFUSED);
    const who = speakerOf();
    t.feedback = r.heard
      ? `你說「${esc(r.heard)}」<br>${esc(who.name)}：「${ja}」（${zh}）<br>提示多給你一點，再試一次。（⚡ −2）`
      : '沒聽清楚，再試一次？';
    t.fbType = 'warn';
    if (r.heard) cur.face = 'confused';
    if (t.chosen === null) { t.free = false; t.feedback += ' 先選一個想表達的意思吧。'; }
    render();
    if (r.heard) speak(ja, { pitch: who.pitch });
    return;
  }
  if (!r.complete) {
    // 只說了關鍵字（例如只說「抹茶」）：對方大概懂，但要說完整的句子才算學會
    const p = PHRASES[t.choices[r.idx].phrase];
    const who = speakerOf();
    t.attempts++;
    t.chosen = r.idx;
    t.free = false;
    t.feedback = `你說「${esc(r.heard)}」<br>${esc(who.name)}好像猜到你的意思了，但這樣只有單字。<br>試著說完整的句子：<b>${esc(p.ja)}</b>`;
    t.fbType = 'info';
    render();
    return;
  }
  t.switched = t.chosen !== null && r.idx !== t.chosen;
  t.statGain = recordResult(t.choices[r.idx], t);
  t.result = r;
  cur.face = 'smile';
  render();
}

async function toggleMic() {
  const t = cur.turn;
  if (t.listening) { t.listening.stop(); return; }
  stopSpeaking();
  let ctl;
  try {
    ctl = listen({ onInterim: text => { const el = document.getElementById('interim'); if (el) el.textContent = `聽到：${text}`; } });
  } catch (err) {
    t.feedback = `無法啟動語音辨識（${esc(err.message || err)}），可以先用打字回答。`;
    t.fbType = 'warn';
    render();
    return;
  }
  t.listening = ctl;
  t.feedback = '';
  render();
  try {
    const alternatives = await ctl.promise;
    t.listening = null;
    if (cur?.turn !== t) return;
    if (!alternatives.length) {
      t.feedback = '沒有聽到聲音，再試一次？';
      t.fbType = 'warn';
      render();
      return;
    }
    handleAnswer(alternatives);
  } catch (err) {
    t.listening = null;
    if (cur?.turn !== t) return;
    if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(err)) {
      save.settings.quiet = true;
      persist();
      t.feedback = '無法使用麥克風（權限被拒或找不到裝置），已切換成打字模式。可以在瀏覽器網址列旁邊重新允許麥克風。';
    } else if (err === 'no-speech') {
      t.feedback = '沒有聽到聲音，再試一次？';
    } else if (err === 'network') {
      t.feedback = '語音辨識需要網路（Chrome 會把聲音送到 Google 辨識）。也可以先用打字回答。';
    } else {
      t.feedback = `語音辨識發生錯誤（${esc(err)}），可以先用打字回答。`;
    }
    t.fbType = 'warn';
    render();
  }
}

// ---------- 操作 ----------

const actions = {
  noop() {},
  start() { save = freshSave({ started: true }); persist(); screen = 'plan'; render(); },
  continue() { screen = save.finished ? 'final' : 'plan'; render(); },
  reset() {
    if (save.started && !confirm('確定要清除所有進度（包含學過的句子和結局），從頭開始嗎？')) return;
    save = freshSave({ started: true }); persist(); screen = 'plan'; render();
  },
  newRun() {
    const { mastery, listen, heard, exposure, endings, settings } = save;
    save = freshSave({ mastery, listen, heard, exposure, endings, settings, started: true });
    persist();
    screen = 'plan';
    render();
  },
  home() { stopSpeaking(); screen = 'title'; render(); },
  leave() { stopSpeaking(); cur.turn?.listening?.stop(); cur = null; screen = 'plan'; render(); },
  nextSlot() { nextSlot(); },
  rest() {
    if (save.slot === slotsOf(save.day) - 1) return endDay();
    save.stamina = Math.min(TRIP.stamina, save.stamina + TRIP.rest);
    toast = `🏨 回旅館休息了一下（⚡ +${TRIP.rest}）`;
    nextSlot();
  },
  nextEvent() { stopSpeaking(); events.shift(); showNext(); },
  sayEvent() { speak(events[0].ja, { rate: 0.9 }); },
  quest({ id }) { startQuest(id); },
  toggleQuiet() { save.settings.quiet = !save.settings.quiet; persist(); render(); },
  toggleSub() {
    save.settings.alwaysSub = !save.settings.alwaysSub;
    if (cur) {
      cur.subRevealed = save.settings.alwaysSub;
      if (save.settings.alwaysSub && cur.quiz?.picked === null) cur.quiz = null;
    }
    persist();
    render();
  },
  book() { bookOpen = true; render(); },
  closeBook() { bookOpen = false; render(); },
  sayId({ id }) { speak(PHRASES[id].ja, { rate: 0.85 }); },
  next() { goto(cur.node.next); },
  replay() { sayNpc(); },
  replaySlow() { sayNpc(true); },
  reveal() {
    if (cur.quiz?.picked === null) return pickQuiz(-1);
    cur.subRevealed = true;
    render();
  },
  quizPick({ i }) { pickQuiz(Number(i)); },
  sayHeard({ id }) { speak(save.heard[id].ja, { rate: 0.9 }); },
  choose({ i }) {
    const t = cur.turn;
    t.chosen = Number(i);
    t.hint = 0;
    t.attempts = 0;
    t.feedback = '';
    render();
  },
  unchoose() { cur.turn.chosen = null; cur.turn.feedback = ''; render(); },
  showChoices() { const t = cur.turn; t.free = false; t.chosen = t.choices.length === 1 && !t.locked.length ? 0 : null; render(); },
  say() { const t = cur.turn; speak(PHRASES[t.choices[t.chosen].phrase].ja, { rate: 0.9 }); },
  saySlow() { const t = cur.turn; speak(PHRASES[t.choices[t.chosen].phrase].ja, { rate: 0.6 }); },
  hint() { cur.turn.hint = Math.min(3, cur.turn.hint + 1); render(); },
  mic() { toggleMic(); },
  skip() {
    const t = cur.turn;
    const c = t.choices[t.chosen ?? 0];
    recordResult(c, { hint: 3, attempts: t.attempts, skipped: true });
    // 跳過只保留劇情旗標，拿不到獎勵
    if (c.flag) { save.flags[c.flag] = save.day; persist(); }
    goto(c.next);
  },
  advance() {
    const c = cur.turn.choices[cur.turn.result.idx];
    applyChoice(c);
    goto(c.next);
  },
};

app.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  actions[el.dataset.act]?.(el.dataset);
});

app.addEventListener('submit', e => {
  e.preventDefault();
  const value = e.target.querySelector('input')?.value.trim();
  if (value) handleAnswer([value]);
});

if (ttsSupported) speechSynthesis.addEventListener?.('voiceschanged', () => { if (screen === 'title') render(); });

render();
probeAssets();
