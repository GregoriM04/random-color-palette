const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const colorContainer = document.querySelectorAll(".color-container");
const colorName = document.querySelectorAll(".color-name");
const lockIcons = document.querySelectorAll(".lock-icon");
const popup = document.getElementById("popup");

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
saveBtn.addEventListener("click", getCanvas);

// Function to set colors
function setColors() {
  colorContainer.forEach((el) => {
    if (!el.children[0].classList.contains("isLocked")) {
      let newColor = getColor();
      let textColor = setContrast(hexToRgb(newColor));
      el.children[1].style.color = textColor;
      el.children[0].style.color = textColor;
      el.children[1].innerText = newColor;
      el.style.backgroundColor = newColor;
    }
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

// copy hexcode feature
colorName.forEach((element) => {
  element.addEventListener("click", () => {
    navigator.clipboard.writeText(element.innerText);
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
  });
});

// Function to get current colors
function getColorsArray() {
  let allColorsArray = [];
  colorContainer.forEach((element) => {
    allColorsArray.push(element.children[1].innerText);
  });
  return allColorsArray;
}

// Function to create a image file using a canvas element
function getCanvas() {
  // get current displayed colors
  let colorToUse = getColorsArray();
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute("width", "1280px");
  canvas.setAttribute("height", "720px");
  canvas.style.border = "1px solid black;";
  const ctx = canvas.getContext("2d");

  // 1st color
  ctx.fillStyle = colorToUse[0];
  ctx.fillRect(0, 0, 256, 650);
  ctx.font = "bold 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 650, 1280, 720);
  ctx.fillStyle = "black";
  ctx.fillText(colorToUse[0], 120, 690);

  // 2nd color
  ctx.fillStyle = colorToUse[1];
  ctx.fillRect(256, 0, 256, 650);
  ctx.font = "bold 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(colorToUse[1], 380, 690);

  // 3rd color
  ctx.fillStyle = colorToUse[2];
  ctx.fillRect(512, 0, 256, 650);
  ctx.font = "bold 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(colorToUse[2], 630, 690);

  // 4th color
  ctx.fillStyle = colorToUse[3];
  ctx.fillRect(768, 0, 256, 650);
  ctx.font = "bold 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(colorToUse[3], 890, 690);

  // 5th color
  ctx.fillStyle = colorToUse[4];
  ctx.fillRect(1024, 0, 256, 650);
  ctx.font = "bold 32px Poppins";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000000";
  ctx.fillText(colorToUse[4], 1140, 690);

  // conver canvas to image file
  let dt = canvas.toDataURL("image/png");
  dt = dt.replace(/^data:image\/[^;]*/, "data:application/palette");

  // download the file
  let triggerDownload = document.createElement("a");
  triggerDownload.href = dt;
  triggerDownload.download = "palette.png";
  document.body.appendChild(triggerDownload);
  triggerDownload.click();
  document.body.removeChild(triggerDownload);

  return 0;
}
