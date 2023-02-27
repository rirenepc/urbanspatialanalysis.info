const { linear } = require("popmotion");
const { sendCity } = require("./main");
const { sendCity2 } = require("./main2");

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((el) =>
  el.addEventListener("click", (event) => {
    if (
      document.getElementById("city1").value == "" ||
      document.getElementById("city2").value == ""
    ) {
      alert("Please, enter two different cities.");
    } else {
      document.querySelector("nav li.active").classList.remove("active");
      event.currentTarget.classList.add("active");

      console.log(event.currentTarget.id);
      facility = event.currentTarget.id;
      const city1 = document.getElementById("city1").value;
      sendCity(city1, event.currentTarget.id);

      console.log(event.currentTarget.id);
      const city2 = document.getElementById("city2").value;
      sendCity2(city2, event.currentTarget.id);
    }
  })
);
