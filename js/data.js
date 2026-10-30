// 語言內容（日文模組）。之後要做英文版，只要換掉這個檔案的 PHRASES 與 QUESTS 文字即可，
// 遊戲引擎（game.js）不需要改。
//
// PHRASES：玩家要學會「說出口」的句子
//   req   必要關鍵詞組：每一組至少要命中一個詞，才算意思正確
//   bonus 加分詞組：缺少時仍算通過，但會提示更自然的說法
//   neg   排除詞：出現就不算這個意思（例如「はい、大丈夫です」其實是拒絕）
// 關鍵詞可以寫漢字、平假名、片假名，比對前會自動統一。

const KUDASAI = ['ください', '下さい', 'おねがい', 'お願い'];
const NO_THANKS = ['だいじょうぶ', '大丈夫', 'いらない', '要らない', 'いりません', '要りません', 'けっこう', '結構', 'いいえ'];

export const PHRASES = {
  sumimasen:     { ja: 'すみません', kana: 'すみません', romaji: 'sumimasen', zh: '不好意思／請問', req: [['すみません', 'すいません', '済みません']] },
  kore_kudasai:  { ja: 'これをください', kana: 'これをください', romaji: 'kore o kudasai', zh: '請給我這個', req: [['これ', 'こちら', 'それ']], bonus: [KUDASAI] },
  hai:           { ja: 'はい、お願いします', kana: 'はい、おねがいします', romaji: 'hai, onegai shimasu', zh: '好，麻煩你了', req: [['はい', 'おねがい', 'お願い', 'ええ', 'うん']], neg: NO_THANKS },
  daijoubu:      { ja: '大丈夫です', kana: 'だいじょうぶです', romaji: 'daijoubu desu', zh: '不用了，沒關係', req: [NO_THANKS], note: '日本人常用「大丈夫です」委婉地表示「不用了」。' },
  fukuro_onegai: { ja: '袋をお願いします', kana: 'ふくろをおねがいします', romaji: 'fukuro o onegai shimasu', zh: '請給我袋子', req: [['ふくろ', '袋', 'おねがい', 'お願い', 'ください', '下さい', 'はい']], neg: NO_THANKS },
  fukuro_iranai: { ja: '袋は大丈夫です', kana: 'ふくろはだいじょうぶです', romaji: 'fukuro wa daijoubu desu', zh: '不用袋子', req: [NO_THANKS] },
  card:          { ja: 'カードでお願いします', kana: 'かーどでおねがいします', romaji: 'kaado de onegai shimasu', zh: '我用信用卡付', req: [['カード', 'クレジット']], bonus: [KUDASAI] },
  genkin:        { ja: '現金でお願いします', kana: 'げんきんでおねがいします', romaji: 'genkin de onegai shimasu', zh: '我付現金', req: [['げんきん', '現金']], bonus: [KUDASAI] },
  arigatou:      { ja: 'ありがとうございます', kana: 'ありがとうございます', romaji: 'arigatou gozaimasu', zh: '謝謝', req: [['ありがと', '有難う', '有り難う']] },
  eki_doko:      { ja: '駅はどこですか', kana: 'えきはどこですか', romaji: 'eki wa doko desu ka', zh: '請問車站在哪裡？', req: [['えき', '駅'], ['どこ', '何処', 'どちら']] },
  mou_ichido:    { ja: 'もう一度お願いします', kana: 'もういちどおねがいします', romaji: 'mou ichido onegai shimasu', zh: '請再說一次', req: [['もういちど', 'もう一度', 'もう1度', 'もういっかい', 'もう一回', 'もう1回', 'ゆっくり']] },
  wakarimashita: { ja: 'わかりました', kana: 'わかりました', romaji: 'wakarimashita', zh: '我知道了', req: [['わかりました', '分かりました', '判りました', 'わかった', '分かった']] },
  hitori:        { ja: '一人です', kana: 'ひとりです', romaji: 'hitori desu', zh: '一個人', req: [['ひとり', '一人', '1人', '1名', '一名', 'いちめい']] },
  ramen:         { ja: 'ラーメンをください', kana: 'らーめんをください', romaji: 'raamen o kudasai', zh: '請給我拉麵', req: [['ラーメン', '拉麺']], bonus: [KUDASAI] },
  gyoza:         { ja: '餃子をください', kana: 'ぎょうざをください', romaji: 'gyouza o kudasai', zh: '請給我煎餃', req: [['ぎょうざ', '餃子', 'ギョーザ']], bonus: [KUDASAI] },
  taiwan:        { ja: 'はい、台湾から来ました', kana: 'はい、たいわんからきました', romaji: 'hai, taiwan kara kimashita', zh: '是的，我從台灣來', req: [['たいわん', '台湾']] },
  oishii:        { ja: 'おいしいです', kana: 'おいしいです', romaji: 'oishii desu', zh: '很好吃', req: [['おいしい', '美味しい', 'うまい', '旨い', '美味い']] },
  ikitai:        { ja: '行きたいです！', kana: 'いきたいです！', romaji: 'ikitai desu!', zh: '我想去！', req: [['いきたい', '行きたい', 'いく', '行く', 'いきます', '行きます', 'ぜひ', '是非']], neg: ['いけない', '行けない', 'いけません', '行けません', 'いかない', '行かない'] },
  ikenai:        { ja: 'すみません、行けないです', kana: 'すみません、いけないです', romaji: 'sumimasen, ikenai desu', zh: '抱歉，我沒辦法去', req: [['いけない', '行けない', 'いけません', '行けません', 'ちょっと', 'むり', '無理']] },
  okaikei:       { ja: 'お会計お願いします', kana: 'おかいけいおねがいします', romaji: 'okaikei onegai shimasu', zh: '麻煩結帳', req: [['かいけい', '会計', 'かんじょう', '勘定', 'チェック']] },
  gochisousama:  { ja: 'ごちそうさまでした', kana: 'ごちそうさまでした', romaji: 'gochisousama deshita', zh: '謝謝招待（吃飽後說）', req: [['ごちそうさま', 'ご馳走様', '御馳走様', 'ごちそうさん']] },
  ikura:         { ja: 'いくらですか', kana: 'いくらですか', romaji: 'ikura desu ka', zh: '多少錢？', req: [['いくら', '幾ら']] },
  kohii:         { ja: 'コーヒーをください', kana: 'こーひーをください', romaji: 'koohii o kudasai', zh: '請給我咖啡', req: [['コーヒー', '珈琲']], bonus: [KUDASAI] },
  matcha:        { ja: '抹茶ラテをください', kana: 'まっちゃらてをください', romaji: 'maccha rate o kudasai', zh: '請給我抹茶拿鐵', req: [['まっちゃ', '抹茶']], bonus: [KUDASAI] },
  tennai:        { ja: '店内でお願いします', kana: 'てんないでおねがいします', romaji: 'tennai de onegai shimasu', zh: '內用', req: [['てんない', '店内', 'ここで']] },
  mochikaeri:    { ja: '持ち帰りでお願いします', kana: 'もちかえりでおねがいします', romaji: 'mochikaeri de onegai shimasu', zh: '外帶', req: [['もちかえり', '持ち帰り', '持ちかえり', 'テイクアウト']] },
  omizu:         { ja: 'お水をください', kana: 'おみずをください', romaji: 'omizu o kudasai', zh: '請給我水', req: [['みず', '水', 'おひや', 'お冷']], bonus: [KUDASAI] },
  konbanwa:      { ja: 'こんばんは', kana: 'こんばんは', romaji: 'konbanwa', zh: '晚安（晚上見面的招呼）', req: [['こんばんは', 'こんばんわ', '今晩は']] },
  takoyaki:      { ja: 'たこ焼きがいいです', kana: 'たこやきがいいです', romaji: 'takoyaki ga ii desu', zh: '我想吃章魚燒', req: [['たこやき', 'たこ焼き', '蛸焼き']] },
  yakisoba:      { ja: '焼きそばがいいです', kana: 'やきそばがいいです', romaji: 'yakisoba ga ii desu', zh: '我想吃炒麵', req: [['やきそば', '焼きそば', '焼そば']] },
  futatsu:       { ja: '二つください', kana: 'ふたつください', romaji: 'futatsu kudasai', zh: '請給我兩個', req: [['ふたつ', '二つ', '2つ']], bonus: [KUDASAI] },
  mata_kimasu:   { ja: 'はい、また来ます', kana: 'はい、またきます', romaji: 'hai, mata kimasu', zh: '會，我會再來', req: [['また', '又'], ['きます', '来ます', 'くる', '来る', 'きたい', '来たい']] },
  aitai:         { ja: 'また会いたいです', kana: 'またあいたいです', romaji: 'mata aitai desu', zh: '我想再見到你', req: [['あいたい', '会いたい', '逢いたい']] },
  motteinai:     { ja: '持っていないです', kana: 'もっていないです', romaji: 'motte inai desu', zh: '沒有', req: [['ない', 'ありません', 'いいえ', 'だいじょうぶ', '大丈夫']] },
};

// 遇到聽不懂時，在任何對話都能說的「萬用求救句」
export const META_REPEAT = 'mou_ichido';

// 遊戲結尾的「旅遊能力」分類
export const SKILLS = [
  { name: '🛍️ 購物結帳', phrases: ['kore_kudasai', 'ikura', 'fukuro_iranai', 'card', 'genkin'] },
  { name: '🗺️ 問路求助', phrases: ['sumimasen', 'eki_doko', 'mou_ichido', 'wakarimashita'] },
  { name: '🍜 餐廳點餐', phrases: ['hitori', 'ramen', 'omizu', 'okaikei', 'gochisousama'] },
  { name: '💬 跟人聊天', phrases: ['taiwan', 'oishii', 'konbanwa', 'ikitai'] },
  { name: '👂 聽懂店員', listen: ['irasshaimase', 'atatame', 'fukuro', 'shiharai', 'point', 'chuumon', 'tennai', 'michi_annai', 'nanahyaku', 'gohyakuen', 'ninki'] },
];

// QUESTS：每一天早上可選的支線
// 節點：
//   narr     旁白（中文）
//   npc      NPC 台詞 { who, ja, kana, zh, concept, keys, alt, quiz }
//            concept 相同的台詞第二次出現時不顯示字幕，改成聽力題（「對方剛剛說的是？」）
//            keys  聽力關鍵詞 [['日文', '中文']]，顯示字幕時一起教
//            alt   聽力題的干擾選項（容易搞混的意思）；沒寫就從其他台詞隨機挑
//            quiz  一定要先聽懂才顯示字幕的題目 { q, options, answer }（例如價錢、路線）
//   choices  玩家回合 [{ zh, phrase, next, hint, flag }]
//   next     沒有玩家回合時，按「繼續」前往的節點
//   end      支線結束
export const QUESTS = [
  {
    id: 'konbini', day: 1, emoji: '🏪', title: '便利商店買早餐',
    desc: '肚子餓了，去飯店樓下的便利商店買飯糰和便當。',
    bg: 'linear-gradient(160deg,#e3f6e8,#a9dfc0)',
    cast: { clerk: { name: '店員', emoji: '🧑‍💼', pitch: 1.1 } },
    start: 's',
    nodes: {
      s:  { narr: '你拿了一個飯糰和一個便當，走到櫃台。', next: 'n1' },
      n1: { npc: { who: 'clerk', ja: 'いらっしゃいませ！', kana: 'いらっしゃいませ', zh: '歡迎光臨！', concept: 'irasshaimase',
                   keys: [['いらっしゃいませ', '歡迎光臨（不用回答，點頭就好）']], alt: ['謝謝光臨！', '請稍等一下。'] },
            choices: [{ zh: '（把商品放上櫃台）請給我這些', phrase: 'kore_kudasai', hint: '指著商品，說「這個」＋「請給我」', next: 'n2' }] },
      n2: { npc: { who: 'clerk', ja: 'お弁当、温めますか？', kana: 'おべんとう、あたためますか？', zh: '便當要幫你加熱嗎？', concept: 'atatame',
                   keys: [['お弁当', '便當'], ['温めますか', '要加熱嗎']], alt: ['需要袋子嗎？', '需要筷子嗎？'] },
            choices: [
              { zh: '要，麻煩加熱', phrase: 'hai', hint: '先說「是」，再加上「麻煩了」', next: 'n3a' },
              { zh: '不用了', phrase: 'daijoubu', hint: '日本人會用「沒問題」來表示不用', next: 'n3' }] },
      n3a: { npc: { who: 'clerk', ja: 'かしこまりました。少々お待ちください。', kana: 'かしこまりました。しょうしょうおまちください。', zh: '好的，請稍等。', concept: 'shoushou',
                    keys: [['かしこまりました', '好的（我明白了）'], ['少々お待ちください', '請稍等']] }, next: 'n3' },
      n3: { npc: { who: 'clerk', ja: '袋はご利用ですか？', kana: 'ふくろはごりようですか？', zh: '需要袋子嗎？', concept: 'fukuro',
                   keys: [['袋', '袋子'], ['ご利用ですか', '要使用嗎']], alt: ['便當要加熱嗎？', '有集點卡嗎？'] },
            choices: [
              { zh: '要袋子', phrase: 'fukuro_onegai', hint: '「袋子」＋「麻煩了」', next: 'n4' },
              { zh: '不用袋子', phrase: 'fukuro_iranai', hint: '跟剛剛「不用加熱」一樣的說法', next: 'n4' }] },
      n4: { npc: { who: 'clerk', ja: 'ポイントカードはお持ちですか？', kana: 'ぽいんとかーどはおもちですか？', zh: '有集點卡嗎？', concept: 'point',
                   keys: [['ポイントカード', '集點卡'], ['お持ちですか', '有帶嗎']], alt: ['要用信用卡付嗎？', '需要袋子嗎？'] },
            choices: [{ zh: '沒有', phrase: 'motteinai', hint: '日本結帳幾乎都會問這句。「有」是 ある，「沒有」就是…', next: 'n4b' }] },
      n4b: { npc: { who: 'clerk', ja: 'お支払いはどうされますか？', kana: 'おしはらいはどうされますか？', zh: '請問要怎麼付款？', concept: 'shiharai',
                    keys: [['お支払い', '付款'], ['どうされますか', '要怎麼做']], alt: ['有集點卡嗎？', '要幫你加熱嗎？'] },
             choices: [
               { zh: '刷卡', phrase: 'card', hint: '「卡」的日文就是英文 card', next: 'n4c' },
               { zh: '付現金', phrase: 'genkin', hint: '現金的音讀', next: 'n4c' }] },
      n4c: { npc: { who: 'clerk', ja: '七百八十円になります。', kana: 'ななひゃくはちじゅうえんになります。', zh: '這樣是七百八十日圓。', concept: 'nanahyaku',
                    keys: [['七百', '700'], ['八十', '80'], ['円になります', '日圓（店員的禮貌說法）']],
                    quiz: { q: '一共多少錢？', options: ['780 日圓', '1780 日圓', '870 日圓'], answer: 0 } }, next: 'n5' },
      n5: { npc: { who: 'clerk', ja: 'ありがとうございました！', kana: 'ありがとうございました', zh: '謝謝光臨！', concept: 'arigatou_shop',
                   keys: [['ありがとうございました', '謝謝光臨（結帳後店員說的）']], alt: ['歡迎光臨！', '請稍等一下。'] },
            choices: [{ zh: '謝謝', phrase: 'arigatou', hint: '店員剛剛說的那句，改成現在式', next: 'end' }] },
      end: { end: true, narr: '你拿著早餐走出便利商店。第一次用日文買東西，成功！' },
    },
  },
  {
    id: 'michi', day: 1, emoji: '🚉', title: '問路去車站',
    desc: '想去淺草，Google Maps 卻突然沒網路……路邊有位阿姨看起來很親切。',
    bg: 'linear-gradient(160deg,#e2efff,#b3cff3)',
    cast: { obasan: { name: '路過的阿姨', emoji: '👵', pitch: 1.25 } },
    start: 's',
    nodes: {
      s:  { narr: '先叫住阿姨吧。', choices: [{ zh: '不好意思（叫住對方）', phrase: 'sumimasen', hint: '日本最萬用的一句話', next: 'n2' }] },
      n2: { npc: { who: 'obasan', ja: 'はい、どうしましたか？', kana: 'はい、どうしましたか？', zh: '是，怎麼了嗎？', concept: 'doushimashita' },
            choices: [{ zh: '請問車站在哪裡？', phrase: 'eki_doko', hint: '「車站」＋「在哪裡」＋「嗎」', next: 'n3' }] },
      n3: { npc: { who: 'obasan', ja: '駅ですか？ この道をまっすぐ行って、二つ目の信号を右に曲がってください。', kana: 'えきですか？ このみちをまっすぐいって、ふたつめのしんごうをみぎにまがってください。', zh: '車站嗎？這條路直走，在第二個紅綠燈右轉。', concept: 'michi_annai',
                   keys: [['まっすぐ', '直走'], ['二つ目', '第二個'], ['信号', '紅綠燈'], ['右に曲がって', '右轉']],
                   quiz: { q: '阿姨說要怎麼走？', options: ['直走，第二個紅綠燈右轉', '直走，第一個紅綠燈左轉', '右轉之後一直直走'], answer: 0 } },
            choices: [
              { zh: '聽不太懂，請再說一次', phrase: 'mou_ichido', hint: '「再一次」＋「麻煩了」', next: 'n4' },
              { zh: '我知道了', phrase: 'wakarimashita', hint: '「わかる」的過去式', next: 'n5' }] },
      n4: { npc: { who: 'obasan', ja: 'まっすぐ行って……二つ目の信号を……右です。', kana: 'まっすぐいって……ふたつめのしんごうを……みぎです。', zh: '直走……第二個紅綠燈……右轉。', concept: 'michi_annai_slow', slow: true },
            choices: [{ zh: '我知道了', phrase: 'wakarimashita', hint: '「わかる」的過去式', next: 'n5' }] },
      n5: { npc: { who: 'obasan', ja: '気をつけてね。', kana: 'きをつけてね。', zh: '路上小心喔。', concept: 'kiotsukete' },
            choices: [{ zh: '謝謝您', phrase: 'arigatou', hint: '最基本的謝謝', next: 'end' }] },
      end: { end: true, narr: '照著阿姨說的走，車站就在眼前！「まっすぐ＝直走」「右（みぎ）＝右邊」，記住了。' },
    },
  },
  {
    id: 'ramen', day: 1, emoji: '🍜', title: '巷子裡的拉麵店',
    desc: '聽說附近有一家只有當地人才知道的拉麵店。晚餐就決定是它了。',
    bg: 'linear-gradient(160deg,#4a2e28,#9a4b32)',
    dark: true,
    cast: {
      master: { name: '老闆', emoji: '👨‍🍳', pitch: 0.8 },
      yui: { name: '結衣', emoji: '👩', pitch: 1.3 },
    },
    start: 's',
    nodes: {
      s:  { narr: '推開店門，熱氣撲面而來。', next: 'n1' },
      n1: { npc: { who: 'master', ja: 'いらっしゃい！ 何名様ですか？', kana: 'いらっしゃい！ なんめいさまですか？', zh: '歡迎！請問幾位？', concept: 'nanmei',
                   keys: [['何名様', '幾位客人']], alt: ['要點什麼？', '要內用嗎？'] },
            choices: [{ zh: '一個人', phrase: 'hitori', hint: '「一個人」＋「です」', next: 'n2' }] },
      n2: { npc: { who: 'master', ja: 'カウンターへどうぞ。ご注文は？', kana: 'かうんたーへどうぞ。ごちゅうもんは？', zh: '請坐吧台。要點什麼？', concept: 'chuumon',
                   keys: [['カウンター', '吧台'], ['ご注文', '點餐']], alt: ['請問幾位？', '要內用還是外帶？'] },
            choices: [
              { zh: '拉麵', phrase: 'ramen', hint: '餐點名稱＋「をください」', next: 'n3' },
              { zh: '煎餃', phrase: 'gyoza', hint: '餐點名稱＋「をください」', next: 'n3' }] },
      n3: { npc: { who: 'master', ja: 'はいよ、少々お待ち！', kana: 'はいよ、しょうしょうおまち！', zh: '好嘞，稍等一下！', concept: 'shoushou',
                   keys: [['少々お待ち', '稍等一下']], alt: ['謝謝惠顧！', '要點什麼？'] }, next: 'n4' },
      n4: { narr: '隔壁座位的女生看你在研究菜單，笑著轉過來。', next: 'n5' },
      n5: { npc: { who: 'yui', ja: 'こんばんは。観光ですか？', kana: 'こんばんは。かんこうですか？', zh: '晚安。你是來觀光的嗎？', concept: 'kankou' },
            choices: [{ zh: '是的，我從台灣來', phrase: 'taiwan', hint: '「台灣」＋「從」＋「來了」', next: 'n6' }] },
      n6: { npc: { who: 'yui', ja: '台湾！ いいですね。わたし、結衣です。ここのラーメン、おいしいですよ。', kana: 'たいわん！ いいですね。わたし、ゆいです。ここのらーめん、おいしいですよ。', zh: '台灣！真好。我叫結衣。這家的拉麵很好吃喔。', concept: 'yui_intro' }, next: 'n7' },
      n7: { narr: '餐點上桌了。你吃了一口——', next: 'n8' },
      n8: { npc: { who: 'yui', ja: 'どうですか？', kana: 'どうですか？', zh: '怎麼樣？', concept: 'doudesuka' },
            choices: [{ zh: '很好吃！', phrase: 'oishii', hint: '結衣剛剛說過的那個詞', next: 'n9' }] },
      n9: { npc: { who: 'yui', ja: 'よかった！ あ、明日の夜、近くでお祭りがあるんです。よかったら、一緒に行きませんか？', kana: 'よかった！ あ、あしたのよる、ちかくでおまつりがあるんです。よかったら、いっしょにいきませんか？', zh: '太好了！啊，明天晚上附近有祭典。方便的話，要不要一起去？', concept: 'matsuri_invite' },
            choices: [
              { zh: '我想去！', phrase: 'ikitai', hint: '「去」＋「想要」', next: 'n10', flag: 'yui_yes' },
              { zh: '抱歉，沒辦法去', phrase: 'ikenai', hint: '「不好意思」＋「不能去」', next: 'n10b' }] },
      n10: { npc: { who: 'yui', ja: 'やった！ じゃあ、明日の七時に、神社の前で。', kana: 'やった！ じゃあ、あしたのしちじに、じんじゃのまえで。', zh: '太好了！那明天七點，神社前面見。', concept: 'yakusoku' }, next: 'n11' },
      n10b: { npc: { who: 'yui', ja: 'そっか、残念。じゃあ、またどこかで。', kana: 'そっか、ざんねん。じゃあ、またどこかで。', zh: '這樣啊，好可惜。那有緣再見囉。', concept: 'zannen' }, next: 'n11' },
      n11: { narr: '吃飽了，該結帳了。', choices: [{ zh: '麻煩結帳', phrase: 'okaikei', hint: '「會計」＋「麻煩了」', next: 'n12' }] },
      n12: { npc: { who: 'master', ja: '千百円です。まいど！', kana: 'せんひゃくえんです。まいど！', zh: '一千一百日圓。謝謝惠顧！', concept: 'senen',
                    keys: [['千百円', '1100 日圓'], ['まいど', '謝謝惠顧（關西口語）']],
                    quiz: { q: '老闆說多少錢？', options: ['1100 日圓', '1000 日圓', '700 日圓'], answer: 0 } },
             choices: [{ zh: '謝謝招待（吃飽後的禮貌話）', phrase: 'gochisousama', hint: '吃完飯一定要說的一句', next: 'end' }] },
      end: { end: true, narr: '走出拉麵店，夜風很舒服。明天……會發生什麼呢？' },
    },
  },
  {
    id: 'cafe', day: 2, emoji: '☕', title: '咖啡廳的早晨',
    desc: '找間咖啡廳吃早餐，順便規劃今天的行程。',
    bg: 'linear-gradient(160deg,#f6e8d6,#ddb98f)',
    cast: { staff: { name: '店員', emoji: '👩‍💼', pitch: 1.15 } },
    start: 'n1',
    nodes: {
      n1: { npc: { who: 'staff', ja: 'いらっしゃいませ。ご注文はお決まりですか？', kana: 'いらっしゃいませ。ごちゅうもんはおきまりですか？', zh: '歡迎光臨。決定好要點什麼了嗎？', concept: 'chuumon',
                   keys: [['ご注文', '點餐'], ['お決まりですか', '決定了嗎']], alt: ['請問幾位？', '要內用還是外帶？'] },
            choices: [
              { zh: '咖啡', phrase: 'kohii', hint: '跟昨天點拉麵一樣的句型', next: 'n2' },
              { zh: '抹茶拿鐵', phrase: 'matcha', hint: '跟昨天點拉麵一樣的句型', next: 'n2' }] },
      n2: { npc: { who: 'staff', ja: '店内でお召し上がりですか？', kana: 'てんないでおめしあがりですか？', zh: '在店內用餐嗎？', concept: 'tennai',
                   keys: [['店内で', '在店裡'], ['お召し上がり', '享用（吃、喝的敬語）']], alt: ['決定好要點什麼了嗎？', '要加冰塊嗎？'] },
            choices: [
              { zh: '內用', phrase: 'tennai', hint: '店員話裡的第一個詞', next: 'n3' },
              { zh: '外帶', phrase: 'mochikaeri', hint: '「拿著回家」', next: 'n3' }] },
      n3: { narr: '你想先確認價錢。', choices: [{ zh: '多少錢？', phrase: 'ikura', hint: '問價錢的固定說法', next: 'n4' }] },
      n4: { npc: { who: 'staff', ja: '五百五十円です。', kana: 'ごひゃくごじゅうえんです。', zh: '五百五十日圓。', concept: 'gohyakuen',
                   keys: [['五百', '500'], ['五十', '50']],
                   quiz: { q: '店員說多少錢？', options: ['550 日圓', '505 日圓', '1550 日圓'], answer: 0 } }, next: 'n5' },
      n5: { npc: { who: 'staff', ja: 'お支払い方法はいかがなさいますか？', kana: 'おしはらいほうほうはいかがなさいますか？', zh: '付款方式要用哪一種呢？', concept: 'shiharai',
                   keys: [['お支払い方法', '付款方式'], ['いかがなさいますか', '您要怎麼做呢（很客氣）']], alt: ['有集點卡嗎？', '在店內用餐嗎？'] },
            choices: [
              { zh: '刷卡', phrase: 'card', hint: '昨天在便利商店說過', next: 'n6' },
              { zh: '付現金', phrase: 'genkin', hint: '昨天在便利商店說過', next: 'n6' }] },
      n6: { narr: '等飲料的時候，你覺得有點渴。', choices: [{ zh: '請給我水', phrase: 'omizu', hint: '「水」前面加個「お」比較有禮貌', next: 'n7' }] },
      n7: { npc: { who: 'staff', ja: 'はい、どうぞ。', kana: 'はい、どうぞ。', zh: '好的，請用。', concept: 'douzo' },
            choices: [{ zh: '謝謝', phrase: 'arigatou', next: 'end' }] },
      end: { end: true, narr: '咖啡很香。你發現昨天學的句子，今天不用看字幕也說得出來了。' },
    },
  },
  {
    id: 'omiyage', day: 2, emoji: '🎁', title: '挑伴手禮',
    desc: '要回台灣了，幫同事和家人買點伴手禮吧。',
    bg: 'linear-gradient(160deg,#fde6ea,#f0b3c1)',
    cast: { staff: { name: '店員', emoji: '🧑', pitch: 1.0 } },
    start: 's',
    nodes: {
      s:  { narr: '你看到一盒很漂亮的抹茶點心，想問問看。', choices: [{ zh: '不好意思（叫住店員）', phrase: 'sumimasen', hint: '昨天問路時用過', next: 'n2' }] },
      n2: { npc: { who: 'staff', ja: 'はい、いらっしゃいませ。', kana: 'はい、いらっしゃいませ。', zh: '是，歡迎光臨。', concept: 'irasshaimase',
                   keys: [['いらっしゃいませ', '歡迎光臨']], alt: ['謝謝光臨！', '請稍等一下。'] },
            choices: [{ zh: '（指著點心）這個多少錢？', phrase: 'ikura', hint: '問價錢的固定說法', next: 'n3' }] },
      n3: { npc: { who: 'staff', ja: 'こちらは千二百円です。人気ですよ。', kana: 'こちらはせんにひゃくえんです。にんきですよ。', zh: '這個是一千兩百日圓，很受歡迎喔。', concept: 'ninki',
                   keys: [['千二百円', '1200 日圓'], ['人気', '受歡迎']],
                   quiz: { q: '這盒點心多少錢？', options: ['1200 日圓', '2100 日圓', '1020 日圓'], answer: 0 } },
            choices: [
              { zh: '請給我這個', phrase: 'kore_kudasai', hint: '昨天在便利商店說過', next: 'n4' },
              { zh: '不用了（婉拒）', phrase: 'daijoubu', hint: '委婉說「不用了」', next: 'end_no' }] },
      n4: { npc: { who: 'staff', ja: '袋、お付けしますか？', kana: 'ふくろ、おつけしますか？', zh: '要幫你裝袋嗎？', concept: 'fukuro',
                   keys: [['袋', '袋子'], ['お付けしますか', '要幫你附上嗎']], alt: ['要包裝成禮物嗎？', '有集點卡嗎？'] },
            choices: [
              { zh: '要袋子', phrase: 'fukuro_onegai', next: 'n4b' },
              { zh: '不用袋子', phrase: 'fukuro_iranai', next: 'n4b' }] },
      n4b: { npc: { who: 'staff', ja: 'ポイントカード、お持ちですか？', kana: 'ぽいんとかーど、おもちですか？', zh: '有集點卡嗎？', concept: 'point',
                    keys: [['ポイントカード', '集點卡'], ['お持ちですか', '有帶嗎']], alt: ['要用信用卡付嗎？', '要幫你裝袋嗎？'] },
             choices: [{ zh: '沒有', phrase: 'motteinai', next: 'n5' }] },
      n5: { npc: { who: 'staff', ja: 'お支払いはどうされますか？', kana: 'おしはらいはどうされますか？', zh: '請問要怎麼付款？', concept: 'shiharai',
                   keys: [['お支払い', '付款'], ['どうされますか', '要怎麼做']], alt: ['有集點卡嗎？', '要幫你裝袋嗎？'] },
            choices: [
              { zh: '刷卡', phrase: 'card', next: 'n6' },
              { zh: '付現金', phrase: 'genkin', next: 'n6' }] },
      n6: { npc: { who: 'staff', ja: 'ありがとうございました！', kana: 'ありがとうございました', zh: '謝謝光臨！', concept: 'arigatou_shop',
                   keys: [['ありがとうございました', '謝謝光臨（結帳後店員說的）']], alt: ['歡迎光臨！', '請稍等一下。'] },
            choices: [{ zh: '謝謝', phrase: 'arigatou', next: 'end' }] },
      end: { end: true, narr: '伴手禮買好了！同事一定會很開心。' },
      end_no: { end: true, narr: '你笑著點頭離開。會婉拒，也是很重要的能力！' },
    },
  },
  {
    id: 'matsuri', day: 2, emoji: '🏮', title: '和結衣逛祭典',
    desc: '晚上七點，神社前。昨天在拉麵店認識的結衣，真的會來嗎？',
    lockedDesc: '好像錯過了什麼邀請……（去「巷子裡的拉麵店」看看）',
    requires: 'yui_yes',
    bg: 'linear-gradient(160deg,#232646,#5b2d63)',
    dark: true,
    cast: {
      yui: { name: '結衣', emoji: '👘', pitch: 1.3 },
      oji: { name: '攤販大叔', emoji: '👨', pitch: 0.8 },
    },
    start: 's',
    nodes: {
      s:  { narr: '神社前掛滿了燈籠。穿著浴衣的結衣向你揮手。', next: 'n2' },
      n2: { npc: { who: 'yui', ja: 'こんばんは！ 来てくれて、ありがとう。', kana: 'こんばんは！ きてくれて、ありがとう。', zh: '晚安！謝謝你來。', concept: 'kitekurete' },
            choices: [{ zh: '晚安！', phrase: 'konbanwa', hint: '結衣昨天見面時說的第一句話', next: 'n3' }] },
      n3: { npc: { who: 'yui', ja: '何か食べたいもの、ありますか？ たこ焼きとか、焼きそばとか。', kana: 'なにかたべたいもの、ありますか？ たこやきとか、やきそばとか。', zh: '有什麼想吃的嗎？像是章魚燒、炒麵之類的。', concept: 'tabetai' },
            choices: [
              { zh: '章魚燒', phrase: 'takoyaki', hint: '食物名稱＋「がいいです」', next: 'n4' },
              { zh: '炒麵', phrase: 'yakisoba', hint: '食物名稱＋「がいいです」', next: 'n4' }] },
      n4: { narr: '你們走到攤位前。', next: 'n5' },
      n5: { npc: { who: 'oji', ja: 'へい、らっしゃい！ いくつ？', kana: 'へい、らっしゃい！ いくつ？', zh: '嘿，歡迎！要幾份？', concept: 'ikutsu' },
            choices: [{ zh: '請給我兩份', phrase: 'futatsu', hint: '「兩個」＋「請給我」', next: 'n6' }] },
      n6: { npc: { who: 'oji', ja: 'はいよ、二つで千円！', kana: 'はいよ、ふたつでせんえん！', zh: '好嘞，兩份一千日圓！', concept: 'roppyaku',
                   keys: [['二つで', '兩個一共'], ['千円', '1000 日圓']],
                   quiz: { q: '兩份一共多少錢？', options: ['1000 日圓', '500 日圓', '2000 日圓'], answer: 0 } }, next: 'n7' },
      n7: { narr: '你付了錢，把一份遞給結衣。', next: 'n8' },
      n8: { npc: { who: 'yui', ja: 'え、いいんですか？ ありがとう！ ……ん、おいしい！', kana: 'え、いいんですか？ ありがとう！ ……ん、おいしい！', zh: '欸，可以嗎？謝謝！……嗯，好好吃！', concept: 'iindesuka' },
            choices: [{ zh: '很好吃呢', phrase: 'oishii', hint: '昨天在拉麵店說過', next: 'n9' }] },
      n9: { narr: '遠處傳來「咻——」的聲音，夜空亮了起來。', next: 'n10' },
      n10: { npc: { who: 'yui', ja: 'あ、花火！ ……ねえ、また日本に来ますか？', kana: 'あ、はなび！ ……ねえ、またにほんにきますか？', zh: '啊，煙火！……吶，你還會再來日本嗎？', concept: 'mata' },
             choices: [
               { zh: '會，我會再來', phrase: 'mata_kimasu', hint: '「又」＋「來」', next: 'end' },
               { zh: '我想再見到你', phrase: 'aitai', hint: '「又」＋「見面」＋「想要」', next: 'end' }] },
      end: { end: true, narr: '煙火在夜空中綻放。你發現，自己已經能用日文跟人聊天了。' },
    },
  },
];
