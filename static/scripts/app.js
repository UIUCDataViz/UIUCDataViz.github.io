showPage('templates/populationTrend.html', initializePopulationTrends);

function initializePopulationTrends() {
    document.getElementById("frmHome").style.height = "1600px";
    document.getElementsByClassName("button_continent")
         .forEach(item => item.className = "btn btn-light button_continent");

    document.getElementById("World").className = "btn btn-light button_continent active";

    setContinentButtonFunctionalityForPopulation();

    plotWorld(populationTrend);
    getChoroplethData(1950);
}

function showPage(pageName, successCallback) {
    clearAllCharts();
    $("#divSelect").load(pageName, successCallback);
}

function clearAllCharts() {
    var trends = [fertilityTrend, populationTrend, mortalityTrend];

    for (var i = 0; i< trends.length; i++) {
        trend = trends[i];
        trend.lineChart = null;
        trend.selectedCountryNamesList = [];
        trend.countryColorIndex = 0;
        trend.selectedData = {};
        trend.choroplethData = {};
        trend.choroplethDataIndex = 0;
        trend.currentChoroplethData = {};
        trend.lineDateAxis = null;
        trend.lineValueAxis = null;
        trend.deletePlace =  "";
        trend.currentColor = "";
        trend.addPlace = "World";
        trend.fillKey = "";
        trend.spiralChart = null;
        trend.stackedBarChart = {};
        trend.stackedBarDivAvailableIndex = [9,8,7,6,5,4,3,2,1,0];
    }
}