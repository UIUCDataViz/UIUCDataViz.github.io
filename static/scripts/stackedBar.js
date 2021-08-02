function getBarChart(obj, inputData) {
    if(obj.selectedCountryNamesList.length < 10) {
        initializeBarChar(obj, inputData);
        for( var i = 0; i < obj.stackedBarChartYAxis.valueY.length; i++) {
            createSeriesAndBullet(obj, obj.stackedBarChartYAxis.valueY[i]);
        }
    } else {
        alert("Max selection 10 exceeded.");
    }
}

function initializeBarChar(obj, inputData) {
    var index = obj.stackedBarDivAvailableIndex.pop();
    var divName = obj.stackedBarDivName + index;
    var place = obj.addPlace;

    am4core.useTheme(am4themes_animated);

    obj.stackedBarChart[place] = [am4core.create(divName, am4charts.XYChart), index];
    obj.stackedBarChart[place][0].hiddenState.properties.opacity = 0;

    obj.stackedBarChart[place][0].colors.step = 2;
    obj.stackedBarChart[place][0].padding(30, 30, 10, 30);

    obj.stackedBarChart[place][0].data.push(inputData);

    obj.stackedBarChartXAxis.axis = obj.stackedBarChart[place][0].xAxes.push(new am4charts.CategoryAxis());
    obj.stackedBarChartXAxis.axis.dataFields.category = obj.stackedBarChartXAxis.category;

    obj.stackedBarChartXAxis.axis.renderer.grid.template.location = 0;

    obj.stackedBarChartYAxis.axis = obj.stackedBarChart[place][0].yAxes.push(new am4charts.ValueAxis());
    if(obj.stackedBarDivAvailableIndex.length === 9) {
        obj.stackedBarChartYAxis.axis.title.text = obj.stackedBarChartYAxis.title;
    }

    obj.stackedBarChartYAxis.axis.min = 0;
    obj.stackedBarChartYAxis.axis.max = 100;

    obj.stackedBarChartYAxis.axis.strictMinMax = true;
    obj.stackedBarChartYAxis.axis.calculateTotals = true;

    obj.stackedBarChartYAxis.axis.renderer.minWidth = 10;
}

function createSeriesAndBullet(obj, valueY) {
    var place = obj.addPlace;
    var series = obj.stackedBarChart[place][0].series.push(new am4charts.ColumnSeries());

    series.name = valueY;

    series.columns.template.width = am4core.percent(80);
    series.columns.template.tooltipText =
        "{name}: {valueY.totalPercent.formatNumber('#.0')}%";

    series.dataFields.categoryX = obj.stackedBarChartXAxis.category;

    series.dataFields.valueY = valueY;
    series.dataFields.valueYShow = "totalPercent";

    series.dataItems.template.locations.categoryX = 0.5;

    series.stacked = true;
    series.tooltip.pointerOrientation = "vertical";
}

function removeBar(obj) {
    var place = obj.deletePlace;
    if (obj.stackedBarChart[place][0].series.length > 0) {

        var index = obj.stackedBarChart[place][1];
        obj.stackedBarDivAvailableIndex.push(index);
        obj.stackedBarDivAvailableIndex.sort(function(a, b){return b - a});

        obj.stackedBarChart[place][0].dispose();
        delete obj.stackedBarChart[place];

    }
}

function updateBarsAccordingToSliderYear(obj) {
    for(var i =0; i < obj.selectedCountryNamesList.length; i++) {
        var place = obj.selectedCountryNamesList[i];

        obj.deletePlace = place;
        obj.addPlace = place;

        removeBar(obj);
        setUpFertilityCanvasBar(obj.lineChart.data)

    }
}