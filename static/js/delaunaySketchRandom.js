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


let topData = [];

let data_Path_delaunay = localStorage.getItem("dataPath");  
console.log("dataPath aus LocalStorage:", data_Path_delaunay);

let storedData = window[data_Path_delaunay] || [];  
console.log("storedDATA:", storedData);

let x = storedDelaunayCount;
console.log("storedDelaunayCount:", storedDelaunayCount); //array.length
topData = storedData
    .sort((a, b) => b.count - a.count)  // Sortiere nach count in absteigender Reihenfolge
    .slice(0, x); // Wähle die Top 10 Hashtags
let maxCount = Math.max(...topData.map(h => h.count));
let minCount = Math.min(...topData.map(h => h.count));

console.log("maxCount:", maxCount, "minCount:", minCount);

console.log("topData.length:", topData.length);
console.log("topData:", topData);

let canvas;
function setup() {
    console.log("Ich bin in setup()");
    
    canvas = createCanvas(400, 400);

    let container = document.getElementById('sketch-holder'); // HTML-Element holen

    if (container) {
        canvas.parent(container); // Canvas dem Container zuweisen
    } else {
        console.error("Der Container 'sketch-holder' existiert nicht im DOM.");
    }
        

    let mode = localStorage.getItem('delaunayMode');
    if (mode === 'random') {
        // Generiere zufällige Punkte
        for (let i = 0; i < topData.length; i++) {
            seedPoints[i] = createVector(random(width), random(height));
        }
    } else if (mode === 'byFrequency') {
        // Punkte basierend auf Häufigkeit verteilen
        for (let i = 0; i < topData.length; i++) {
            let x = random(width); // Zufällige X-Position
            // let y = constrain(map(topData[i].count, 0, maxCount, height, 0), 0, height);
            let y = map(Math.log(topData[i].count), Math.log(minCount), Math.log(maxCount), height, 0);
            y = constrain(y, 0, height);

            seedPoints[i] = createVector(x, y);
        }
    }

    // Berechne die Delaunay-Triangulation
    delaunay = calculateDelaunay(seedPoints);
    noLoop();
   
}

function draw() {
    console.log("Ich bin in draw()");
    background(255);

    // Zeichne die Punkte
    for (let v of seedPoints) {
        stroke(0);
        strokeWeight(4);
        point(v.x, v.y);
    }

    // Zeichne die Dreiecke mit Farben aus der Farbpalette
    let { points, triangles } = delaunay;

    for (let i = 0; i < triangles.length; i += 3) {
        let a = 2 * triangles[i];
        let b = 2 * triangles[i + 1];
        let c = 2 * triangles[i + 2];

        // Wähle eine zufällige Farbe aus der Palette
        let randomColor = colorPalette[int(random(colorPalette.length))];

        // Zeichne das Dreieck
        fill(randomColor);
        stroke(0);
        strokeWeight(1);
        triangle(
            points[a],
            points[a + 1],
            points[b],
            points[b + 1],
            points[c],
            points[c + 1]
        );
    }
}

function calculateDelaunay(points) {
    let pointsArray = [];
    for (let v of points) {
        pointsArray.push(v.x, v.y);
    }
    return new d3.Delaunay(pointsArray);
}