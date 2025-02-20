let seedPoints = [];
let delaunay;

loadScript("static/js/libraries/p5.min.js", function () {
  console.log("p5 geladen");
});

const storedDelaunayCount = localStorage.getItem('delaunayCount');
const storedPalette = localStorage.getItem('selectedColorPalette');
let colorPalette = [];
if (storedPalette) {
    colorPalette = JSON.parse(storedPalette);
    console.log('Gespeicherte Farbpalette:', colorPalette);
} else {
    console.error('Keine Farbpalette im localStorage gefunden.');
    // Eine Standardpalette verwenden, falls keine gespeichert ist
    localStorage.setItem('selectedColorPalette', JSON.stringify(["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]));
    colorPalette = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
}

let x = storedDelaunayCount;
console.log("storedDelaunayCount:", storedDelaunayCount);

let topData = [];

let data_Path_delaunay = localStorage.getItem("dataPath");  
console.log("dataPath aus LocalStorage:", data_Path_delaunay);

let storedData = window[data_Path_delaunay] || [];  
console.log("storedDATA:", storedData);

topData = storedData
    .sort((a, b) => b.count - a.count)  // Sortiere nach count in absteigender Reihenfolge
    .slice(0, x);

console.log("topData.length:", topData.length);
console.log("topData:", topData);


let canvas;
function setup() {
  canvas = createCanvas(400, 400);

  let container = document.getElementById('sketch-holder'); // HTML-Element holen

  if (container) {
      canvas.parent(container); // Canvas dem Container zuweisen
  } else {
      console.error("Der Container 'sketch-holder' existiert nicht im DOM.");
  }

  for (let i = 0; i < topData.length; i++) {
    seedPoints[i] = createVector(random(width), random(height));
  }

  // Berechne die Delaunay-Triangulation
  delaunay = calculateDelaunay(seedPoints);
  noLoop();
}

function draw() {
  background(255);

  // Definiere die Farbpalette
  //const colorPalette = ['#003B46', '#07575B', '#66A5AD', '#C4DFE6'];
  //const colorPalette = ['#375E97', '#FB6542', '#FFBB00', '#3F681C'];
  // const colorPalette = ['#98DBC6', '#5BC8AC', '#E6D72A', '#F18D9E'];

  let voronoi = delaunay.voronoi([0, 0, width, height]);
  let polygons = voronoi.cellPolygons();
  for (let poly of polygons){
    console.log(poly);
    beginShape();
    for (let i = 0; i < poly.length; i++){
      let randomColor = colorPalette[int(random(colorPalette.length))];
      stroke(0);
      strokeWeight(2);
      vertex(poly[i][0], poly[i][1]);
      fill(randomColor);
    }
    endShape();
    
  }

  //noLoop();

}


function calculateDelaunay(points) {
  let pointsArray = [];
  
 
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
