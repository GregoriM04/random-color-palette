const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const colorContainer = document.querySelectorAll(".color-container");
const colorName = document.querySelectorAll(".color-name");

// set new color palette after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setColors();
});

// set new color palette when 'spacebar' is pressed
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    setColors();
  }
});

// header buttons
generateBtn.addEventListener("click", setColors);

// Function to set colors
function setColors() {
  colorContainer.forEach((el) => {
    let newColor = getColor();
    let textColor = setContrast(hexToRgb(newColor));
    el.children[1].style.color = textColor;
    el.children[0].style.color = textColor;
    el.children[1].innerText = newColor;
    el.style.backgroundColor = newColor;
  });
  return 0;
}

// Function to generate ramdon colors
function getColor() {
  let hexLetters = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  let hexCode = "#";
  for (let i = 0; i < hexLetters.length; i += 1) {
    hexCode += hexLetters[Math.floor(Math.random() * hexLetters.length)];
  }
  hexCode = hexCode.slice(0, 7);

  return hexCode;
}

// Function to conver hexcode to rgb code
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r;
  let g;
  let b;
  if (result) {
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
  }
  let rgbResult = [r, g, b];

  return rgbResult;
}

// Function to change text color based on color brightness
function setContrast(str) {
  let textColor;

  const brightness = Math.round(
    (parseInt(str[0]) * 299 + parseInt(str[1]) * 587 + parseInt(str[2]) * 114) /
      1000
  );

  if (brightness > 125) {
    textColor = "#000000";
  } else {
    textColor = "#FFFFFF";
  }

  return textColor;
}
