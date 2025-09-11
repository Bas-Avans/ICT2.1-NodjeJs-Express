document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute("data-bs-theme", theme);
    themeIcon.className =
      theme === "dark" ? "bi bi-moon-fill" : "bi bi-sun-fill";
    localStorage.setItem("theme", theme);
  }

  themeToggle.addEventListener("click", function () {
    const currentTheme = html.getAttribute("data-bs-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) setTheme(savedTheme);
});
