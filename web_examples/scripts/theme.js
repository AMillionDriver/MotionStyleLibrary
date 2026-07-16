const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("axoloth-docs-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("axoloth-docs-theme", nextTheme);
  applyTheme(nextTheme);
});
