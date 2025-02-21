if (typeof window !== 'undefined') {
    window.tagesschau_months = [
        {
            "data": "February",
            "count": 204
        }
    ];
    console.log("Hashtag-Daten erfolgreich geladen:", window.tagesschau_months);
}else {
    console.error("Daten aus count.js nicht geladen");
}