if (typeof window !== 'undefined') {
    window.elbenwald_months = [
        {
            "data": "February",
            "count": 41
        },
        {
            "data": "January",
            "count": 56
        },
        {
            "data": "December",
            "count": 74
        },
        {
            "data": "November",
            "count": 45
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.elbenwald_months);
}else {
    console.error("Daten aus count.js nicht geladen");
}