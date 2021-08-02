function drawLine(obj, inputData) {
    if(obj.selectedCountryNamesList.length < 10) {
        initializeLineChartTheme(obj);

        if(obj.lineChart.data.length === 0) {
            obj.lineChart.data = inputData;
        } else {
            mergeNewDataToLineChartData(obj, inputData)
        }
        addSeries(obj);
    } else {
        alert("Max selection 10 exceeded.");
    }
}

function initializeLineChartTheme(obj) {
    if(obj.lineChart === null) {
        var divName = obj.lineChartDiv;

        am4core.useTheme(am4themes_animated);
        obj.lineChart = am4core.create(divName, am4charts.XYChart);

        obj.lineDateAxis = obj.lineChart.xAxes.push(new am4charts.CategoryAxis());

        obj.lineDateAxis.dataFields.category = obj.lineChartXAxis.category;
        obj.lineDateAxis.title.text = obj.lineChartXAxis.title;

        obj.lineValueAxis = obj.lineChart.yAxes.push(new am4charts.ValueAxis());
        obj.lineValueAxis.title.text = obj.lineChartYAxis.title;

        obj.lineDateAxis.start = 0;
        obj.lineDateAxis.end = 0.5;
        obj.lineDateAxis.keepSelection = true;

        obj.lineChart.cursor = new am4charts.XYCursor();
        obj.lineChart.cursor.behavior = "panXY";
        obj.lineChart.cursor.xAxis = obj.lineDateAxis;
        //chart.cursor.snapToSeries = series;

        obj.lineChart.legend = new am4charts.Legend();

        obj.lineChart.scrollbarY = new am4core.Scrollbar();
        obj.lineChart.scrollbarY.parent = obj.lineChart.leftAxesContainer;
        obj.lineChart.scrollbarY.toBack();

        obj.lineChart.scrollbarX = new am4charts.XYChartScrollbar();
        obj.lineChart.scrollbarX.parent = obj.lineChart.bottomAxesContainer;
    }
}

function addSeries(obj) {

    var series = obj.lineChart.series.push(new am4charts.LineSeries());
    var key = obj.addPlace, color = obj.currentColor;

    series.name = key;
    series.stroke = am4core.color(color);
    series.dataFields.valueY = key;
    series.dataFields.categoryX = obj.lineChartXAxis.category;
    series.tooltipText = "[bold]" + key + "[/]: {" + key + "}";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(color);
    series.tooltip.background.stroke = am4core.color(color);
    series.tooltip.background.strokeWidth = 2;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 35;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;
    obj.lineChart.scrollbarX.series.push(series);
}

function removeLine(obj) {
    key = obj.deletePlace;
    if (obj.lineChart.series.length > 0) {
        var index = obj.selectedCountryNamesList.indexOf(key);

        //remove color and push it to end to reuse
        var color = obj.tenCountryColors.splice(index, 1);
        obj.tenCountryColors.push(color[0]);
        obj.countryColorIndex = obj.countryColorIndex > 0 ? obj.countryColorIndex - 1 : 0;

        obj.lineChart.series.removeIndex(index).dispose();
        obj.selectedCountryNamesList.splice(index, 1);
    } else if (obj.lineChart.series.length === 0) {
        obj.countryColorIndex = 0;
    }
}

function mergeNewDataToLineChartData(obj, newData) {
    var map = new Map();
    obj.lineChart.data.forEach(item => map.set(item.year, item));
    newData.forEach(item => map.set(item.year, {...map.get(item.year), ...item}));
    obj.lineChart.data = Array.from(map.values());
}