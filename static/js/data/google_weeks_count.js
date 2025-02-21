if (typeof window !== 'undefined') {
    window.google_weeks = [
        {
            "data": "W3",
            "count": 65
        },
        {
            "data": "W4",
            "count": 58
        },
        {
            "data": "W2",
            "count": 31
        },
        {
            "data": "W1",
            "count": 9
        },
        {
            "data": "W5",
            "count": 40
        },
        {
            "data": "W6",
            "count": 1
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.google_weeks);
}else {
    console.error("Daten aus count.js nicht geladen");
}