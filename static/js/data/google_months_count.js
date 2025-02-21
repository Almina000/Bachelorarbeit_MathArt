if (typeof window !== 'undefined') {
    window.google_months = [
        {
            "data": "February",
            "count": 11
        },
        {
            "data": "December",
            "count": 44
        },
        {
            "data": "January",
            "count": 11
        },
        {
            "data": "November",
            "count": 30
        },
        {
            "data": "October",
            "count": 33
        },
        {
            "data": "September",
            "count": 36
        },
        {
            "data": "August",
            "count": 39
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.google_months);
}else {
    console.error("Daten aus count.js nicht geladen");
}