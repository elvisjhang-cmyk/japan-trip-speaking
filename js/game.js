// 遊戲引擎：每日行程 → 支線劇情 → 玩家回合（選意思 → 學說法 → 開口）→ 熟練度。
// 跟語言無關的部分都在這裡，語言內容在 data.js。

import { PHRASES, QUESTS, SKILLS, META_REPEAT } from './data.js';
import { judge } from './judge.js';
import { speak, stopSpeaking, listen, asrSupported, ttsSupported, hasJaVoice } from './speech.js';

const SAVE_KEY = 'nihongo-trip-v1';
const MAX_DAY = 2;
const MAX_MASTERY = 4;
const LEVEL_LABEL = ['🌱 新句子：先聽，再跟著說', '🔁 跟讀練習', '🧠 回想看看', '✨ 自然說出來'];
const CONFUSED = [['え？', '欸？'], ['すみません、もう一度……？', '不好意思，可以再說一次嗎……？'], ['えっと……？', '呃……？']];

const app = document.getElementById('app');

function freshSave() {
  return {
    day: 1, finished: false, mastery: {}, listen: {}, heard: {}, exposure: {}, done: [], flags: {},
    settings: { quiet: !asrSupported, alwaysSub: false },
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

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mastery = id => save.mastery[id] ?? 0;
const listenLevel = concept => save.listen[concept] ?? 0;
const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
const stars = n => '★'.repeat(n) + '☆'.repeat(MAX_MASTERY - n);
const unlocked = q => !q.requires || save.flags[q.requires];
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
  const hasSave = save.done.length > 0;
  return `<main class="page title">
    <div class="hero">
      <div class="hero-emoji">🗾</div>
      <h1>日本自由行<span>口說冒險</span></h1>
      <p class="lead">你是第一次來日本的旅客。<br>開口說日文，完成每一天的行程。</p>
    </div>
    <ul class="checks">
      <li>${asrSupported ? '✅ 語音辨識可用' : '⚠️ 這個瀏覽器不支援語音辨識，會改用打字模式（建議用 Chrome）'}</li>
      <li>${!ttsSupported ? '⚠️ 不支援語音朗讀' : hasJaVoice() ? '✅ 日文語音可用' : '⚠️ 找不到日文語音，NPC 的發音可能不正確'}</li>
    </ul>
    <div class="actions">
      ${hasSave
        ? `<button class="btn primary" data-act="continue">繼續旅程（${save.finished ? '已完成' : `Day ${save.day}`}）</button>
           <button class="btn ghost" data-act="reset">從頭開始</button>`
        : '<button class="btn primary" data-act="start">開始旅程</button>'}
    </div>
    <p class="fine">建議戴耳機、在安靜的地方玩。原型版本：2 天、6 個支線、約 30 個句子。</p>
  </main>`;
}

function viewPlan() {
  const quests = QUESTS.filter(q => q.day === save.day);
  const earlier = QUESTS.filter(q => q.day < save.day);
  const doneToday = quests.some(q => save.done.includes(q.id));
  const intro = save.day === 1
    ? '飯店房間裡，你拉開窗簾。第一次來日本，有點緊張，也有點期待。'
    : '第二天。今天會遇到昨天學過的句子——<b>學過的這次不顯示字幕</b>。忘記的話，對方會提醒你。';
  const card = q => {
    const open = unlocked(q);
    const done = save.done.includes(q.id);
    return `<button class="quest ${done ? 'done' : ''} ${open ? '' : 'locked'}" ${open ? `data-act="quest" data-id="${q.id}"` : 'disabled'}>
      <span class="q-emoji">${open ? q.emoji : '🔒'}</span>
      <span class="q-body"><strong>${open ? esc(q.title) : '？？？'}</strong><small>${esc(open ? q.desc : q.lockedDesc)}</small></span>
      <span class="q-state">${done ? '✓ 完成<br><em>再玩一次</em>' : ''}</span>
    </button>`;
  };
  const t = toast;
  toast = '';
  return `<main class="page plan">
    ${topbar(`Day ${save.day}・行程`)}
    ${t ? `<div class="toast">${t}</div>` : ''}
    <section class="morning">
      <div class="sun">${save.day === 1 ? '🌅' : '☀️'}</div>
      <h2>Day ${save.day}・早上</h2>
      <p>${intro}</p>
    </section>
    <h3 class="section-title">今天想做什麼？</h3>
    <div class="quests">${quests.map(card).join('')}</div>
    ${earlier.length ? `<h3 class="section-title">再去一次之前的地方</h3><div class="quests">${earlier.map(card).join('')}</div>` : ''}
    <div class="actions">
      <button class="btn primary" data-act="endDay" ${doneToday ? '' : 'disabled'}>${save.day < MAX_DAY ? '結束今天，回飯店睡覺 💤' : '結束旅程 ✈️'}</button>
      ${doneToday ? '' : '<p class="fine">至少完成一個行程，才能結束今天。</p>'}
    </div>
  </main>`;
}

function viewScene() {
  const { quest, node } = cur;
  const npc = node.npc;
  const talking = npc ? quest.cast[npc.who] : null;
  const speaker = talking || speakerOf();
  return `<main class="page scene ${quest.dark ? 'dark' : ''}" style="--scene-bg:${quest.bg}">
    ${topbar(`${quest.emoji} ${esc(quest.title)}`, 'leave')}
    <div class="stage">
      <div class="avatar ${talking ? 'talking' : ''}">${speaker.emoji}</div>
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
      <p class="meanings">可以表達的意思：${t.choices.map(c => `<span>${esc(c.zh)}</span>`).join('')}</p>
      ${viewInput()}${viewFeedback(t)}
      <button class="link" data-act="showChoices">還是給我提示好了</button>`;
  }
  if (t.chosen === null) {
    return `<p class="prompt">你想怎麼回答？</p>
      <div class="choices">${t.choices.map((c, i) => `<button class="choice" data-act="choose" data-i="${i}">${esc(c.zh)}</button>`).join('')}</div>
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
        ${t.choices.length > 1 ? '<button class="link" data-act="unchoose">換個意思</button>' : ''}
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
      ${t.result.natural ? '' : `<p class="tip">意思對了！更自然的說法：<b>${esc(p.ja)}</b></p>`}
      <p class="stars-line">${esc(p.ja)} <span class="stars">${stars(g.after)}</span></p>
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
  return `<main class="page result">
    ${topbar(`${cur.quest.emoji} 完成`)}
    <section class="morning"><div class="sun">${cur.quest.emoji}</div><h2>${esc(cur.quest.title)}</h2><p>${esc(cur.endNarr)}</p></section>
    <h3 class="section-title">🗣️ 這次說出口的句子</h3>
    <ul class="book">${rows}</ul>
    ${listenRows ? `<h3 class="section-title">👂 這次聽力測驗的句子</h3><ul class="book">${listenRows}</ul>` : ''}
    <p class="fine">★ 越多，下次出現時字幕和提示就越少。</p>
    <div class="actions"><button class="btn primary" data-act="toPlan">回到今天的行程</button></div>
  </main>`;
}

function viewFinal() {
  const ids = Object.keys(save.mastery);
  const strong = ids.filter(id => mastery(id) >= 2).length;
  const heardStrong = Object.keys(save.heard).filter(id => listenLevel(id) >= 1).length;
  const skills = SKILLS.map(s => {
    const ids = s.listen || s.phrases;
    const level = s.listen ? listenLevel : mastery;
    const pct = Math.round(ids.reduce((a, id) => a + Math.min(level(id), 3), 0) / (ids.length * 3) * 100);
    return `<li><span>${s.name}</span><div class="bar"><i style="width:${pct}%"></i></div><b>${pct}%</b></li>`;
  }).join('');
  return `<main class="page final">
    ${topbar('旅程結束')}
    <section class="morning"><div class="sun">✈️</div><h2>回台灣的飛機上</h2>
      <p>這趟旅程你學了 <b>${ids.length}</b> 個句子，其中 <b>${strong}</b> 個已經不看字幕也說得出來；
      聽過 <b>${Object.keys(save.heard).length}</b> 句店員和路人的話，有 <b>${heardStrong}</b> 句不看字幕也聽得懂。</p></section>
    <h3 class="section-title">你的旅遊日文能力</h3>
    <ul class="skills">${skills}</ul>
    <p class="fine">原型到這裡結束。正式版可以加入更多城市、角色，以及英文等其他語言。</p>
    <div class="actions">
      <button class="btn primary" data-act="replayDay2">回到 Day 2 繼續練習</button>
      <button class="btn ghost" data-act="reset">從頭再玩一次</button>
    </div>
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

const VIEWS = { title: viewTitle, plan: viewPlan, scene: viewScene, result: viewResult, final: viewFinal };

function render() {
  app.innerHTML = VIEWS[screen]() + (bookOpen ? viewBook() : '');
  const t = cur?.turn;
  if (screen === 'scene' && quiet() && t && !t.result && (t.chosen !== null || t.free)) {
    document.getElementById('answer')?.focus();
  }
}

// ---------- 劇情流程 ----------

function startQuest(id) {
  cur = { quest: QUESTS.find(q => q.id === id), gains: {}, listenGains: {}, lastSpeaker: null };
  screen = 'scene';
  goto(cur.quest.start);
}

function goto(id) {
  stopSpeaking();
  cur.turn?.listening?.stop();
  const node = cur.quest.nodes[id];
  cur.node = node;
  cur.turn = null;
  cur.subRevealed = false;
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

function startTurn(choices) {
  const free = choices.every(c => mastery(c.phrase) >= 2);
  cur.turn = {
    choices, free,
    chosen: !free && choices.length === 1 ? 0 : null,
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
  if (!save.done.includes(cur.quest.id)) save.done.push(cur.quest.id);
  persist();
  cur.endNarr = node.narr;
  screen = 'result';
  render();
}

function recordResult(phraseId, { hint, attempts, skipped }) {
  const before = mastery(phraseId);
  let after = before;
  if (skipped || hint >= 3) after = Math.max(0, before - 1);
  else if (hint === 0 && attempts === 0) after = Math.min(MAX_MASTERY, before + 1);
  save.mastery[phraseId] = after;
  cur.gains[phraseId] = { before: cur.gains[phraseId]?.before ?? before, after };
  persist();
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
    const [ja, zh] = pick(CONFUSED);
    const who = speakerOf();
    t.feedback = r.heard
      ? `你說「${esc(r.heard)}」<br>${esc(who.name)}：「${ja}」（${zh}）<br>提示多給你一點，再試一次。`
      : '沒聽清楚，再試一次？';
    t.fbType = 'warn';
    if (t.chosen === null) { t.free = false; t.feedback += ' 先選一個想表達的意思吧。'; }
    render();
    if (r.heard) speak(ja, { pitch: who.pitch });
    return;
  }
  t.switched = t.chosen !== null && r.idx !== t.chosen;
  recordResult(t.choices[r.idx].phrase, t);
  t.result = r;
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
  start() { save = freshSave(); persist(); screen = 'plan'; render(); },
  continue() { screen = save.finished ? 'final' : 'plan'; render(); },
  reset() {
    if (save.done.length && !confirm('確定要清除進度、從頭開始嗎？')) return;
    save = freshSave(); persist(); screen = 'plan'; render();
  },
  home() { stopSpeaking(); screen = 'title'; render(); },
  leave() { stopSpeaking(); cur.turn?.listening?.stop(); cur = null; screen = 'plan'; render(); },
  toPlan() { cur = null; screen = 'plan'; render(); },
  quest({ id }) { startQuest(id); },
  endDay() {
    if (save.day < MAX_DAY) {
      save.day++;
      toast = '🌙 你在飯店睡了一晚。新的一天開始了！';
      screen = 'plan';
    } else {
      save.finished = true;
      screen = 'final';
    }
    persist();
    render();
  },
  replayDay2() { save.day = MAX_DAY; save.finished = false; persist(); screen = 'plan'; render(); },
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
  showChoices() { cur.turn.free = false; cur.turn.chosen = cur.turn.choices.length === 1 ? 0 : null; render(); },
  say() { const t = cur.turn; speak(PHRASES[t.choices[t.chosen].phrase].ja, { rate: 0.9 }); },
  saySlow() { const t = cur.turn; speak(PHRASES[t.choices[t.chosen].phrase].ja, { rate: 0.6 }); },
  hint() { cur.turn.hint = Math.min(3, cur.turn.hint + 1); render(); },
  mic() { toggleMic(); },
  skip() {
    const t = cur.turn;
    const c = t.choices[t.chosen ?? 0];
    recordResult(c.phrase, { hint: 3, attempts: t.attempts, skipped: true });
    if (c.flag) save.flags[c.flag] = true;
    persist();
    goto(c.next);
  },
  advance() {
    const c = cur.turn.choices[cur.turn.result.idx];
    if (c.flag) { save.flags[c.flag] = true; persist(); }
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
