const header = document.getElementById("header");
header.addEventListener("click", () => {
  header.innerText = `Hello,  ${name} ${surname}`;
});