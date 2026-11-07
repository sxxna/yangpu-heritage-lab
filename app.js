"use strict";

const get = (id) => document.getElementById(id);
const tabs = [...document.querySelectorAll('[role="tab"]')];
function openPanel(id, focus = false) {
  for (const tab of tabs) {
    const selected = tab.dataset.panel === id;
    tab.setAttribute("aria-selected", selected);
    tab.tabIndex = selected ? 0 : -1;
    get(tab.dataset.panel).hidden = !selected;
    if (selected && focus) tab.focus();
  }
}
for (const tab of tabs) {
  tab.addEventListener("click", () => openPanel(tab.dataset.panel));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs.at(-1) : tabs.find((item) => item !== tab);
    openPanel(target.dataset.panel, true);
  });
}
document.querySelector("[data-open]").addEventListener("click", () => openPanel("two", true));

const example = "画一幅上海地标剪纸风格图，再为它写一句介绍。";
const chatExample = "画一幅红色上海地标建筑剪纸，保留建筑轮廓、镂空窗户和江面波纹。";
const revision = "请加宽塔底和底部两侧的连接，让剪纸更结实。";
function fill(input, prompt) {
  input.value = prompt;
  input.focus();
}
get("first-example").addEventListener("click", () => fill(get("first-prompt"), example));

function artworkOptions(prompt, existing = { scene: "skyline", color: "#aa2b27", width: 3 }) {
  const scene = /杨浦大桥|南浦大桥|大桥|桥梁/.test(prompt) ? "bridge" : /外滩|钟楼/.test(prompt) ? "bund" : /东方明珠|上海地标/.test(prompt) ? "skyline" : existing.scene;
  const color = /蓝色|靛蓝/.test(prompt) ? "#294d78" : /金色|金黄/.test(prompt) ? "#92551d" : /红色|朱红/.test(prompt) ? "#aa2b27" : existing.color;
  return { scene, color, width: existing.width };
}

function drawArt({ scene, color, width }, mark = false) {
  const buildings = [[76,151,34,109],[116,177,35,83],[155,193,32,67],[193,205,27,55],[396,196,33,64],[432,173,34,87],[470,149,38,111],[511,183,35,77],[550,203,32,57]];
  const blocks = buildings.map(([x,y,w,h]) => {
    const windows = Array.from({length:Math.floor((h-12)/14)}, (_, i) =>
      `M${x+7} ${y+13+i*14}h${w-14}`).join(" ");
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}"/><path d="${windows}" fill="none" stroke="#fbedd1" stroke-width="4"/>`;
  }).join("");
  const landmarks = {
    skyline: '<path d="M261 241h118l-31-26-10-104h-29l-10 104zM319 45h8v40h-8z"/><circle cx="323" cy="91" r="13"/><circle cx="323" cy="126" r="26"/><circle cx="323" cy="202" r="34"/><path d="M304 123h38m-43 8h48m-55 67h62m-58 10h53" fill="none" stroke="#fbedd1" stroke-width="4"/>',
    bridge: '<path d="M227 240h193v-10H227zM275 240h13V89h-13zM357 240h13V89h-13z"/><path d="M281 99L231 231m50-103-38 103m38-75-25 75m25-47-14 47m14-132 40 131m-40-96 30 96m-30-60 18 60m65-131-40 131m40-96-30 96m30-60-18 60m18-131 52 131m-52-98 40 98m-40-70 28 70m-28-42 16 42" fill="none" stroke="currentColor" stroke-width="3"/>',
    bund: '<path d="M234 241v-59h41v-22h24v-47h12V89l12-19 13 19v24h12v47h24v22h40v59z"/><circle cx="323" cy="140" r="13" fill="#fbedd1"/><path d="M323 131v10h6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M251 198v20m17-20v20m21-30v30m17-30v30m17-30v30m17-30v30m17-30v30m19-20v20m17-20v20" stroke="#fbedd1" stroke-width="6"/>'
  };
  const points = [205,323,451];
  const links = points.map((x,i) => {
    const y = i === 1 ? 235 : 255;
    return `<path d="M${x} ${y}v${271-y}" stroke="currentColor" stroke-width="${width}" stroke-linecap="square"/>`;
  }).join("");
  const markers = mark ? points.map((x,i) => `<circle cx="${x}" cy="${i === 1 ? 257 : 265}" r="16" fill="none" stroke="#704e18" stroke-width="2" stroke-dasharray="4 3"/>`).join("") : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" class="art" role="img" aria-label="上海建筑剪纸${mark ? "，圆圈标出需要检查的连接" : ""}" viewBox="0 0 650 365" color="${color}">
  <rect width="650" height="365" rx="9" fill="#fbedd1"/>
  <g fill="none" stroke="currentColor">
    <rect x="15" y="15" width="620" height="335" rx="21" stroke-width="6"/>
    <rect x="25" y="25" width="600" height="315" rx="15" stroke-width="1.5"/>
    <path stroke-width="4" stroke-linecap="round" d="M55 98c18 0 28-4 33-15 4-12 24-14 30-1 3 7 7 10 17 10h42M438 105c16 0 21-5 24-11 7-15 26-16 32-3 4 9 16 13 25 13h48M111 119h64m287 2h58"/>
    <path stroke-width="6" d="M16 280c55 6 82-21 142-17s85 24 146 12 94-21 154-7 104 19 177 4M23 313c68 5 97-19 160-13s91 21 144 9 81-21 139-10 113 12 163 4"/>
    <path stroke-width="2.5" d="M61 291q54-15 106-10m36 8q45 15 95 4m51-1q51-18 101-9m28 10q45 8 83 3M69 324q58-15 113-9m77 13q52-4 100-15m91 8q45 8 110-5"/>
  </g>
  <g fill="currentColor">${blocks}${landmarks[scene]}${links}</g>${markers}
  </svg>`;
}

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}
function empty(title, message, busy = false) {
  const view = element("div", "", busy ? "empty waiting" : "empty");
  const icon = element("span", "", "frame-icon");
  icon.setAttribute("aria-hidden", "true");
  view.append(icon, element("strong", title), element("span", message));
  return view;
}
function showArtwork(container, design, marked = false) {
  container.innerHTML = drawArt(design, marked);
}
const introductions = {
  skyline: "红纸上的东方明珠和外滩隔江相望，黄浦江的波纹把两岸连在一起。",
  bridge: "桥塔挑起斜拉索，江面的波纹把桥与两岸连在一张剪纸里。",
  bund: "钟楼与成排的镂空窗户勾勒出外滩，江水在建筑脚下缓缓流过。"
};
const pause = () => new Promise((resolve) => setTimeout(resolve, 550));
get("first-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = get("first-prompt").value.trim();
  if (!prompt) return get("first-prompt").focus();
  const button = event.currentTarget.querySelector(".primary");
  if (button.disabled) return;
  button.disabled = true;
  const result = get("first-result");
  result.replaceChildren(empty("正在制作剪纸图", "正在根据课堂示例匹配图样。", true));
  await pause();
  const design = artworkOptions(prompt);
  const original = design.scene === "skyline" && design.color === "#aa2b27";
  const grid = element("div", "", "result-grid");
  const visual = element("div");
  if (original) {
    const image = element("img");
    image.src = "assets/shanghai.jpg";
    image.alt = "红色上海地标剪纸，东方明珠和外滩隔江相望";
    visual.append(image);
  } else {
    showArtwork(visual, design);
  }
  const caption = element("div");
  const intro = introductions[design.scene].replace("红纸", design.color === "#294d78" ? "蓝纸" : design.color === "#92551d" ? "金色纸" : "红纸");
  caption.append(element("h3", "作品介绍"), element("p", intro));
  grid.append(visual, caption);
  result.replaceChildren(grid);
  button.disabled = false;
});

let draft, current, stage = 0, busy = false, checked = false, comparing = false, revisionRun = 0, downloadUrl;
const chatInput = get("chat-prompt");
const chatResult = get("chat-result");
const chatExampleButton = get("chat-example");
const chatSend = get("chat-form").querySelector(".primary");
get("chat-example").addEventListener("click", () => fill(chatInput, stage ? revision : chatExample));
function addMessage(author, content, user = false) {
  const message = element("p", "", user ? "user" : "assistant");
  message.append(element("strong", author), document.createTextNode(content));
  const chat = get("chat-log");
  chat.append(message);
  chat.scrollTop = chat.scrollHeight;
}
function setStage(next) {
  stage = next;
  document.querySelectorAll(".steps li").forEach((step, i) => {
    if (i === stage) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
  chatExampleButton.textContent = stage ? "填入修改示例" : "填入首轮示例";
}
function showChatArt() {
  const design = comparing ? draft : current;
  get("chat-title").textContent = comparing ? "初稿 · AI 参考图" : stage === 2 ? "修改稿 · 完整作品" : "AI 参考图";
  showArtwork(chatResult, design, checked);
  const tip = checked
    ? (design.width >= 9 ? "圈出的三个连接已加宽，通过本练习的连接检查。" : "圈出的三个连接仍较细。试着发送“请加宽连接”。")
    : (comparing ? "这是首轮生成的参考图。" : "点击“检查连接”，查看塔底和两侧的连接。");
  chatResult.append(element("p", tip));
  get("inspect").textContent = checked ? "隐藏标记" : "检查连接";
  get("compare").textContent = comparing ? "看修改稿" : "看初稿";
  get("compare").hidden = stage !== 2;
  get("download").hidden = stage !== 2;
  get("result-actions").hidden = false;
}

get("chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt || busy) return;
  const run = ++revisionRun;
  busy = true;
  chatSend.disabled = true;
  addMessage("你", prompt, true);
  chatInput.value = "";
  chatResult.replaceChildren(empty(current ? "正在调整参考图" : "正在制作参考图", "请稍候。", true));
  get("result-actions").hidden = true;
  await pause();
  if (run !== revisionRun) return;
  if (!draft) {
    draft = artworkOptions(prompt);
    current = draft;
    setStage(1);
    addMessage("工坊助手", "参考图已完成。先检查建筑和底纸之间有没有细弱的连接。");
  } else {
    current = artworkOptions(prompt, current);
    if (/加宽|加粗|更粗|加强|加固|结实|牢固|拓宽|增宽/.test(prompt) && !/不要加宽|不用加宽|无需加宽/.test(prompt)) {
      current.width = 11;
      setStage(2);
      addMessage("工坊助手", "已加宽连接。再次检查，或者对照初稿看看哪里变了。");
    } else {
      addMessage("工坊助手", "已检查这轮要求。可以调整地标或颜色，完成连接练习时请写明哪里需要加宽。");
    }
  }
  comparing = checked = false;
  showChatArt();
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  if (stage === 2) {
    downloadUrl = URL.createObjectURL(new Blob([drawArt(current)], {type:"image/svg+xml;charset=utf-8"}));
    get("download").href = downloadUrl;
  }
  busy = false;
  chatSend.disabled = false;
});
get("inspect").addEventListener("click", () => {
  checked = !checked;
  showChatArt();
});
get("compare").addEventListener("click", () => {
  comparing = !comparing;
  showChatArt();
});
get("reset").addEventListener("click", () => {
  revisionRun++;
  busy = checked = comparing = false;
  draft = current = undefined;
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = undefined;
  chatInput.value = "";
  chatSend.disabled = false;
  get("chat-log").replaceChildren();
  get("chat-title").textContent = "AI 参考图";
  chatResult.replaceChildren(empty("等待第一张参考图", "在对话框里描述你的剪纸构思。"));
  get("result-actions").hidden = true;
  setStage(0);
  chatInput.focus();
});
