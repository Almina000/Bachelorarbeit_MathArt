function calculateSurfaceArea(rectWidth, rectHeight, topHashtags,  totalTopCount, sizeValue) {

    console.log("TotalTopCount:", totalTopCount);
    console.log("sizeValue:", sizeValue);
    let surfaceAreas = [];
    let surfaceTotal = rectHeight * rectWidth;

    topHashtags.forEach((tag, index) => {
        let percentTag = tag.count / totalTopCount; //% pro Tag
        let surfaceTag = percentTag * surfaceTotal * sizeValue; // A pro Tag
        surfaceAreas.push(surfaceTag);
      });

    console.log("Surface Areas Array:", surfaceAreas);
    return surfaceAreas;

}