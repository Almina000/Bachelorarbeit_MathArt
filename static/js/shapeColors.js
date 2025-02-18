async function loadShapeColors() {
    const dataPath = localStorage.getItem("dataPath");
    const dataName = localStorage.getItem("dataName");

    if (!dataPath || !dataName) {
        console.error("Datenpfad oder Name fehlt in LocalStorage!");
        return;
    }

    const dataFile = `static/js/data/${dataPath}_count.js`;

    try {
        const response = await fetch(dataFile);
        if (!response.ok) {
            console.warn("Daten-Datei nicht gefunden, lade Standardwerte...");
            return;
        }

        const data = await response.json(); // Annahme: JSON-Format
        const shapeContainer = document.getElementById("shapeColors");
        shapeContainer.innerHTML = "";

        const shapeCounts = JSON.parse(localStorage.getItem("shapeCounts")) || { triangles: 5, circles: 5, rectangles: 5 };

        let shapeList = [];

        for (let i = 0; i < shapeCounts.triangles; i++) {
            shapeList.push({ type: "Dreieck", name: data[i] || `Dreieck ${i + 1}` });
        }
        for (let i = 0; i < shapeCounts.circles; i++) {
            shapeList.push({ type: "Kreis", name: data[i] || `Kreis ${i + 1}` });
        }
        for (let i = 0; i < shapeCounts.rectangles; i++) {
            shapeList.push({ type: "Rechteck", name: data[i] || `Rechteck ${i + 1}` });
        }

        shapeList.forEach((shape, index) => {
            const label = document.createElement("label");
            label.textContent = shape.name;

            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.className = "color-picker";
            colorInput.id = `shapeColor${index}`;
            colorInput.value = localStorage.getItem(`shapeColor${index}`) || "#000000";

            colorInput.addEventListener("input", () => {
                localStorage.setItem(`shapeColor${index}`, colorInput.value);
            });

            const div = document.createElement("div");
            div.className = "color-picker-container";
            div.appendChild(label);
            div.appendChild(colorInput);

            shapeContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

// Funktion, die beim Laden der Seite automatisch die Farben setzt
function initShapeColors() {
    loadShapeColors();

    // Regler-Werte setzen
    const shapeCounts = JSON.parse(localStorage.getItem("shapeCounts")) || { triangles: 5, circles: 5, rectangles: 5 };
    document.getElementById("triangles").value = shapeCounts.triangles;
    document.getElementById("circles").value = shapeCounts.circles;
    document.getElementById("rectangles").value = shapeCounts.rectangles;
}
