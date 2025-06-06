const main = document.querySelector(".main");
const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const colorContainer = document.querySelectorAll(".color-container");
const colorCode = document.querySelectorAll(".color-code");
const colorName = document.querySelectorAll(".color-name");
const actionIconsContainer = document.querySelectorAll(".action-icons");
const lockIcons = document.querySelectorAll(".lock-icon");
const copyIcon = document.querySelectorAll(".copy-icon");
const swapIcons = document.querySelectorAll(".swap-icon");
const popup = document.getElementById("popup");

// set new color palette after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setColors("new");
  widthChecker();
});

// set new color palette when 'spacebar' is pressed
document.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.code === "Space") {
    setColors("new");
  }
});

// DOM header buttons
generateBtn.addEventListener("click", () => {
  setColors("new");
});
saveBtn.addEventListener("click", getCanvas);

// Store all palette generated so far
let totalColorPalette = [];
let currentPalette = [];

// Function to set colors on display, they could be "new" or "previous" colors
function setColors(str) {
  let currentColorsArray = [];
  let newColorsPalette = [];
  if (str === "previous") {
    if (totalColorPalette.length > 1) {
      removeLastPalette();
      newColorsPalette = getLastPalette();
      setIndividualColors();
    }
    return 0;
  } else if (str === "new") {
    for (let i = 0; i < 5; i += 1) {
      newColorsPalette.push(getColor());
    }
    setIndividualColors();
  }

  function setIndividualColors() {
    colorContainer.forEach((element) => {
      // get new color and contrast color text
      let newColor = newColorsPalette[0];
      let textColor = setContrast(hexToRgb(newColor));

      // parameters to modify
      let backgroundDiv = element.children[0];
      let lockIcon = element.children[0].children[0].children[0];
      let copyIcon = element.children[0].children[0].children[1];
      let swapIcon = element.children[0].children[0].children[2];
      let hexCode = element.children[0].children[1].children[0];
      let colorName = element.children[0].children[1].children[1];

      if (!lockIcon.classList.contains("isLocked")) {
        backgroundDiv.style.backgroundColor = newColor;
        hexCode.innerText = newColor;
        hexCode.style.color = textColor;
        lockIcon.style.color = textColor;
        copyIcon.style.color = textColor;
        swapIcon.style.color = textColor;
        colorName.innerText = nameThatColor(newColor);
        colorName.style.color = textColor;

        currentColorsArray.push(newColorsPalette[0]);
        newColorsPalette.shift();
      } else if (lockIcon.classList.contains("isLocked")) {
        currentColorsArray.push(hexCode.innerText);
        newColorsPalette.shift();
      }
      pushStateColorToHistory();
    });

    return 0;
  }

  // save the current displayed palette
  (function () {
    currentPalette = [];
    currentColorsArray.forEach((element) => currentPalette.push(element));
  })();

  return totalColorPalette.push(currentColorsArray);
}

// Function to remove last palette store in allGeneratePalette
function removeLastPalette() {
  return totalColorPalette.pop();
}

// Function to access the last palette available in allGeneratePalette
function getLastPalette() {
  let pallete = totalColorPalette[totalColorPalette.length - 1];
  return pallete;
}

// listening for users to trigger history.back() to set previous palette
window.addEventListener("popstate", () => {
  setColors("previous");
});

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

// storing the event listener at the top parent to not lose it when mutating child elements
main.addEventListener("click", (e) => {
  let focus = e.target;
  // lock-color feature
  if (focus.classList.contains("lock-icon")) {
    if (focus.getAttribute("name") === "lock-open-outline") {
      focus.setAttribute("name", "lock-closed");
      focus.classList.add("isLocked");
      popup.innerText = "Locked!";
      popup.classList.add("show");
      setTimeout(() => {
        popup.classList.remove("show");
        popup.innerText = "";
      }, 1800);
    } else {
      focus.setAttribute("name", "lock-open-outline");
      focus.classList.remove("isLocked");
      popup.innerText = "Unlocked!";
      popup.classList.add("show");
      setTimeout(() => {
        popup.classList.remove("show");
        popup.innerText = "";
      }, 1800);
    }
    // Copy hexcode feature
  } else if (focus.classList.contains("copy-icon")) {
    let colorName =
      focus.offsetParent.children[0].children[1].children[0].innerText;
    navigator.clipboard.writeText(colorName);
    popup.innerText = "Copied to the clipboard!";
    popup.classList.add("show");
    focus.setAttribute("name", "copy");
    focus.classList.add("isLocked");
    setTimeout(() => {
      focus.setAttribute("name", "copy-outline");
      focus.classList.remove("isLocked");
      popup.classList.remove("show");
      popup.innerText = "";
    }, 1800);
  }
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
  ctx.fillStyle = currentPalette[0];
  ctx.fillRect(0, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 650, 1280, 720);
  ctx.fillStyle = "black";
  ctx.fillText(currentPalette[0], 120, 690);

  // 2nd color
  ctx.fillStyle = currentPalette[1];
  ctx.fillRect(256, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentPalette[1], 380, 690);

  // 3rd color
  ctx.fillStyle = currentPalette[2];
  ctx.fillRect(512, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentPalette[2], 630, 690);

  // 4th color
  ctx.fillStyle = currentPalette[3];
  ctx.fillRect(768, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentPalette[3], 890, 690);

  // 5th color
  ctx.fillStyle = currentPalette[4];
  ctx.fillRect(1024, 0, 256, 650);
  ctx.font = "normal 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(currentPalette[4], 1140, 690);

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

// Function to call ntc() to set name colors
function nameThatColor(arr) {
  let n_match = ntc.name(arr);
  n_rgb = n_match[0];
  n_name = n_match[1];
  n_exactmatch = n_match[2];

  // marking approximate colors with "~"
  if (!n_exactmatch) {
    n_name = "~" + n_match[1];
  }

  return n_name;
}

// Function to check and change the swap icons based on screen width (mobile)
function widthChecker() {
  if (main.clientWidth < 577) {
    swapIcons.forEach((element) => {
      element.setAttribute("name", "swap-vertical");
    });
  }
}

// Drag and drop feature
swapIcons.forEach((element) => {
  let colorBlockToMove = element.offsetParent;

  colorBlockToMove.addEventListener("dragstart", handleDragstart);
  colorBlockToMove.addEventListener("dragover", handleDragover);
  colorBlockToMove.addEventListener("dragleave", handleDragleave);
  colorBlockToMove.addEventListener("drop", handleDrop);
});

let draggedElement;

function handleDragstart(event) {
  draggedElement = this;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragover(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  this.classList.add("over");
}

function handleDragleave() {
  this.classList.remove("over");
}

function handleDrop(event) {
  event.preventDefault();
  draggedElement.innerHTML = this.innerHTML;
  this.innerHTML = event.dataTransfer.getData("text/html");
  this.classList.remove("over");
}

function handleDragend() {
  draggedElement = null;
}
