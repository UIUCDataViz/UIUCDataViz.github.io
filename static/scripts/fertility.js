var fertilityTrend = {
    countryColorIndex: 0,
    worldContinentColors: {
        'World': '#67b7dc',
        'Asia': '#845EC2',
        'Africa': '#D65DB1',
        'North America': '#F26430',
        'South America': '#007f01',
        'Europe': '#FFC73F',
        'Oceania': '#473198'},
    tenCountryColors: [
        'rgb(253, 234, 69)', 'rgb(143, 13, 164)', 'rgb(202, 186, 106)', 'rgb(206, 18, 86)',
        'rgb(231, 41, 138)', 'rgb(213, 121, 186)', 'rgb(181, 222, 43)', 'rgb(65, 174, 118)',
        'rgb(35, 139, 69)', 'rgb(0, 88, 36)'],

    selectedData: {},
    selectedCountryNamesList: [],
    choroplethData: {},
    choroplethDataIndex: 0,
    choroplethSliderYear: 2010,
    lineChart: null,
    lineDateAxis: null,
    lineValueAxis: null,
    lineChartXAxis: {
        category: 'year',
        title: 'Year'},
    lineChartYAxis: {
        title: 'Total Fertility Rate per 1000 women.'
    },
    lineChartDiv: 'lineChartDiv',
    showChoroplethLegend: true,
    showChoroplethSlider: true,
    deletePlace: "",
    currentColor: "",
    addPlace: "",
    fillKey: "",
    mapDivName: 'fertilityMapDiv',
    mapSliderName:'fertilityMapSliderDiv',
    mapColors: d3.schemeRdBu[8],
    mapDomain: [0, 'fertility_rate_15_19', 'fertility_rate_20_24', 'fertility_rate_25_29', 'fertility_rate_30_34',
        'fertility_rate_35_39', 'fertility_rate_40_44', 'fertility_rate_45_49'],
    mapLegendTicks: ["Age: frequency:", 'no-data', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'],
    updateLegendTicks: true,
    updateLegend: updateTicksForFertility,
    stackedBarChart: {},
    stackedBarDivName: 'stackedBarDiv',
    stackedBarChartXAxis: {
        category: 'Place',
        title: 'Country'},
    stackedBarChartYAxis: {
        title: 'Fertility Rates in different ages.',
        valueY: ['15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49']
    },
    stackedBarDivAvailableIndex: [9,8,7,6,5,4,3,2,1,0],
};

fertilityTrend.colorScale = function(fillKey) {
    var categories = fertilityTrend.mapDomain;
    var category = fertilityTrend.currentChoroplethData[fillKey];
    if(category === undefined) {
        category = 0;
    }
    return fertilityTrend.mapColors[categories.indexOf(category)];
};

function setContinentButtonFunctionalityForFertility() {
    $(".form-check .button_continent.button_fertility").click(function(){

        var idOfSelectedItem = (this.id);
        if(!fertilityTrend.selectedCountryNamesList.includes(idOfSelectedItem)
            && (fertilityTrend.selectedCountryNamesList.length)<10) {

            if(idOfSelectedItem === "World") {
                getWorldDataForFertility()
            } else {
                getContinentDataForFertility(idOfSelectedItem)
            }
        } else if(fertilityTrend.selectedCountryNamesList.includes(idOfSelectedItem)) {
            fertilityTrend.deletePlace = idOfSelectedItem;

            unClickCountryFertility(fertilityTrend);
        } else if(fertilityTrend.selectedCountryNamesList.length === 10) {
            alert("Max selection 10 exceeded.");
        }
    });
}

function getWorldDataForFertility() {
    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}"},
            url:"/fertilityWorld",
            success: function(result) {
                var data = JSON.parse(result).cp.fertilityList;

                fertilityTrend.fillKey = "World";
                fertilityTrend.currentColor = fertilityTrend.worldContinentColors["World"];
                fertilityTrend.addPlace = "World";

                setUpFertilityCanvasBar(data);
                drawLine(fertilityTrend, data);
                fertilityTrend.selectedCountryNamesList.push("World");
            },
            failure: function (error) {
                alert("Unable to retrieve data. Kindly check your network connection.");
            }
        });
}

function getContinentDataForFertility(continentName) {
    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}",
                'continent':continentName
            },
            url:"/fertilityContinent",
            success: function(result) {
                var data = JSON.parse(result).cp.fertilityList;

                fertilityTrend.fillKey = continentName;
                fertilityTrend.currentColor = fertilityTrend.worldContinentColors[continentName];
                fertilityTrend.addPlace = continentName;

                setUpFertilityCanvasBar(data);
                drawLine(fertilityTrend, data);
                fertilityTrend.selectedCountryNamesList.push(continentName);
            },
            failure: function (error) {
                alert("Unable to retrieve data. Kindly check your network connection.");
            }
        });
}

function getCountryDataForFertility(countryName, color) {
    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}",
                'country':countryName
            },
            url:"/fertilityCountry",
            success: function(result) {
                var data = JSON.parse(result).cp.fertilityList;

                fertilityTrend.fillKey = countryName;
                fertilityTrend.currentColor = color;
                fertilityTrend.addPlace = countryName;

                setUpFertilityCanvasBar(data);
                drawLine(fertilityTrend, data, countryName, color);
                fertilityTrend.selectedCountryNamesList.push(countryName);
            },
            failure: function (error) {
                alert("Unable to retrieve data. Kindly check your network connection.");
            }
        });
}

function setUpFertilityChoropleth() {
    $.ajax({
        url:"/showFertilityChoroplethData",
        success: function(result) {
            fertilityTrend.choroplethData = JSON.parse(result).choroplethData;
            fertilityTrend.choroplethDataIndex = 0;
            fertilityTrend.currentChoroplethData = fertilityTrend.choroplethData[fertilityTrend.choroplethSliderYear];
            updateTicksForFertility();
            drawMap(fertilityTrend, getCountryDataForFertility, unClickCountryFertility);
        },
        failure: function (error) {
            alert("Unable to retrieve data. Kindly check your network connection.");
        }
    });
}

function updateTicksForFertility() {
    var ticks = ['no-data', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49'];
    for (var i = 1; i < ticks.length; i++) {
        fertilityTrend.mapLegendTicks[i + 1] = ticks[i] + " : "
            + fertilityTrend.currentChoroplethData.legend[fertilityTrend.mapDomain[i]]
    }
}

function unClickCountryFertility(obj) {
    removeBar(obj);
    removeLine(obj);
}

function setUpFertilityCanvasBar(data) {
    var spiralData = data.filter(d => d.year === fertilityTrend.choroplethSliderYear);
    if(spiralData[0] !== undefined ||
    spiralData[0] !== null || spiralData[0] !== {}) {
        getBarChart(fertilityTrend, spiralData[0]);
    }
}

