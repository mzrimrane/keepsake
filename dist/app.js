const templates = {
  year: { recipient: "Elena & Sam", occasion: "A year of little magic", message: "You are my favorite place to be. Here’s to all the ordinary days that became our best ones.", accent: "coral", song: "" },
  note: { recipient: "Someone wonderful", occasion: "Open when you need a smile", message: "A tiny reminder that you are loved in all the loud moments and all the quiet ones.", accent: "teal", song: "" },
  birthday: { recipient: "Your favorite person", occasion: "27 things I love about you", message: "The list could be much longer, but this is a lovely place to start.", accent: "yellow", song: "" }
};

const form = document.querySelector("#gift-form");
const recipient = document.querySelector("#recipient");
const occasion = document.querySelector("#occasion");
const message = document.querySelector("#message");
const accent = document.querySelector("#accent");
const song = document.querySelector("#song");
const photos = document.querySelector("#photos");
const preview = document.querySelector("#live-preview");
const toast = document.querySelector("#toast");

const accentColors = { coral: ["#f2c1b0", "#ed856e"], violet: ["#d2c9f4", "#8b7bd4"], teal: ["#b7e0d6", "#62afa5"], yellow: ["#f8e7a6", "#ddb84f"] };

function showToast(text) { toast.textContent = text; toast.classList.add("show"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600); }
function updatePreview() {
  document.querySelector("#preview-recipient").textContent = recipient.value || "Someone wonderful";
  document.querySelector("#preview-occasion").textContent = occasion.value || "A tiny celebration";
  document.querySelector("#preview-message").textContent = message.value || "Write a little note for someone you love.";
  document.querySelector("#preview-song").textContent = song.value ? `♫ ${song.value}` : "♫ add a song to make it yours";
  const [from, to] = accentColors[accent.value] || accentColors.coral;
  document.querySelector("#preview-photo").style.background = `linear-gradient(140deg, ${from}, ${to})`;
  localStorage.setItem("keepsake-draft", JSON.stringify({ recipient: recipient.value, occasion: occasion.value, message: message.value, accent: accent.value, song: song.value }));
}
function loadDraft() {
  try { const draft = JSON.parse(localStorage.getItem("keepsake-draft")); if (!draft) return; Object.entries(draft).forEach(([key, value]) => { const el = document.querySelector(`#${key}`); if (el && value) el.value = value; }); } catch { /* an old draft is harmless */ }
  updatePreview();
}
function applyTemplate(key) { const template = templates[key]; if (!template) return; Object.entries(template).forEach(([field, value]) => { const el = document.querySelector(`#${field}`); if (el) el.value = value; }); updatePreview(); document.querySelector("#studio").scrollIntoView({ behavior: "smooth" }); showToast("Template loaded — make it yours ✦"); }
function buildShareLink() { const state = { recipient: recipient.value, occasion: occasion.value, message: message.value, accent: accent.value, song: song.value }; const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state)))); return `${window.location.origin}${window.location.pathname}#gift=${encoded}`; }

[recipient, occasion, message, accent, song].forEach((element) => element.addEventListener("input", updatePreview));
document.querySelectorAll(".template-card").forEach((card) => card.addEventListener("click", (event) => { if (event.target.closest("button")) applyTemplate(card.dataset.template); }));
document.querySelector("#save-draft").addEventListener("click", () => { updatePreview(); showToast("Draft saved on this device ✦"); });
photos.addEventListener("change", () => { const file = photos.files[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { document.querySelector("#preview-photo").style.backgroundImage = `url(${reader.result})`; document.querySelector("#preview-photo").style.backgroundSize = "cover"; document.querySelector("#preview-photo").style.backgroundPosition = "center"; document.querySelector("#preview-photo").querySelector("small").textContent = `${photos.files.length} photo${photos.files.length === 1 ? "" : "s"} added`; showToast("Photo added to your preview ✦"); }); reader.readAsDataURL(file); });
form.addEventListener("submit", (event) => { event.preventDefault(); updatePreview(); const link = buildShareLink(); navigator.clipboard?.writeText(link).catch(() => {}); showToast("Preview link copied — send a little joy ✦"); });
document.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => { document.querySelector(link.getAttribute("href"))?.focus({ preventScroll: true }); }));
loadDraft();
