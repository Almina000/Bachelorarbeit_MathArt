let points = [];
let delaunay, voronoi;

let minCount, maxCount;
let topData = [];

let canvas;

loadScript("static/js/libraries/p5.min.js", function () {
  console.log("p5 geladen");

});

const storedDelaunayCount = localStorage.getItem('delaunayCount');
const storedPalette = localStorage.getItem('selectedColorPalette');
const storedColorBorder = localStorage.getItem('colorBorder') || '#000000';
const storedColorPoints = localStorage.getItem('colorPoints') || '#FFFFFF';
console.log("colorBorder:", storedColorBorder);
console.log("colorPoints:", storedColorPoints);


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


function setup() {
    console.log("Ich bin in setup()");
    
    canvas = createCanvas(400, 400);

    let container = document.getElementById('sketch-holder');
    if (container) {
        canvas.parent(container);
    } else {
        console.error("Der Container 'sketch-holder' existiert nicht im DOM.");
    }
          
    const x = storedDelaunayCount;
    let data_Path_delaunay = localStorage.getItem("dataPath");  
    console.log("dataPath aus LocalStorage:", data_Path_delaunay);

    let storedData = window[data_Path_delaunay] || [];  
    console.log("storedDATA:", storedData);

    topData = storedData
      .sort((a, b) => b.count - a.count)
      .slice(0, x);
    maxCount = Math.max(...topData.map(data => data.count));
    minCount = Math.min(...topData.map(data => data.count));

    for (let i = 0; i < topData.length; i++) {
      let x = random(width);
      let y = random(height);
      points.push(createVector(x, y));
    }

    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);

    // 🟢 Farben der Polygone EINMAL festlegen
    let polygons = voronoi.cellPolygons();
    polygonColors = Array.from(polygons).map(() => {
        return colorPalette[int(random(colorPalette.length))]; // Zufällige Farbe pro Polygon
    });
}


function draw() {
    background(255);

    
    // Zeichne die Voronoi-Zellen
    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);

    for (let i = 0; i < cells.length; i++) {
        let poly = cells[i];
        fill(polygonColors[i]);  // Farbe aus dem vorher festgelegten Array verwenden
        stroke(storedColorBorder);
        strokeWeight(1);

        beginShape();
        for (let j = 0; j < poly.length; j++) {
            vertex(poly[j][0], poly[j][1]);
        }
        endShape(CLOSE);
    }

    // Dynamische Skalierung basierend auf storedDelaunayCount
    let baseMin = 5;  // Kleinste mögliche Größe (bei kleinem count)
    let baseMax = 20; // Größte mögliche Größe (bei großem count)

    // Stellt sicher, dass storedDelaunayCount als Zahl verwendet wird
    const delaunayCount = parseInt(storedDelaunayCount) || 10; // Standardwert 10

    let minWeight = map(delaunayCount, 5, 50, baseMin, 8);  // Skaliert von baseMin bis 8
    let maxWeight = map(delaunayCount, 5, 50, baseMax, 30); // Skaliert von baseMax bis 30

    // Zeige die Punkte, skaliert nach `count`
    for (let i = 0; i < points.length; i++) {
        let hashtag = topData[i];
        
        // Hier umgekehrt: kleiner count => kleiner Kreis, großer count => großer Kreis
        let weight = map(hashtag.count, minCount, maxCount, minWeight, maxWeight);

        // fill(map(weight, baseMin, baseMax, 50, 200), 100, 200, 150);
        fill(storedColorPoints);
        noStroke();
        ellipse(points[i].x, points[i].y, weight, weight);
    }



    let centroids = [];
    for (let poly of cells) {
        let area = 0;
        let centroid = createVector(0, 0);
        for (let i = 0; i < poly.length; i++) {
            let v0 = poly[i];
            let v1 = poly[(i + 1) % poly.length];
            let crossValue = v0[0] * v1[1] - v1[0] * v0[1];
            area += crossValue;
            centroid.x += (v0[0] + v1[0]) * crossValue;
            centroid.y += (v0[1] + v1[1]) * crossValue;
        }
        area /= 2;
        centroid.div(6 * area);
        centroids.push(centroid);
    }

    // Verschiebe Punkte stärker basierend auf `count`
    for (let i = 0; i < points.length; i++) {
        let hashtag = topData[i];
        let weight = map(hashtag.count, minCount, maxCount, 1, 5);
        points[i].lerp(centroids[i], weight * 0.1);
    }

    // Aktualisiere Voronoi-Diagramm
    delaunay = calculateDelaunay(points);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

// Berechnung des Delaunay-Diagramms
function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
