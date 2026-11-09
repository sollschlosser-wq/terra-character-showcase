const hero = document.querySelector(".hero");
const motion = document.querySelector("#motion");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let paused = reducedMotion.matches;

function updateMotion() {
  hero.classList.toggle("is-paused", paused);
  motion.setAttribute("aria-pressed", String(paused));
  motion.textContent = paused ? "播放封面动效" : "暂停封面动效";
}

motion.addEventListener("click", () => {
  paused = !paused;
  hero.classList.toggle("motion-opt-in", !paused);
  updateMotion();
});

reducedMotion.addEventListener("change", () => {
  paused = reducedMotion.matches;
  hero.classList.remove("motion-opt-in");
  updateMotion();
});

updateMotion();

const plate = document.querySelector(".design-plate");
const plateImage = plate.querySelector("img");
const caption = document.querySelector("#plate-caption");
const options = document.querySelectorAll(".design-options button");
const details = {
  full: { caption: "01 / 全身造型", alt: "苔芽造型全览" },
  hood: { caption: "02 / 双叶与种壳帽", alt: "苔芽头顶的双叶和绿色种壳帽特写" },
  bag: { caption: "03 / 围巾与挎包", alt: "苔芽的橙色围巾和棕色挎包特写" }
};

for (const option of options) {
  option.addEventListener("click", () => {
    const detail = option.dataset.detail;
    plate.dataset.detail = detail;
    plateImage.alt = details[detail].alt;
    caption.textContent = details[detail].caption;
    for (const button of options) button.setAttribute("aria-pressed", String(button === option));
  });
}

const media = [...document.querySelectorAll("video, audio")];
for (const player of media) {
  player.addEventListener("play", () => {
    for (const other of media) {
      if (other !== player) other.pause();
    }
  });
}

const links = [...document.querySelectorAll("nav a")];
const chapters = links.map(link => document.querySelector(link.hash));
const header = document.querySelector(".site-head");
let pending = false;

function highlightChapter() {
  const offset = header.offsetHeight + 50;
  const current = chapters.findLast(chapter => chapter.getBoundingClientRect().top <= offset) ?? chapters[0];
  for (const link of links) {
    if (link.hash === `#${current.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  pending = false;
}

function queueHighlight() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(highlightChapter);
}

window.addEventListener("scroll", queueHighlight, { passive: true });
window.addEventListener("resize", queueHighlight);
queueHighlight();
