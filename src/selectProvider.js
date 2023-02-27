const { limpiarDatosMapa1, sendCity } = require("./main");
const { limpiarDatosMapa2, sendCity2 } = require("./main2");

const radioButtons = document.querySelectorAll('input[type="radio"]');

radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", function () {
    radioButtons.forEach((button) => {
      if (button.checked) {
        selectedMapProvider = button.value;
        if (
          document.getElementById("city1").value &&
          document.getElementById("city2").value
        ) {
          limpiarDatosMapa2();
          limpiarDatosMapa1();
          sendCity(document.getElementById("city1").value);
          sendCity2(document.getElementById("city2").value);
        }
      }
    });
  });
});
