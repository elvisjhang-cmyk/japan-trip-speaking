# 圖片放這裡

照下面的檔名存進這個資料夾，遊戲會自動顯示；沒有放的就維持 emoji 和漸層背景。
放好之後重新整理網頁就看得到（不用改程式）。

## 角色立繪（PNG，要去背）

檔名是「角色名_表情.png」。表情有 `normal`（一般）、`smile`（笑）、`shy`（害羞）、`surprised`（驚訝）、`confused`（疑惑）。
**每個角色一定要有 `_normal.png`**（遊戲先找這張，有才會再找其他表情）；其他表情沒放的話，會先用 `normal` 代替。

| 角色 | 檔名開頭 | 例子 |
|---|---|---|
| 結衣（便服） | `yui` | `yui_normal.png`、`yui_smile.png` |
| 結衣（浴衣，祭典） | `yui_yukata` | `yui_yukata.png`、`yui_yukata_shy.png` |
| 便利商店店員 | `npc_konbini` | `npc_konbini_normal.png` |
| 問路的阿姨 | `npc_obasan` | |
| 拉麵店老闆 | `npc_ramen` | |
| 咖啡廳店員 | `npc_cafe` | |
| 伴手禮店店員 | `npc_omiyage` | |
| 藥妝店店員 | `npc_drugstore` | |
| 居酒屋店員 | `npc_izakaya` | |
| 居酒屋隔壁的大叔 | `npc_salaryman` | |
| 祭典攤販大叔 | `npc_yatai` | |

## 背景（JPG / PNG / WEBP，橫的 16:9，不要有人物）

| 地點 | 檔名 |
|---|---|
| 拉麵店 | `bg_ramen.jpg` |
| 神社祭典 | `bg_matsuri.jpg` |
| 咖啡廳（一般和結衣約會共用） | `bg_cafe.jpg` |
| 居酒屋（一般和結衣約會共用） | `bg_izakaya.jpg` |
| 車站（告別） | `bg_station.jpg` |
| 便利商店 | `bg_konbini.jpg` |
| 問路（街道） | `bg_michi.jpg` |
| 伴手禮店 | `bg_omiyage.jpg` |
| 藥妝店 | `bg_drugstore.jpg` |

## 事件大圖（JPG / PNG，橫的 16:9；也可以放同名的 MP4 動態）

| 場景 | 檔名 |
|---|---|
| 祭典看煙火 | `cg_fireworks.jpg`（動態：`cg_fireworks.mp4`） |
| 車站告別 | `cg_farewell.jpg`（動態：`cg_farewell.mp4`） |

MP4 會自動靜音循環播放，同名的 JPG 會在影片載入前先顯示。
影片建議 3～5 秒、720p、每段 3MB 以內。
