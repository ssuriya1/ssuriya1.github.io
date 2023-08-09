document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const nameAnimationContainer = document.getElementById("name-animation-container");
const portfolioContent = document.getElementById("portfolio-content");

setTimeout(() => {
  nameAnimationContainer.style.opacity = 0;
  setTimeout(() => {
    nameAnimationContainer.style.display = "none";
    portfolioContent.style.opacity = 1;
  }, 1000);
}, 3000);
