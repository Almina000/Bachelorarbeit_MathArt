if (typeof window !== 'undefined') {
    window.elbenwald_weeks = [
        {
            "data": "W4",
            "count": 50
        },
        {
            "data": "W3",
            "count": 54
        },
        {
            "data": "W2",
            "count": 58
        },
        {
            "data": "W1",
            "count": 19
        },
        {
            "data": "W5",
            "count": 31
        },
        {
            "data": "W6",
            "count": 4
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.elbenwald_weeks);
}else {
    console.error("Daten aus count.js nicht geladen");
}