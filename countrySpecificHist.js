

function countrySpecificHist(country){

    fetch("https://pomber.github.io/covid19/timeseries.json")
        .then(response => response.json())
        .then(data => {
            data['*'].forEach(({ date, confirmed, recovered, deaths }) =>
            console.log(`${date} active cases: ${confirmed - recovered - deaths}`)
        );

        


    });
}