const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const colorContainer = document.querySelectorAll(".color-container");
const colorName = document.querySelectorAll(".color-name");
const lockIcons = document.querySelectorAll(".lock-icon");
const popup = document.getElementById("popup");

// set new color palette after DOM is loaded
document.addEventListener("DOMContentLoaded", setColors);

// set new color palette when 'spacebar' is pressed
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    setColors();
  }
});

// DOM header buttons
generateBtn.addEventListener("click", setColors);
saveBtn.addEventListener("click", getCanvas);

// Store all palette generated so far
let allGeneratePalette = [];
let currentColorsArray = [];

// Function to set colors in selected DOM elements
function setColors() {
  // reset array to only store current color
  currentColorsArray = [];

  colorContainer.forEach((el) => {
    // get new color
    let newColor = getColor();
    // put new colors to all unlock children
    if (!el.children[0].classList.contains("isLocked")) {
      // store it on outer array
      currentColorsArray.push(newColor);
      // transform new hexcode color based on color brightness
      let textColor = setContrast(hexToRgb(newColor));
      // display all colors and set text color
      el.children[1].style.color = textColor;
      el.children[0].style.color = textColor;
      el.children[1].innerText = newColor;
      el.style.backgroundColor = newColor;

      // maintain the same color is child is locked
    } else if (el.children[0].classList.contains("isLocked")) {
      currentColorsArray.push(el.children[1].innerText);
    }
  });
  // saved pallete in history
  pushStateColorToHistory();
  return allGeneratePalette.push(currentColorsArray);
}

// Funttion to remove last palette store in allGeneratePalette
function removeLastPalette() {
  let previousPalette;
  previousPalette = allGeneratePalette.pop();

  return previousPalette;
}

// Function to access the last palette available in allGeneratePalette
function getLastPalette() {
  return allGeneratePalette[allGeneratePalette.length - 1];
}

// Function to set previous color palette if user go back
function previousColors() {
  // remove last palette from display
  removeLastPalette();
  // remove all colors saved
  currentColorsArray = [];
  // get previous stringPalette
  let lastColorsPalette = getLastPalette();
  // save provious colors
  lastColorsPalette.forEach((el) => currentColorsArray.push(el));
  // saved pallete in the history
  pushStateColorToHistory();

  colorContainer.forEach((el) => {
    let newColor = lastColorsPalette[0]; //"new" color from previous palette
    if (!el.children[0].classList.contains("isLocked")) {
      let textColor = setContrast(hexToRgb(newColor));
      el.children[1].style.color = textColor;
      el.children[0].style.color = textColor;
      el.children[1].innerText = newColor;
      el.style.backgroundColor = newColor;

      // remove color in index 0 after setting it
      lastColorsPalette.shift();
    } else if (el.children[0].classList.contains("isLocked")) {
      // just remove color in index 0
      lastColorsPalette.shift();
    }
  });
  return 0;
}
// listening for users to trigger history.back() to set previous palette
window.addEventListener("popstate", previousColors);

// Function to generate random colors
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

// lock-color feature
lockIcons.forEach((element) => {
  element.addEventListener("click", () => {
    if (element.getAttribute("name") === "lock-open-outline") {
      element.setAttribute("name", "lock-closed-outline");
      element.classList.add("isLocked");
    } else {
      element.setAttribute("name", "lock-open-outline");
      element.classList.remove("isLocked");
    }
  });
});

// Copy hexcode feature
colorName.forEach((element) => {
  element.addEventListener("click", () => {
    navigator.clipboard.writeText(element.innerText);
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
  });
});

// Function to create a image file using a canvas element
function getCanvas() {
  // getting colors from currentColorsArray to draw in canvas
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute("width", "1280px");
  canvas.setAttribute("height", "720px");
  canvas.style.border = "1px solid black;";
  const ctx = canvas.getContext("2d");

  // 1st color
  ctx.fillStyle = currentColorsArray[0];
  ctx.fillRect(0, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 650, 1280, 720);
  ctx.fillStyle = "black";
  ctx.fillText(currentColorsArray[0], 120, 690);

  // 2nd color
  ctx.fillStyle = currentColorsArray[1];
  ctx.fillRect(256, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentColorsArray[1], 380, 690);

  // 3rd color
  ctx.fillStyle = currentColorsArray[2];
  ctx.fillRect(512, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentColorsArray[2], 630, 690);

  // 4th color
  ctx.fillStyle = currentColorsArray[3];
  ctx.fillRect(768, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentColorsArray[3], 890, 690);

  // 5th color
  ctx.fillStyle = currentColorsArray[4];
  ctx.fillRect(1024, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentColorsArray[4], 1140, 690);

  // conver canvas to image file
  let dt = canvas.toDataURL("image/png");
  dt = dt.replace(/^data:image\/[^;]*/, "data:application/palette");

  // download the file
  let triggerDownload = document.createElement("a");
  triggerDownload.href = dt;
  triggerDownload.download = "palette.png";
  document.body.appendChild(triggerDownload);
  triggerDownload.click();
  document.body.removeChild(canvas);
  document.body.removeChild(triggerDownload);

  return 0;
}

// Funtion to add the generated colors to the history without reloading
function pushStateColorToHistory() {
  return history.pushState(null, "");
}
