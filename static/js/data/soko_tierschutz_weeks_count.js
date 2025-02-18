if (typeof window !== 'undefined') {
    window.soko_tierschutz_weeks = [
        {
            "data": "W4",
            "count": 55
        },
        {
            "data": "W3",
            "count": 50
        },
        {
            "data": "W2",
            "count": 53
        },
        {
            "data": "W1",
            "count": 25
        },
        {
            "data": "W6",
            "count": 1
        },
        {
            "data": "W5",
            "count": 32
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.soko_tierschutz_weeks);
}else {
    console.error("Daten aus count.js nicht geladen");
}
