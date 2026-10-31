// 語言內容（日文模組）。之後要做英文版，只要換掉這個檔案的 PHRASES 與 QUESTS 文字即可，
// 遊戲引擎（game.js）不需要改。
//
// PHRASES：玩家要學會「說出口」的句子
//   req   必要關鍵詞組：每一組至少要命中一個詞，才算意思正確
//   full  完整句子必備的詞組：只說出關鍵字（例如只說「抹茶」）不算通過，會請玩家說完整
//   neg   排除詞：出現就不算這個意思（例如「はい、大丈夫です」其實是拒絕）
// 關鍵詞可以寫漢字、平假名、片假名，比對前會自動統一。

const KUDASAI = ['ください', '下さい', 'おねがい', 'お願い'];
const GA_II = ['がいい', 'にします', 'たべたい', '食べたい', 'ください', '下さい', 'おねがい', 'お願い'];
const NO_THANKS = ['だいじょうぶ', '大丈夫', 'いらない', '要らない', 'いりません', '要りません', 'けっこう', '結構', 'いいえ'];

export const PHRASES = {
  sumimasen:     { ja: 'すみません', kana: 'すみません', romaji: 'sumimasen', zh: '不好意思／請問', req: [['すみません', 'すいません', '済みません']] },
  kore_kudasai:  { ja: 'これをください', kana: 'これをください', romaji: 'kore o kudasai', zh: '請給我這個', req: [['これ', 'こちら', 'それ']], full: [KUDASAI] },
  hai:           { ja: 'はい、お願いします', kana: 'はい、おねがいします', romaji: 'hai, onegai shimasu', zh: '好，麻煩你了', req: [['はい', 'おねがい', 'お願い', 'ええ', 'うん']], full: [['おねがい', 'お願い']], neg: NO_THANKS },
  daijoubu:      { ja: '大丈夫です', kana: 'だいじょうぶです', romaji: 'daijoubu desu', zh: '不用了，沒關係', req: [NO_THANKS], note: '日本人常用「大丈夫です」委婉地表示「不用了」。' },
  fukuro_onegai: { ja: '袋をお願いします', kana: 'ふくろをおねがいします', romaji: 'fukuro o onegai shimasu', zh: '請給我袋子', req: [['ふくろ', '袋', 'おねがい', 'お願い', 'ください', '下さい', 'はい']], full: [KUDASAI], neg: NO_THANKS },
  fukuro_iranai: { ja: '袋は大丈夫です', kana: 'ふくろはだいじょうぶです', romaji: 'fukuro wa daijoubu desu', zh: '不用袋子', req: [NO_THANKS] },
  card:          { ja: 'カードでお願いします', kana: 'かーどでおねがいします', romaji: 'kaado de onegai shimasu', zh: '我用信用卡付', req: [['カード', 'クレジット']], full: [KUDASAI] },
  genkin:        { ja: '現金でお願いします', kana: 'げんきんでおねがいします', romaji: 'genkin de onegai shimasu', zh: '我付現金', req: [['げんきん', '現金']], full: [KUDASAI] },
  arigatou:      { ja: 'ありがとうございます', kana: 'ありがとうございます', romaji: 'arigatou gozaimasu', zh: '謝謝', req: [['ありがと', '有難う', '有り難う']] },
  eki_doko:      { ja: '駅はどこですか', kana: 'えきはどこですか', romaji: 'eki wa doko desu ka', zh: '請問車站在哪裡？', req: [['えき', '駅'], ['どこ', '何処', 'どちら']] },
  mou_ichido:    { ja: 'もう一度お願いします', kana: 'もういちどおねがいします', romaji: 'mou ichido onegai shimasu', zh: '請再說一次', req: [['もういちど', 'もう一度', 'もう1度', 'もういっかい', 'もう一回', 'もう1回', 'ゆっくり']] },
  wakarimashita: { ja: 'わかりました', kana: 'わかりました', romaji: 'wakarimashita', zh: '我知道了', req: [['わかりました', '分かりました', '判りました', 'わかった', '分かった']] },
  hitori:        { ja: '一人です', kana: 'ひとりです', romaji: 'hitori desu', zh: '一個人', req: [['ひとり', '一人', '1人', '1名', '一名', 'いちめい']] },
  ramen:         { ja: 'ラーメンをください', kana: 'らーめんをください', romaji: 'raamen o kudasai', zh: '請給我拉麵', req: [['ラーメン', '拉麺']], full: [KUDASAI] },
  gyoza:         { ja: '餃子をください', kana: 'ぎょうざをください', romaji: 'gyouza o kudasai', zh: '請給我煎餃', req: [['ぎょうざ', '餃子', 'ギョーザ']], full: [KUDASAI] },
  taiwan:        { ja: 'はい、台湾から来ました', kana: 'はい、たいわんからきました', romaji: 'hai, taiwan kara kimashita', zh: '是的，我從台灣來', req: [['たいわん', '台湾']], full: [['から'], ['きました', '来ました', 'きた', '来た']] },
  oishii:        { ja: 'おいしいです', kana: 'おいしいです', romaji: 'oishii desu', zh: '很好吃', req: [['おいしい', '美味しい', 'うまい', '旨い', '美味い']] },
  ikitai:        { ja: '行きたいです！', kana: 'いきたいです！', romaji: 'ikitai desu!', zh: '我想去！', req: [['いきたい', '行きたい', 'いく', '行く', 'いきます', '行きます', 'ぜひ', '是非']], neg: ['いけない', '行けない', 'いけません', '行けません', 'いかない', '行かない'] },
  ikenai:        { ja: 'すみません、行けないです', kana: 'すみません、いけないです', romaji: 'sumimasen, ikenai desu', zh: '抱歉，我沒辦法去', req: [['いけない', '行けない', 'いけません', '行けません', 'ちょっと', 'むり', '無理']] },
  okaikei:       { ja: 'お会計お願いします', kana: 'おかいけいおねがいします', romaji: 'okaikei onegai shimasu', zh: '麻煩結帳', req: [['かいけい', '会計', 'かんじょう', '勘定', 'チェック']], full: [KUDASAI] },
  gochisousama:  { ja: 'ごちそうさまでした', kana: 'ごちそうさまでした', romaji: 'gochisousama deshita', zh: '謝謝招待（吃飽後說）', req: [['ごちそうさま', 'ご馳走様', '御馳走様', 'ごちそうさん']] },
  ikura:         { ja: 'いくらですか', kana: 'いくらですか', romaji: 'ikura desu ka', zh: '多少錢？', req: [['いくら', '幾ら']] },
  kohii:         { ja: 'コーヒーをください', kana: 'こーひーをください', romaji: 'koohii o kudasai', zh: '請給我咖啡', req: [['コーヒー', '珈琲']], full: [KUDASAI] },
  matcha:        { ja: '抹茶ラテをください', kana: 'まっちゃらてをください', romaji: 'maccha rate o kudasai', zh: '請給我抹茶拿鐵', req: [['まっちゃ', '抹茶']], full: [['ラテ', 'らて', 'latte'], KUDASAI] },
  tennai:        { ja: '店内でお願いします', kana: 'てんないでおねがいします', romaji: 'tennai de onegai shimasu', zh: '內用', req: [['てんない', '店内', 'ここで']], full: [KUDASAI] },
  mochikaeri:    { ja: '持ち帰りでお願いします', kana: 'もちかえりでおねがいします', romaji: 'mochikaeri de onegai shimasu', zh: '外帶', req: [['もちかえり', '持ち帰り', '持ちかえり', 'テイクアウト']], full: [KUDASAI] },
  omizu:         { ja: 'お水をください', kana: 'おみずをください', romaji: 'omizu o kudasai', zh: '請給我水', req: [['みず', '水', 'おひや', 'お冷']], full: [KUDASAI] },
  konbanwa:      { ja: 'こんばんは', kana: 'こんばんは', romaji: 'konbanwa', zh: '晚安（晚上見面的招呼）', req: [['こんばんは', 'こんばんわ', '今晩は']] },
  takoyaki:      { ja: 'たこ焼きがいいです', kana: 'たこやきがいいです', romaji: 'takoyaki ga ii desu', zh: '我想吃章魚燒', req: [['たこやき', 'たこ焼き', '蛸焼き']], full: [GA_II] },
  yakisoba:      { ja: '焼きそばがいいです', kana: 'やきそばがいいです', romaji: 'yakisoba ga ii desu', zh: '我想吃炒麵', req: [['やきそば', '焼きそば', '焼そば']], full: [GA_II] },
  futatsu:       { ja: '二つください', kana: 'ふたつください', romaji: 'futatsu kudasai', zh: '請給我兩個', req: [['ふたつ', '二つ', '2つ']], full: [KUDASAI] },
  mata_kimasu:   { ja: 'はい、また来ます', kana: 'はい、またきます', romaji: 'hai, mata kimasu', zh: '會，我會再來', req: [['また', '又'], ['きます', '来ます', 'くる', '来る', 'きたい', '来たい']] },
  aitai:         { ja: 'また会いたいです', kana: 'またあいたいです', romaji: 'mata aitai desu', zh: '我想再見到你', req: [['あいたい', '会いたい', '逢いたい']] },
  motteinai:     { ja: '持っていないです', kana: 'もっていないです', romaji: 'motte inai desu', zh: '沒有', req: [['ない', 'ありません', 'いいえ', 'だいじょうぶ', '大丈夫']] },
  megusuri:      { ja: '目薬を探しています', kana: 'めぐすりをさがしています', romaji: 'megusuri o sagashite imasu', zh: '我在找眼藥水', req: [['めぐすり', '目薬']], full: [['さがして', '探して']] },
  hiyakedome:    { ja: '日焼け止めを探しています', kana: 'ひやけどめをさがしています', romaji: 'hiyakedome o sagashite imasu', zh: '我在找防曬乳', req: [['ひやけどめ', '日焼け止め', '日焼止め']], full: [['さがして', '探して']] },
  menzei:        { ja: '免税できますか', kana: 'めんぜいできますか', romaji: 'menzei dekimasu ka', zh: '可以免稅嗎？', req: [['めんぜい', '免税']], full: [['できます', '出来ます', 'できる', '出来る']] },
  hai_douzo:     { ja: 'はい、どうぞ', kana: 'はい、どうぞ', romaji: 'hai, douzo', zh: '好的，給你', req: [['どうぞ']] },
  nama:          { ja: '生ビールをください', kana: 'なまびーるをください', romaji: 'nama biiru o kudasai', zh: '請給我生啤酒', req: [['ビール', 'びーる']], full: [KUDASAI] },
  uuroncha:      { ja: 'ウーロン茶をください', kana: 'うーろんちゃをください', romaji: 'uuroncha o kudasai', zh: '請給我烏龍茶', req: [['ウーロン', '烏龍']], full: [KUDASAI] },
  osusume:       { ja: 'おすすめは何ですか', kana: 'おすすめはなんですか', romaji: 'osusume wa nan desu ka', zh: '推薦什麼？', req: [['おすすめ', 'お勧め', 'お薦め', 'お奨め']], full: [['なん', '何']] },
  sore_kudasai:  { ja: 'じゃあ、それをください', kana: 'じゃあ、それをください', romaji: 'jaa, sore o kudasai', zh: '那就給我那個', req: [['それ', 'やきとり', '焼き鳥', '焼鳥']], full: [KUDASAI] },
  taiwan_kara:   { ja: '台湾から来ました', kana: 'たいわんからきました', romaji: 'taiwan kara kimashita', zh: '我從台灣來', req: [['たいわん', '台湾']], full: [['から'], ['きました', '来ました', 'きた', '来た']] },
  kanpai:        { ja: '乾杯！', kana: 'かんぱい！', romaji: 'kanpai!', zh: '乾杯！', req: [['かんぱい', '乾杯']] },
};

// 遇到聽不懂時，在任何對話都能說的「萬用求救句」
export const META_REPEAT = 'mou_ichido';

// 養成數值（0～100）：開口說對、聽懂店員才會上升
export const STATS = {
  shop:   { name: '購物', emoji: '🛍️' },
  road:   { name: '問路', emoji: '🗺️' },
  food:   { name: '點餐', emoji: '🍜' },
  chat:   { name: '聊天', emoji: '💬' },
  listen: { name: '聽力', emoji: '👂' },
};

// 一天的三個時段
export const TIMES = [
  { key: 'am', name: '上午', emoji: '🌅' },
  { key: 'pm', name: '下午', emoji: '☀️' },
  { key: 'night', name: '晚上', emoji: '🌙' },
];

export const TRIP = { days: 3, money: 20000, stamina: 100, rest: 40 };

// QUESTS：可以排進行程的地點
//   times    開放的時段；cost 花費（日圓，結束時扣，end 節點可用 cost 覆蓋）；stamina 消耗體力
//   skill    說出口的句子算進哪個數值（cast 角色或 choice 也可以各自指定 skill）
//   requires 需要的旗標；nextDay 旗標要等到隔天才生效；once 整趟旅程只能去一次
// 節點：
//   narr     旁白（中文）
//   npc      NPC 台詞 { who, ja, kana, zh, concept, keys, alt, quiz }
//            concept 相同的台詞第二次出現時不顯示字幕，改成聽力題（「對方剛剛說的是？」）
//            keys  聽力關鍵詞 [['日文', '中文']]，顯示字幕時一起教
//            alt   聽力題的干擾選項（容易搞混的意思）；沒寫就從其他台詞隨機挑
//            quiz  一定要先聽懂才顯示字幕的題目 { q, options, answer }（例如價錢、路線）
//   choices  玩家回合 [{ zh, phrase, next, hint, flag, need, money, skill }]
//            need  數值不夠時鎖住這個選項，例如 { shop: 20 }；money 選了之後的金額變化
//   next     沒有玩家回合時，按「繼續」前往的節點
//   end      支線結束
export const QUESTS = [
  {
    id: 'konbini', times: ['am', 'pm', 'night'], cost: 780, stamina: 15, skill: 'shop', emoji: '🏪', title: '便利商店買早餐',
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
    id: 'michi', times: ['am', 'pm'], cost: 0, stamina: 25, skill: 'road', emoji: '🚉', title: '問路去車站',
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
    id: 'ramen', times: ['night'], cost: 1100, stamina: 25, skill: 'food', emoji: '🍜', title: '巷子裡的拉麵店',
    desc: '聽說附近有一家只有當地人才知道的拉麵店。晚餐就決定是它了。',
    bg: 'linear-gradient(160deg,#4a2e28,#9a4b32)',
    dark: true,
    cast: {
      master: { name: '老闆', emoji: '👨‍🍳', pitch: 0.8 },
      yui: { name: '結衣', emoji: '👩', pitch: 1.3, skill: 'chat' },
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
    id: 'cafe', times: ['am', 'pm'], cost: 550, stamina: 15, skill: 'food', emoji: '☕', title: '咖啡廳的早晨',
    desc: '找間咖啡廳坐一下，順便規劃接下來的行程。',
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
    id: 'omiyage', times: ['pm'], cost: 1200, stamina: 20, skill: 'shop', emoji: '🎁', title: '挑伴手禮',
    desc: '幫同事和家人買點伴手禮吧。',
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
      end_no: { end: true, cost: 0, narr: '你笑著點頭離開。會婉拒，也是很重要的能力！' },
    },
  },
  {
    id: 'matsuri', times: ['night'], cost: 1000, stamina: 30, skill: 'chat', once: true, nextDay: true, emoji: '🏮', title: '和結衣逛祭典',
    desc: '晚上七點，神社前。在拉麵店認識的結衣，真的會來嗎？',
    lockedDesc: '好像錯過了什麼邀請……（晚上去「巷子裡的拉麵店」看看）',
    requires: 'yui_yes',
    bg: 'linear-gradient(160deg,#232646,#5b2d63)',
    dark: true,
    cast: {
      yui: { name: '結衣', emoji: '👘', pitch: 1.3 },
      oji: { name: '攤販大叔', emoji: '👨', pitch: 0.8, skill: 'food' },
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
  {
    id: 'drugstore', times: ['pm'], cost: 5500, stamina: 25, skill: 'shop', emoji: '💊', title: '藥妝店大採購',
    desc: '想買眼藥水和防曬乳，可是架上的商品多到看不懂。',
    bg: 'linear-gradient(160deg,#e9f4ff,#bfe0f5)',
    cast: { staff: { name: '店員', emoji: '👩‍⚕️', pitch: 1.15 } },
    start: 's',
    nodes: {
      s:  { narr: '架上全是看不懂的包裝，問問店員吧。', choices: [{ zh: '不好意思（叫住店員）', phrase: 'sumimasen', hint: '叫住別人的萬用句', next: 'n2' }] },
      n2: { npc: { who: 'staff', ja: 'はい、何かお探しですか？', kana: 'はい、なにかおさがしですか？', zh: '是，在找什麼嗎？', concept: 'osagashi',
                   keys: [['何か', '什麼'], ['お探しですか', '在找嗎']], alt: ['需要袋子嗎？', '請問要怎麼付款？'] },
            choices: [
              { zh: '我在找眼藥水', phrase: 'megusuri', hint: '商品名稱＋「を探しています」', next: 'n3' },
              { zh: '我在找防曬乳', phrase: 'hiyakedome', hint: '商品名稱＋「を探しています」', next: 'n3' }] },
      n3: { npc: { who: 'staff', ja: 'それでしたら、こちらにございます。', kana: 'それでしたら、こちらにございます。', zh: '那個的話，在這邊。', concept: 'gozaimasu',
                   keys: [['こちら', '這邊'], ['ございます', '有／在（很客氣的說法）']], alt: ['那個已經賣完了。', '請稍等一下。'] }, next: 'n4' },
      n4: { narr: '你又順手拿了面膜和零食，走到收銀台。', next: 'n5' },
      n5: { npc: { who: 'staff', ja: '全部で五千五百円です。', kana: 'ぜんぶでごせんごひゃくえんです。', zh: '全部一共五千五百日圓。', concept: 'gosen',
                   keys: [['全部で', '全部一共'], ['五千五百円', '5500 日圓']],
                   quiz: { q: '一共多少錢？', options: ['5500 日圓', '5050 日圓', '550 日圓'], answer: 0 } },
            choices: [
              { zh: '可以免稅嗎？', phrase: 'menzei', need: { shop: 20 }, hint: '「免稅」＋「可以嗎」', next: 'n6' },
              { zh: '刷卡', phrase: 'card', hint: '「卡」的日文就是英文 card', next: 'n8' }] },
      n6: { npc: { who: 'staff', ja: '免税ですね。パスポートをお願いします。', kana: 'めんぜいですね。ぱすぽーとをおねがいします。', zh: '免稅對吧。請給我護照。', concept: 'passport',
                   keys: [['パスポート', '護照']], alt: ['請出示集點卡。', '請在這裡簽名。'] },
            choices: [{ zh: '（遞出護照）好的，給你', phrase: 'hai_douzo', hint: '「是」＋「請（拿去）」', money: 500, next: 'n7' }] },
      n7: { npc: { who: 'staff', ja: '免税で、五千円になります。', kana: 'めんぜいで、ごせんえんになります。', zh: '免稅後是五千日圓。', concept: 'menzei_price',
                   keys: [['免税で', '免稅後'], ['五千円', '5000 日圓']],
                   quiz: { q: '免稅後多少錢？', options: ['5000 日圓', '5500 日圓', '4500 日圓'], answer: 0 } },
            choices: [{ zh: '刷卡', phrase: 'card', hint: '「卡」的日文就是英文 card', next: 'n8' }] },
      n8: { npc: { who: 'staff', ja: 'ありがとうございました！', kana: 'ありがとうございました', zh: '謝謝光臨！', concept: 'arigatou_shop',
                   keys: [['ありがとうございました', '謝謝光臨（結帳後店員說的）']], alt: ['歡迎光臨！', '請稍等一下。'] },
            choices: [{ zh: '謝謝', phrase: 'arigatou', next: 'end' }] },
      end: { end: true, narr: '提著一大袋戰利品走出藥妝店。購物越熟練，越能發現省錢的小技巧。' },
    },
  },
  {
    id: 'izakaya', times: ['night'], cost: 3000, stamina: 30, skill: 'food', emoji: '🏮', title: '熱鬧的居酒屋',
    desc: '紅燈籠下的小居酒屋，聽說常有當地上班族來喝一杯。',
    bg: 'linear-gradient(160deg,#3b1f1a,#a3402c)',
    dark: true,
    cast: {
      staff: { name: '店員', emoji: '🧑‍🍳', pitch: 1.05 },
      oji: { name: '隔壁的大叔', emoji: '🧔', pitch: 0.8, skill: 'chat' },
    },
    start: 's',
    nodes: {
      s:  { narr: '拉開店門，店裡很熱鬧。', next: 'n1' },
      n1: { npc: { who: 'staff', ja: 'いらっしゃいませ！ 何名様ですか？', kana: 'いらっしゃいませ！ なんめいさまですか？', zh: '歡迎光臨！請問幾位？', concept: 'nanmei',
                   keys: [['何名様', '幾位客人']], alt: ['要點什麼？', '要內用嗎？'] },
            choices: [{ zh: '一個人', phrase: 'hitori', hint: '「一個人」＋「です」', next: 'n2' }] },
      n2: { npc: { who: 'staff', ja: 'お飲み物は何になさいますか？', kana: 'おのみものはなにになさいますか？', zh: '飲料要點什麼呢？', concept: 'onomimono',
                   keys: [['お飲み物', '飲料'], ['何になさいますか', '要點什麼（敬語）']], alt: ['請問幾位？', '要結帳了嗎？'] },
            choices: [
              { zh: '生啤酒', phrase: 'nama', hint: '飲料名稱＋「をください」', next: 'n3' },
              { zh: '烏龍茶', phrase: 'uuroncha', hint: '飲料名稱＋「をください」', next: 'n3' }] },
      n3: { narr: '菜單上全是漢字，看不太懂。', choices: [{ zh: '請問推薦什麼？', phrase: 'osusume', hint: '「推薦」＋「是什麼」', next: 'n4' }] },
      n4: { npc: { who: 'staff', ja: '今日は焼き鳥がおすすめです。', kana: 'きょうはやきとりがおすすめです。', zh: '今天推薦烤雞肉串。', concept: 'kyou_osusume',
                   keys: [['今日は', '今天'], ['焼き鳥', '烤雞肉串'], ['おすすめ', '推薦']],
                   quiz: { q: '店員推薦什麼？', options: ['烤雞肉串', '生魚片', '炸雞'], answer: 0 } },
            choices: [{ zh: '那就給我那個', phrase: 'sore_kudasai', hint: '「那個」＋「請給我」', next: 'n5' }] },
      n5: { narr: '隔壁的大叔笑著舉起酒杯。', next: 'n6' },
      n6: { npc: { who: 'oji', ja: 'ねえ、どこから来たの？', kana: 'ねえ、どこからきたの？', zh: '欸，你從哪裡來的？', concept: 'dokokara',
                   keys: [['どこから', '從哪裡'], ['来たの', '來的（口語）']], alt: ['你住在哪裡？', '你一個人嗎？'] },
            choices: [{ zh: '我從台灣來', phrase: 'taiwan_kara', hint: '「台灣」＋「從」＋「來了」', next: 'n7' }] },
      n7: { npc: { who: 'oji', ja: 'おお、台湾か！ 乾杯しよう！', kana: 'おお、たいわんか！ かんぱいしよう！', zh: '喔，台灣啊！來乾杯吧！', concept: 'kanpai_invite',
                   keys: [['乾杯しよう', '來乾杯吧']], alt: ['台灣很熱吧！', '下次再見！'] },
            choices: [{ zh: '乾杯！', phrase: 'kanpai', hint: '中文也這樣說', next: 'n8' }] },
      n8: { narr: '聊著聊著，時間不早了。', choices: [{ zh: '麻煩結帳', phrase: 'okaikei', hint: '「會計」＋「麻煩了」', next: 'n9' }] },
      n9: { npc: { who: 'staff', ja: '三千円になります。', kana: 'さんぜんえんになります。', zh: '這樣是三千日圓。', concept: 'sanzen',
                   keys: [['三千円', '3000 日圓']],
                   quiz: { q: '多少錢？', options: ['3000 日圓', '300 日圓', '3300 日圓'], answer: 0 } },
            choices: [{ zh: '謝謝招待', phrase: 'gochisousama', hint: '吃完飯一定要說的一句', next: 'end' }] },
      end: { end: true, narr: '走出居酒屋，已經很晚了……末班車還有嗎？' },
    },
  },
];

// EVENTS：在早上出門前、或晚上回旅館時觸發，結果看數值
//   at      'morning'（新的一天開始）或 'night'（這一天結束）
//   day     哪一天（不寫代表每天都可能）；after 今天去過哪個地點；requires 需要的旗標或去過的地點
//   need    數值門檻，全部達到算成功
//   success / fail  { text, money, stamina, flag, stats }
export const EVENTS = [
  {
    id: 'delay', at: 'morning', day: 2, emoji: '🚃', title: '電車誤點',
    story: '早上在車站，廣播一直重複同一段話，大家開始往另一個月台走……',
    ja: 'ただいま、電車が遅れております。', zh: '目前電車延誤中。', keys: [['遅れております', '延誤中']],
    need: { listen: 10 },
    success: { text: '你聽出「遅れております」是延誤的意思，跟著大家改搭別的線，沒有耽誤時間。', stats: { listen: 3 } },
    fail: { text: '你聽不懂廣播，在月台傻等了 30 分鐘才發現電車延誤。好累……', stamina: -25 },
  },
  {
    id: 'lasttrain', at: 'night', after: 'izakaya', emoji: '🌃', title: '末班車',
    story: '從居酒屋出來已經快十二點。車站的廣播在說什麼？',
    ja: 'まもなく、最終電車が発車します。', zh: '最後一班電車即將發車。', keys: [['最終電車', '末班車'], ['発車します', '要開了']],
    need: { listen: 25, road: 15 },
    success: { text: '你聽懂「最終電車」，問了站務員「〇〇駅はどこですか」，跑著趕上了末班車！', stats: { road: 3 } },
    fail: { text: '等你搞懂廣播的意思，末班車已經開走了。只好搭計程車回旅館。', money: -6000 },
  },
  {
    id: 'yui_line', at: 'morning', day: 3, requires: 'matsuri', emoji: '📱', title: '結衣傳來訊息',
    story: '早上手機響了，是結衣傳來的 LINE。',
    ja: '昨日は楽しかったね！ また連絡してね。', zh: '昨天好開心喔！要再跟我聯絡喔。', keys: [['楽しかった', '很開心'], ['連絡してね', '要聯絡喔']],
    need: { chat: 25 },
    success: { text: '你看懂了，回她「わたしも楽しかったです！」。你們約好下次你來日本時再見面。', flag: 'yui_friend', stats: { chat: 5 } },
    fail: { text: '訊息看不太懂，你只回了一個貼圖。好像有點可惜……' },
  },
];

// ENDINGS：最後一天結束時，由上往下找第一個符合的結局
//   s 是存檔：s.stats、s.money、s.done（去過的地點）、s.flags
export const ENDINGS = [
  { id: 'perfect', emoji: '🌸', title: '完美旅程', text: '購物、問路、點餐、聊天、聽力樣樣都行。下次來日本，你已經不需要旅遊書了。',
    when: s => Object.values(s.stats).every(v => v >= 25) },
  { id: 'friend', emoji: '🎎', title: '交到日本朋友', text: '旅程最珍貴的不是景點，而是結衣。你們約好了，下次見面要用更流利的日文聊天。',
    when: s => s.flags.yui_friend || (s.done.includes('matsuri') && s.stats.chat >= 30) },
  { id: 'gourmet', emoji: '🍜', title: '美食達人', text: '拉麵、居酒屋、咖啡廳，你都能自在地點餐，還會問「おすすめは何ですか」。',
    when: s => s.stats.food >= 40 },
  { id: 'shopper', emoji: '🛍️', title: '購物達人', text: '你不只買得到想要的東西，還懂得免稅省錢，回國時錢包還有餘裕。',
    when: s => s.stats.shop >= 40 && s.money >= 8000 },
  { id: 'explorer', emoji: '🚃', title: '一個人走遍日本', text: '聽得懂廣播、問得到路，你已經可以一個人在日本自由移動了。',
    when: s => s.stats.road >= 20 && s.stats.listen >= 35 },
  { id: 'lost', emoji: '😵', title: '迷路大王', text: '這趟旅程你一次路都沒問過……但迷路也是旅行的一部分。下次記得說「すみません」！',
    when: s => s.stats.road < 5 },
  { id: 'normal', emoji: '✈️', title: '平凡又美好的旅程', text: '雖然還說得不太流利，但你用自己的日文，完成了第一次的日本旅行。',
    when: () => true },
];
