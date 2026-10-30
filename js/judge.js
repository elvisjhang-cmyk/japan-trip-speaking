// 判斷玩家說的話（或打的字）符合哪一個意思。
// 目前用關鍵詞比對，不需要 API key；之後可以換成 LLM 判斷，只要維持 judge() 的輸入輸出即可。

const ROWS = {
  '': 'あいうえお', k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの',
  h: 'はひふへほ', m: 'まみむめも', r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ',
  d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ',
};
const VOWELS = 'aiueo';

const ROMAJI = {
  ya: 'や', yu: 'ゆ', yo: 'よ', wa: 'わ', wo: 'を', '-': 'ー',
  shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', di: 'ぢ', du: 'づ',
};
for (const [c, row] of Object.entries(ROWS)) {
  [...VOWELS].forEach((v, i) => { ROMAJI[c + v] = row[i]; });
}
for (const [c, base] of [['ky', 'き'], ['sh', 'し'], ['sy', 'し'], ['ch', 'ち'], ['ty', 'ち'], ['cy', 'ち'], ['ny', 'に'], ['hy', 'ひ'],
  ['my', 'み'], ['ry', 'り'], ['gy', 'ぎ'], ['j', 'じ'], ['jy', 'じ'], ['zy', 'じ'], ['by', 'び'], ['py', 'ぴ'], ['dy', 'ぢ']]) {
  ROMAJI[c + 'a'] = base + 'ゃ';
  ROMAJI[c + 'u'] = base + 'ゅ';
  ROMAJI[c + 'o'] = base + 'ょ';
  if (['sh', 'ch', 'j'].includes(c)) ROMAJI[c + 'e'] = base + 'ぇ';
}

export function romajiToKana(input) {
  const s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const n = s[i + 1];
    if (c === 'n') {
      if (n === "'") { out += 'ん'; i += 2; continue; }
      if (n === 'n') {
        out += 'ん';
        // konnichiwa → こんにちわ：後面接母音時只吃掉一個 n
        i += s[i + 2] && 'aiueoy'.includes(s[i + 2]) ? 1 : 2;
        continue;
      }
      if (!n || !'aiueoy'.includes(n)) { out += 'ん'; i++; continue; }
    }
    if ((c === n && /[bcdfghjkmpqrstvwxyz]/.test(c)) || (c === 't' && n === 'c')) {
      out += 'っ'; i++; continue;
    }
    let hit = false;
    for (const len of [3, 2, 1]) {
      const k = s.substr(i, len);
      if (ROMAJI[k]) { out += ROMAJI[k]; i += len; hit = true; break; }
    }
    if (!hit) { out += c; i++; }
  }
  return out;
}

const VOWEL_OF = {};
for (const row of Object.values(ROWS)) [...row].forEach((ch, i) => { VOWEL_OF[ch] = VOWELS[i]; });
Object.assign(VOWEL_OF, { 'ゃ': 'a', 'ゅ': 'u', 'ょ': 'o', 'や': 'a', 'ゆ': 'u', 'よ': 'o', 'わ': 'a', 'を': 'o' });
const VOWEL_KANA = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };

// 長音符號換成母音：らーめん / raamen / ra-men 都變成「らあめん」
function expandLongVowels(s) {
  let out = '';
  for (const ch of s) out += ch === 'ー' ? VOWEL_KANA[VOWEL_OF[out[out.length - 1]]] || '' : ch;
  return out;
}

export function normalize(text) {
  let s = (text || '').normalize('NFKC').toLowerCase();
  if (/[a-z]/.test(s)) s = s.replace(/[a-z'-]+/g, m => romajiToKana(m));
  s = s.replace(/[\s、。，,.．！!？?・「」『』…〜~]/g, '');
  s = s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  return expandLongVowels(s);
}

const has = (t, words) => words.some(w => t.includes(normalize(w)));

// 回傳 null（意思不符）或 { natural }（意思正確；natural=false 表示缺少比較自然的部分）
export function matchPhrase(text, phrase) {
  const t = normalize(text);
  if (!t) return null;
  if (phrase.neg && has(t, phrase.neg)) return null;
  if (!phrase.req.every(group => has(t, group))) return null;
  return { natural: !phrase.bonus || phrase.bonus.every(group => has(t, group)) };
}

// alternatives：語音辨識的多個候選結果（或打字的一句）
// options：目前可以說的選項 [{ phrase }]，phrases：PHRASES 表
// preferIdx：玩家先選好的意思（優先比對）；-1 表示自由回答
// metaPhrase：任何時候都能說的「請再說一次」
export function judge(alternatives, options, phrases, preferIdx = -1, metaPhrase = null) {
  const order = options.map((_, i) => i);
  if (preferIdx >= 0) order.sort((a, b) => (b === preferIdx) - (a === preferIdx));
  for (const i of order) {
    for (const alt of alternatives) {
      const r = matchPhrase(alt, phrases[options[i].phrase]);
      if (r) return { idx: i, natural: r.natural, heard: alt };
    }
  }
  if (metaPhrase) {
    for (const alt of alternatives) {
      if (matchPhrase(alt, metaPhrase)) return { idx: -1, meta: 'repeat', heard: alt };
    }
  }
  return { idx: -1, heard: alternatives[0] || '' };
}
