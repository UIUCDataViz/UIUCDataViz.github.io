const countryNameDict = {};
let jsonData = {};

Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')])
    .then(([tsvData, jsonData1]) => {
        tsvData.forEach(d => {
            jsonData = jsonData1;
            countryNameDict[d.iso_n3] = d.name;
        });
    });

function drawMap(obj, onClickCountry, onUnClickCountry) {
    var  mapDivName = obj.mapDivName,
        mapSliderDivName = obj.mapSliderName,
        fillKey = obj.fillKey;

    mapDiv = document.getElementById(mapDivName);

    var outerWidth  = mapDiv.clientWidth,
        outerHeight = mapDiv.clientHeight;

    var margin = {top: 50, right: 100, bottom: 50, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;
    obj.height = height;

    var svg = d3.select("#" + mapDivName)
        .append("svg")
        .attr("id", "svg" + mapDivName)
        .attr("border",1)
        .attr("width",  width)
        .attr("height", outerHeight-2)
        .attr("transform", "translate(" +  margin.left + "," + 2 + ")");

    var gMap = svg.append("g")
        .attr("id","canvas")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" +  0 + "," + margin.top + ")");

    d3.select('#svg' + mapDivName).call(
        d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-margin.left, -margin.top], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom' , () => {
                gMap.attr("transform",d3.event.transform);
            }));

    var projection = d3.geoNaturalEarth1();
    projection.translate([width / 2, height / 2])
        .scale(160);

    var pathGenerator = d3.geoPath().projection(projection);

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "mapToolTip" + mapDivName)
        .style("opacity", 0);

    d3.select(".sphere." + mapDivName).remove();
    d3.selectAll(".country." + mapDivName).remove();

    gMap.append('path')
        .attr('class', 'sphere ' + mapDivName)
        .attr('d', pathGenerator({type: 'Sphere'}));

    var countries = topojson.feature(jsonData, jsonData.objects.countries);
    gMap.selectAll('path')
        .data(countries.features)
        .enter().append('path')
        .attr('class', 'country ' + mapDivName)
        .attr('d', pathGenerator)
        .attr('stroke', 'white')
        .attr('stroke-width', '1px')
        .style('fill',function(d){
            var selectedCountryName = countryNameDict[d.id];
            var fillKey = getDatabaseCountryName(selectedCountryName);

            return obj.colorScale(fillKey);
        })
        .on('mousedown.log', function (d) {
            var selectedCountryName = countryNameDict[d.id];
            var choroplethCountryName = getDatabaseCountryName(selectedCountryName);

            if(!obj.selectedCountryNamesList.includes(selectedCountryName)
                && (obj.selectedCountryNamesList.length) < 10) {

                var col = obj.countryColorIndex;
                var newColor = obj.tenCountryColors[col];
                obj.countryColorIndex = col + 1;

                d3.select(this).style('fill', newColor);
                onClickCountry(selectedCountryName, newColor);

            } else if(obj.selectedCountryNamesList.includes(selectedCountryName)) {
                obj.deletePlace = selectedCountryName;
                onUnClickCountry(obj);

                var newColor = obj.colorScale(choroplethCountryName);
                d3.select(this).style('fill',newColor);

            } else if(obj.selectedCountryNamesList.length === 10) {
                alert("Max selection 10 exceeded.");
            }
        })
        .append('title')
        .attr('class','countryName ' + mapDivName)
        .text(function(d){
            var selectedCountryName = countryNameDict[d.id];
            var fillKey = getDatabaseCountryName(selectedCountryName);
            var text = obj.currentChoroplethData[fillKey];
            if(text === undefined) {
                text = "No data";
            }
            return(countryNameDict[d.id]+" : " + text)
        });

    initializeChoroplethSlider(obj, mapSliderDivName);
    initializeChoroplethLegend(obj, mapDivName);
    var screenText = document.getElementById("choroplethYear");
    if(screenText !== undefined && screenText !== null) {
        screenText.innerHTML = parseInt(obj.choroplethSliderYear);
    }
}

function updateChoropleth(obj) {
    d3.selectAll(".country."  + obj.mapDivName)
        .style("fill" , function(d){
            var currentColor = this.style.fill;
            var newColor;
            var selectedCountryName = countryNameDict[d.id],
                choroplethCountryName = getDatabaseCountryName(selectedCountryName);

            if(obj.tenCountryColors.includes(currentColor)) {
                newColor = currentColor;
            } else {
                newColor = obj.colorScale(choroplethCountryName);
            }
            return newColor;
        })
        .select(".countryName." + obj.mapDivName)
        .text(function(d){
            var selectedCountryName = countryNameDict[d.id];
            var fillKey = getDatabaseCountryName(selectedCountryName);
            var text = obj.currentChoroplethData[fillKey];
            if(text === undefined) {
                text = "No data";
            }
            return(countryNameDict[d.id]+" : " + text)
        });
}

function getDatabaseCountryName(choroplethCountryName) {
    switch(choroplethCountryName)
    {
        case 'Myanmar':
            choroplethCountryName = 'Burma';
            break;
        case 'Dem. Rep. Congo':
            choroplethCountryName = 'Congo (Kinshasa)';
            break;
        case 'Congo':
            choroplethCountryName = 'Congo (Brazzaville)';
            break;
        case 'Czech Rep.':
            choroplethCountryName = 'Czechia';
            break;
        case 'Bosnia and Herz.':
            choroplethCountryName = 'Bosnia and Herzegovina'
            break;
        case 'N. Cyprus':
            choroplethCountryName = 'Turkey';
            break;
        case 'Palestine':
            choroplethCountryName = 'Gaza Strip';
            break;
        case 'Dem. Rep. Korea':
            choroplethCountryName = 'Korea North';
            break;
        case 'Korea':
            choroplethCountryName = 'Korea South';
            break;
        case 'Lao PDR':
            choroplethCountryName = 'Laos';
            break;
        case 'Central African Rep.':
            choroplethCountryName = 'Central African Republic';
            break;
        case 'S. Sudan':
            choroplethCountryName = 'South Sudan';
            break;
        case 'Eq. Guinea':
            choroplethCountryName = 'Equatorial Guinea';
            break;
        case "Côte d'Ivoire":
            choroplethCountryName = "Cote d'Ivoire";
            break;
        case 'Dominican Rep.':
            choroplethCountryName = "Dominican Republic";
            break;
        case 'Bahamas':
            choroplethCountryName = 'Bahamas The';
            break;
        case 'W. Sahara':
            choroplethCountryName = 'Western Sahara';
            break;
        case 'Gambia':
            choroplethCountryName = 'Gambia The';
            break;
        case 'Solomon Is.':
            choroplethCountryName = 'Solomon Islands';
            break;
    }
    return choroplethCountryName
}

function initializeChoroplethSlider(obj, mapSliderDivName) {
    if(obj.showChoroplethSlider === true) {
        var sliderDiv = document.getElementById(mapSliderDivName);
        var outerWidth  = sliderDiv.clientWidth,
            outerHeight = sliderDiv.clientHeight;

        var margin = {top: 5, right: 100, bottom: 10, left: 100};
        var width = outerWidth - margin.left - margin.right,
            height = outerHeight - margin.top - margin.bottom;

        var svg = d3.select("#" + mapSliderDivName)
            .append("svg")
            .attr("id", "slider")
            .attr("border",1)
            .attr("width",  outerWidth)
            .attr("height", outerHeight);

        var gChoroplethSlider = svg.append("g")
            .attr("id","sliderCanvas"+mapSliderDivName)
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + (height/2 - 10) + ")");

        var choroplethSlider = d3.sliderHorizontal()
            .min(1950)
            .max(2050)
            .step(1)
            .default(obj.choroplethSliderYear)
            .width(width)
            .displayValue(true)
            .on('onchange', val => {
                var screenText = document.getElementById("choroplethYear");
                if(screenText !== undefined && screenText !== null) {
                    screenText.innerHTML = parseInt(val);
                }
                obj.choroplethSliderYear = parseInt(val);
                obj.choroplethDataIndex = obj.choroplethSliderYear - 1950;
                obj.currentChoroplethData = obj.choroplethData[obj.choroplethSliderYear];
                updateChoropleth(obj);
                if(obj.updateLegendTicks === true) {
                    obj.updateLegend();

                    d3.select("#"+obj.mapDivName + 'scale-log-text')
                        .selectAll('text').remove();

                    d3.select("#"+obj.mapDivName + 'scale-log-text')
                        .selectAll('bars').data(obj.mapLegendTicks).enter()
                        .append('text')
                        .text(d => d)
                        .attr('font-family', 'sans-serif')
                        .attr('font-size', '12px')
                        .attr('y', (d, i) => (i * 0.8) * obj.legendWidth + 12)
                        .attr('x', (d, i) => obj.legendWidth )
                        .attr('width', 100)
                        .attr('height', 20)
                        .attr('fill', "white")
                }
            });
        gChoroplethSlider.call(choroplethSlider);
        d3.select("path.handle").attr("fill", "#4242e4")
    }
}

function initializeChoroplethLegend(obj, mapDivName) {
    if(obj.showChoroplethLegend === true) {
        // add the legend now
        var legendFullHeight = obj.height;
        var legendFullWidth = 150;

        var legendMargin = {top: 0, bottom: 20, left: 50, right: 20};

        // use same margins as main plot
        var legendWidth = legendFullWidth - legendMargin.left - legendMargin.right - 30;

        var legendSvg = d3.select("#" + mapDivName)
            .append('svg')
            .attr("id", "chroplethLegendSVG" + mapDivName)
            .attr('width', legendFullWidth)
            .attr('height', legendFullHeight)
            .attr('transform', 'translate(0,' + legendMargin.top + ')')
            .append('g')
            .attr('transform', 'translate(' + 0 + ',' + legendMargin.top + ')');


        legendSvg.append("g")
            .attr('class', 'scale-log-color')
            .attr('transform', 'translate(0, 0)')
            .selectAll('text').data(obj.mapDomain).enter()
            .append('rect')
            .attr('y', (d, i) => (i * 0.8)* legendWidth + 30)
            .attr('x', (d, i) => legendWidth - 50)
            .attr('width', 50)
            .attr('height', 30)
            .attr('fill', (d, i) => obj.mapColors[i]);

        legendSvg.append("g")
            .attr('id', obj.mapDivName + 'scale-log-text')
            .attr('transform', 'translate(0, 0)')
            .selectAll('bars').data(obj.mapLegendTicks).enter()
            .append('text')
            .text(d => d)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '12px')
            .attr('y', (d, i) => (i * 0.8) * legendWidth + 12)
            .attr('x', (d, i) => legendWidth )
            .attr('width', 100)
            .attr('height', 20)
            .attr('fill', "black");

        obj.legendWidth = legendWidth;
    }
}