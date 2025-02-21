if (typeof window !== 'undefined') {
    window.vegan_check_weeks = [
        {
            "data": "W4",
            "count": 50
        },
        {
            "data": "W3",
            "count": 50
        },
        {
            "data": "W2",
            "count": 48
        },
        {
            "data": "W1",
            "count": 26
        },
        {
            "data": "W5",
            "count": 40
        },
        {
            "data": "W6",
            "count": 2
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.vegan_check_weeks);
}else {
    console.error("Daten aus count.js nicht geladen");
}