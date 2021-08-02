var populationTrend = {
    worldContinentColors: {
        'World': '#67b7dc',
        'Asia': '#845EC2',
        'Africa': '#D65DB1',
        'North America': '#F26430',
        'South America': '#007f01',
        'Europe': '#FFC73F',
        'Oceania': '#473198'},
    tenCountryColors: [
        'rgb(234, 81, 157)', 'rgb(162, 5, 126)', 'rgb(73, 0, 106)', 'rgb(50, 165, 194)',
        'rgb(34, 85, 164)', 'rgb(8, 29, 88)', 'rgb(181, 222, 43)', 'rgb(27, 127, 65)',
        'rgb(121, 110, 178)', 'rgb(82, 35, 141)'],
    lineChartXAxis: {
        category: 'year',
        title: 'Year'},
    lineChartYAxis: {
        title: 'Population'
    },
    lineChartDiv: "lineChartDiv",
    countryColorIndex: 0,
    selectedData: {},
    selectedCountryNamesList: [],
    choroplethData: {},
    choroplethDataIndex: 0,
    choroplethSliderYear: 1950,
    currentChoroplethData: {},
    lineChart: null,
    lineDateAxis: null,
    lineValueAxis: null,
    showChoroplethLegend: true,
    showChoroplethSlider: true,
    deletePlace: "",
    currentColor: "",
    addPlace: "",
    fillKey: "population",
    mapDivName: 'mapDiv',
    mapSliderName:'mapSliderDiv',
    mapColors: d3.schemeYlOrBr[9],
    mapDomain: [10000, 100000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000],
    mapLegendTicks: ["Population range:", 10000, 100000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000],
    updateLegendTicks: false,
    updateLegend: null
};

populationTrend.colorScale =  function (key) {
    var scale = d3.scaleThreshold()
        .domain(populationTrend.mapDomain)
        .range(populationTrend.mapColors);

    var fillValue = populationTrend.currentChoroplethData[key];

    if(fillValue === undefined) {
        fillValue = 0;
    }
    return scale(fillValue);
};

function setContinentButtonFunctionalityForPopulation() {
    $(".form-check .button_continent").click(function(){

        var idOfSelectedItem = (this.id);
        if(!populationTrend.selectedCountryNamesList.includes(idOfSelectedItem)
            && (populationTrend.selectedCountryNamesList.length)<10) {

            //newly selected and total number of places selected is less than 10
            if(idOfSelectedItem === "World") {
                plotWorld()
            } else {
                getContinentData(idOfSelectedItem);
            }
        } else if(populationTrend.selectedCountryNamesList.includes(idOfSelectedItem)) {

            populationTrend.deletePlace = idOfSelectedItem;
            removeLine(populationTrend);

        } else if(populationTrend.selectedCountryNamesList.length === 10) {
            alert("Max selection 10 exceeded.");
        }
    });
}

function plotWorld() {

    getContinentDetails("World")
    .then(function(result) {

        data = result.wp.populationList;

        populationTrend.fillKey = "World";
        populationTrend.currentColor = populationTrend.worldContinentColors.World;
        populationTrend.addPlace = "World";

        drawLine(populationTrend, data);
        populationTrend.selectedCountryNamesList.push("World");
    })
    .catch(function(error) {
        console.log(error);
        alert("Unable to retrieve data. Kindly check your network connection.");
    });
}

function getContinentData(continentName) {

    getContinentDetails(continentName)
    .then(function(result) {

        populationTrend.fillKey = continentName;
        populationTrend.currentColor = populationTrend.worldContinentColors[continentName];
        populationTrend.addPlace = continentName;

        drawLine(populationTrend, result);
        populationTrend.selectedCountryNamesList.push(continentName);
    })
    .catch(function(error) {
        console.log(error);
        alert("Unable to retrieve data. Kindly check your network connection.");
    });
}

function plotCountry(countryName, color) {
    var countryData = getCountryDetails(countryName);

    populationTrend.fillKey = countryName;
    populationTrend.currentColor = color;
    populationTrend.addPlace = countryName;

    drawLine(populationTrend, countryData);
    populationTrend.selectedCountryNamesList.push(countryName);
}

function getCountryDetails(cName) { return Object.entries(allCountriesData).map(e => {var o = {};  o["year"] = e[0]; o[cName] = e[1][cName]; return o; }); }

function getContinentDetails(cName) {
    var fileName = ""
    switch(cName) {
        case "Asia":
            fileName = "Asia.json";
            break;
        case "Europe":
            fileName = "Europe.json";
            break;
        case "North America":
            fileName = "NorthAmerica.json";
            break;
        case "South America":
            fileName = "SouthAmerica.json";
            break;
        case "Oceania":
            fileName = "Oceania.json";
            break;
        case "Africa":
            fileName = "Africa.json";
            break;
        case "World":
            fileName = "World.json";
            break;

    }

    return d3.json("../../" + fileName)
    .then(function(result) {
        return result;
    });

}

function getChoroplethData() {
    d3.json("../../AllCountries.json")
    .then(function(result) {

        globalThis.allCountriesData = result.choroplethData;
        populationTrend.choroplethData = result.choroplethData;
        populationTrend.choroplethDataIndex = 0;
        populationTrend.currentChoroplethData = populationTrend.choroplethData[populationTrend.choroplethSliderYear];
        drawMap(populationTrend, plotCountry, removeLine);
    })
    .catch(function(error) {
        console.log(error);
        alert("Unable to retrieve data. Kindly check your network connection.");
    });
}