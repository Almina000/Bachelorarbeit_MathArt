if (typeof window !== 'undefined') {
    window.tagesschau_weeks = [
        {
            "data": "W4",
            "count": 57
        },
        {
            "data": "W3",
            "count": 95
        },
        {
            "data": "W2",
            "count": 52
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.tagesschau_weeks);
}else {
    console.error("Daten aus count.js nicht geladen");
}