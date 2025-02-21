// sketch.js
//_______________________________________________________________________________
//VARIABLEN HOLEN

loadScript("static/js/libraries/p5.min.js", function () {
  console.log("p5 geladen");

});

const shapeCounts = JSON.parse(localStorage.getItem("shapeCounts")) || { triangles: 5, circles: 5, rectangles: 5 };
if (!shapeCounts) {
  window.location.href = "index.html";
}
const { triangles, circles, rectangles } = shapeCounts;
console.log(`Dreiecke: ${triangles}, Kreise: ${circles}, Rechtecke: ${rectangles}`);

const filterValue = localStorage.getItem('filter');
const storedSelectedOption = localStorage.getItem('selectedOption');
console.log("storedSelectedOption:", storedSelectedOption);


if (filterValue === 'true') {
  console.log('Filter ist aktiviert.');
} else if (filterValue === 'false') {
  console.log('Filter ist deaktiviert.');
} else {
  console.log('Filter-Zustand ist undefiniert oder nicht gesetzt.');
}

const colorDataValue = localStorage.getItem('colorData');

if (colorDataValue === "true") {
  console.log("colorData ist aktiviert.");
} else if (colorDataValue === "false") {
  console.log("colorData ist deaktiviert.");
} else {
  console.log("colorData-Zustand ist undefiniert oder nicht gesetzt.");
}


let backgroundColor = localStorage.getItem('pickedbackgroundcolor');
if (!backgroundColor) {
  backgroundColor = "#FFFFFF";
}

const sizeValue = parseFloat(localStorage.getItem('size')) || 0.5;
console.log('Größe:', sizeValue);

//___________________________________________________________________________________________



const totalShapes = triangles + circles + rectangles;
console.log(`gesamt: ${totalShapes}`);

function preload() {
  customFont = loadFont('static/fonts/AbadiMT-ExtraLight.ttf');
}

const canvasWidth = 768;
const canvasHeight = 1080;

function setup() {
  
 
  let canvas = createCanvas(canvasWidth, canvasHeight); // Speichere die Canvas-Instanz

  let container = document.getElementById('artwork'); // HTML-Element holen

  if (container) {
    canvas.parent(container); // Canvas dem Container zuweisen
  } else {
    console.error("Der Container 'artwork' existiert nicht im DOM.");
  }

  
  background(255);
  

  let rectWidth = canvasWidth * 0.6;
  let rectHeight = canvasHeight * 0.5;
  let rectX = (canvasWidth - rectWidth) / 2;
  let rectY = canvasHeight * 0.1;
  
  // Hintergrundfarbe nur für das Rechteck
  fill(backgroundColor); 
  noStroke(); // Kein Rand
  rect(rectX, rectY, rectWidth, rectHeight);

  noFill();
  stroke(0);
  rect(rectX, rectY, rectWidth, rectHeight);

  let topData = [];

  let data_Path = localStorage.getItem("dataPath");
  console.log("dataPath aus LocalStorage:", data_Path);

  let storedData = window[data_Path] || JSON.parse(localStorage.getItem("storedData")) || [];
    
  if (!storedData.length) {
      console.warn("Keine Hashtag-Daten verfügbar! Stelle sicher, dass die Daten geladen wurden.");
  }

  console.log("Geladene Daten:", storedData);

  topData = storedData
    .sort((a, b) => b.count - a.count)  // Sortiere nach count in absteigender Reihenfolge
    .slice(0, totalShapes);  // Schneide die obersten 'num' Elemente ab
  let totalTopCount = topData.reduce((sum, data) => sum + data.count, 0);

  console.log("topData.length:", topData.length);
  console.log("topData:", topData);

  
  let colors = [];  // Initialisiere das Array colors
  let data_Name = localStorage.getItem("dataName");
  let profile_Name = localStorage.getItem("profileName");

  if (storedSelectedOption === 'Knallig Bunt'){
    //Knallig Bunt
    colors = [
      "#FF5733", "#FFC300", "#FFFC33", "#33FF57", "#33FFD7", "#33A7FF",
      "#3357FF", "#8633FF", "#D133FF", "#FF33C7", "#FF338C", "#FF3333",
      "#FF9C33", "#F3FF33", "#7FFF33", "#33FFA7", "#33FFF3", "#33A7FF",
      "#3333FF", "#8633FF", "#C733FF", "#FF33A7", "#FF3357", "#FF6B33",
      "#FFD733", "#FFFF33", "#7AFF33", "#33FF6B", "#33FFFF", "#33B7FF"
    ]
  } else if (storedSelectedOption === 'Zarte Pastelltöne'){
    // Zarte Pastelltöne
    colors = [
      "#D6EAF8", "#A7E0E5", "#CBAACB", "#FFB7C5", "#779ECB", "#D9B4E3",
      "#FFD2A1", "#ACE5EE", "#E6CFE3", "#FFB347", "#F9FD96", "#FF6961",
      "#D66666", "#77DD77", "#AFEAD7", "#C26E60", "#D8F5A2", "#FFA07A",
      "#8FDFFB", "#E8C2A3", "#95D3A2", "#E2A7C9", "#7FD9E7", "#FFC8B2",
      "#C38EC7", "#89CFF0", "#FADADD", "#F2C8E6", "#FAE1DD", "#A6E2E9"
    ]
  } else if (storedSelectedOption === 'Beeren-Farben'){
    // Beeren-Farben
    colors = [
      "#6B0F1A", "#9A1B27", "#C2435A", "#E08BB3", "#7998C8", "#4A6C7D",
      "#A44252", "#B75064", "#D59A9F", "#697ECF", "#6E8895", "#5B3644",
      "#AB3E58", "#D96D82", "#E7B8C6", "#4A9EB0", "#3C5A6C", "#271D23",
      "#A94455", "#C36C7D", "#DB9FAF", "#4D8FA0", "#7D5C6D", "#212833",
      "#93233C", "#B54C62", "#D38494", "#5EA3D1", "#67798C", "#2E3945"
    ]
  } else if (storedSelectedOption === 'Frische Natur'){
    //Frische Natur
    colors = [
      "#FFB703", "#6F9F6D", "#00B4D8", "#B6D58A", "#0077B6", "#90E0EF",
      "#D4504E", "#8DBA7E", "#FFD166", "#935B40", "#EA6B74", "#A3C896",
      "#FF69B4", "#5C9364", "#C6D1B5", "#6A2A1C", "#9FD19E", "#7B4A2B",
      "#FF1493", "#24492F", "#DCE7A8", "#6DAF76", "#C1CDB6", "#4B0082",
      "#E37760", "#007F5F", "#778899", "#DA70D6", "#87CEEB", "#FF6347"
    ]
   
  } else if (storedSelectedOption === 'Ozeanische Ruhe'){
    //Ozeanische Ruhe
    colors = [
      "#A9D6E5", "#6EB9F0", "#6CA6CD", "#4682B4", "#1C6BA0", "#FABADD",
      "#E8C8DC", "#FF96C1", "#FF59B4", "#D14993", "#B0C4DE", "#7FCEEB",
      "#00BFFF", "#1E70FF", "#6495ED", "#5F9EA0", "#4682B4", "#5B3998",
      "#7FB3D5", "#5499C7", "#2980B9", "#2461A3", "#1B4F72", "#A5C1E9",
      "#BED6F1", "#A6DAF8", "#EAF2F8", "#EBF5FB", "#7F9E9F", "#5C6E9F"
    ] 
  } else if (storedSelectedOption === 'Eiscreme-Sommer'){
    //Eiscreme-Sommer
    colors = [
      "#1F5633", "#79A04C", "#F4EDED", "#A881A6", "#5C4563", "#95C074",
      "#D1D9D5", "#E8C8EF", "#7B2F54", "#A3D6A2", "#9B6E83", "#F7E3E3",
      "#8A3D75", "#C39CB3", "#BFAFCC", "#5B7157", "#B2DF9B", "#CBB7D4",
      "#7A4E6C", "#4A8D62", "#6B557D", "#A9C9A9", "#DED4E6", "#502D5F",
      "#D9E0EF", "#776C95", "#B1E2C2", "#4A7B57", "#E8B7EF", "#5F4C4B"
    ] 
  } else if (storedSelectedOption === 'Düsterer Herbst'){
    //Düsterer Herbst
    colors = [
      "#2B1B17", "#5E342E", "#7B4E26", "#9B6513", "#A0622D", "#CD6B3F",
      "#D26F1E", "#FF7F60", "#FF7347", "#FF4A00", "#8B1000", "#4B1072",
      "#5A2A6E", "#800890", "#9370DB", "#5E1B3B", "#682C68", "#A5392A",
      "#8B4513", "#D2691E", "#FFA07A", "#DA7520", "#7B3F20", "#4A4A4A",
      "#5E5E7E", "#6B6B6B", "#3F4F4F", "#556B2F", "#9B6B00", "#BC9F8F"
    ]
  }else if (data_Name == "colors"){
    colors = topData.map(colorObj => colorObj.data);
    console.log(colors);    
  }
  
  let legendX1 = rectX; // Linker Block
  let legendX2 = rectX + rectWidth / 2 + 20; // Rechter Block
  let legendY = rectY + rectHeight + 50; // Höhe unter dem Rechteck

  textFont(customFont);
  textSize(16);
  textAlign(LEFT, CENTER);

  let leftCount = Math.ceil(totalShapes / 2); // Anzahl der Hashtags links
  let rightCount = Math.floor(totalShapes / 2); // Anzahl der Hashtags rechts
  

  for (let index = 0; index < Math.min(leftCount, topData.length); index++) {
    fill((colors[index]));
    stroke(0);
    strokeWeight(1);
    ellipse(legendX1 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke

    noStroke();
    fill(0); // Textfarbe schwarz
    textSize(16); // Schriftgröße anpassen, falls nötig
    textFont(customFont); // Schriftart (stelle sicher, dass customFont geladen wird)
    text(topData[index].data, legendX1 + 30, legendY + index * 30 + 10);
  }

  // Rechter Block
  for (let index = 0; index < Math.min(rightCount, topData.length - leftCount); index++) {
    let hashtagIndex = leftCount + index; // Index im gesamten Array
    fill((colors[hashtagIndex]));
    stroke(0);
    strokeWeight(1);
    ellipse(legendX2 + 10, legendY + index * 30 + 10, 20, 20); // Kreise statt Rechtecke

    noStroke();
    fill(0); // Textfarbe schwarz
    textSize(16); // Schriftgröße anpassen, falls nötig
    textFont(customFont); // Schriftart (stelle sicher, dass customFont geladen wird)
    text(topData[hashtagIndex].data, legendX2 + 30, legendY + index * 30 + 10);
  }

  ///////////////////////////////////////////////////
  //TEST Fibonacci Raster
  let goldenRatio = 0.618;
  // Berechne die Hauptachsen des Fibonacci-Rasters
  let x1 = rectX + rectWidth * goldenRatio;       // Vertikale Linie 1
  let x2 = rectX + rectWidth * (1 - goldenRatio); // Vertikale Linie 2
  let y1 = rectY + rectHeight * goldenRatio;      // Horizontale Linie 1
  let y2 = rectY + rectHeight * (1 - goldenRatio);// Horizontale Linie 2

//    // Vertikale Linie 1 (blau)
//   stroke(0, 0, 255); // Blau
//   line(x1, rectY, x1, rectY + rectHeight);

// // Vertikale Linie 2 (rot)
//   stroke(255, 0, 0); // Rot
//   line(x2, rectY, x2, rectY + rectHeight);

// // Horizontale Linie 1 (lila)
//   stroke(128, 0, 128); // Lila
//   line(rectX, y1, rectX + rectWidth, y1);

// // Horizontale Linie 2 (grün)
//   stroke(0, 255, 0); // Grün
//   line(rectX, y2, rectX + rectWidth, y2);
  ////////////////////////////////////////////////////////////////

  // Funktion aufrufen
  
  let shapes = predictShape(totalShapes, triangles, circles, rectangles);
  let surfaceAreas = calculateSurfaceArea(rectWidth, rectHeight, topData, totalTopCount, sizeValue);
  //drawPoints(rectX, rectY, rectWidth, rectHeight);
  console.log(`ShapeArray Kreis: ${shapes}`);
  drawCircleForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes, filterValue);
  console.log(`ShapeArray Dreieck: ${shapes}`);
  drawTrianglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
  console.log('Rechtecke werden gezeichnet');
  drawRectanglesForHashtag(rectX, rectY, rectWidth, rectHeight, colors, surfaceAreas, shapes);
   
}

//FUNKTIONEN
