const popmotion = require("popmotion");
const ball = document.querySelector(".ball");

function animate() {
  return popmotion.animate({
    from: "40px",
    to: "440px",
    repeat: Infinity,
    repeatType: "mirror",
    type: "spring",
    onUpdate(update) {
      ball.style.left = update;
    },
  });
}

module.exports = animate;
