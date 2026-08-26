const TOTAL = 9;
let current = 1;

function dots() {
  const d = document.getElementById("dots");
  if (!d) return;
  d.innerHTML = "";

  for (let i = 1; i <= TOTAL; i++) {
    const x = document.createElement("span");
    x.className = i === current ? "active" : "";
    d.appendChild(x);
  }
}

function go(n) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  const target = document.querySelector(`[data-s="${n}"]`);
  if (target) target.classList.add("active");

  current = n;
  dots();
}

function gift(n) {
  const messages = {
    1: "A little Rakhi happiness is coming your way ❤️",
    2: "You deserve the Best Sister Award 🏅",
    3: "Okay fine... the REAL surprise starts now ✨"
  };

  const hint = document.getElementById("hint");
  if (hint) hint.textContent = messages[n] || "";

  if (n === 3) {
    setTimeout(() => go(5), 850);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  dots();
});
