
var selectedCountryNamesList = []; // List will either be empty or have single country
var choroplethSlider;
var choroplethSliderYear = 2000;
var choroplethSliderAge = 0;
var selectedCountryRatio = 100;

function getColor(ratio)
{
    if(ratio === -1) return 'rgb(108,123,139)';
    else if (ratio<80) return 'rgb(199,21,133)';
    else if (ratio<99.5) return 'rgb(238,106,167)';
    else if (ratio<100.5) return 'rgb(171,130,255)';
    else if (ratio<120) return 'rgb(1,152,225)';
    else return 'rgb(2,118,253)';
}

function getPyramidChoroplethData()
{

    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here 
                'year':2020,
                'age':23
            },
            url:"/getPyramidChoroplethData",
            success: function(result)
            {
                pyramidChoroplethData = JSON.parse(result).pyramidChoroplethData;
                drawPyramidMap();
            }
        }
    );
}

function drawPyramidMap()
{
    var mapDivName = "choroplethDiv",

        mapDiv = document.getElementById(mapDivName);

    var outerWidth  = mapDiv.clientWidth,
        outerHeight = mapDiv.clientHeight;

    var margin = {top: 50, right: 100, bottom: 50, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    var svg = d3.select("#" + mapDivName)
        .append("svg")
        .attr("id", "svg" + mapDivName)
        .attr("border",1)
        .attr("width",  width)
        .attr("height", outerHeight-2)
        .attr("transform", "translate(" +  margin.left + ", 0)");

    var gMap = svg.append("g")
        .attr("id","canvas")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" +  margin.left + "," + 2 + ")");

    d3.select('#svg' + mapDivName).call(
        d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent([[-margin.left, -margin.top], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom' , () => {
                gMap.attr("transform",d3.event.transform);
            }));

    const projection = d3.geoNaturalEarth1();
    projection.translate([width / 2, height / 2]).scale(160);

    const pathGenerator = d3.geoPath().projection(projection);

    d3.select(".sphere" + mapDivName).remove();
    d3.selectAll(".country" + mapDivName).remove();

    gMap.append('path')
        .attr('class', 'sphere' + mapDivName)
        .attr('d', pathGenerator({type: 'Sphere'}));

    console.log("choropleth");
    const countries = topojson.feature(jsonData, jsonData.objects.countries);

    gMap.selectAll('path').data(countries.features)
        .enter().append('path')
        .attr('class', 'country' + mapDivName)
        .attr('d', pathGenerator)
        .style('fill',function(d){
            selectedCountryName = countryNameDict[d.id];
            choroplethCountryName = getDatabaseCountryName(selectedCountryName);
            d.ratio = pyramidChoroplethData[choroplethCountryName];
            if(d.ratio==undefined) {d.ratio=100;}
            return getColor(d.ratio)
        })
        .on('mousedown.log', function (d) {
            selectedCountryName = countryNameDict[d.id];
            choroplethCountryName = getDatabaseCountryName(selectedCountryName);
            //console.log(choroplethCountryName)
            currentColor = this.style.fill;
            if(currentColor=='white')
            {
                d3.select(this).style('fill',getColor(d.ratio))
                selectedCountryNamesList = []
                emptyPyramid();
            }
            else
            {
                d3.select(this).style('fill','white');
                oldThis = selectedCountryNamesList[0]
                oldRatio = selectedCountryRatio
                d3.select(oldThis).style('fill',getColor(oldRatio))
                selectedCountryNamesList[0]=this
                selectedCountryRatio = d.ratio
                console.log(choroplethCountryName)
                drawPyramidChart2(choroplethCountryName)
            }
        })
        .append('title')
        .attr('class','countryName')
        .text(function(d){
            return(countryNameDict[d.id]+"\n"+d.ratio)
        });

    initializePyramidChoroplethYearSlider();
    initializePyramidChoroplethAgeSlider();
    initializePyramidLegend();
}

function updatePyramidChoroplpeth()
{
    var mapDivName = "choroplethDiv";
    d3.selectAll(".country" + mapDivName)
        .style("fill" , function(d){
            //console.log(d.id);
            currentColor = this.style.fill;
            selectedCountryName = countryNameDict[d.id];
            console.log(selectedCountryName)
            choroplethCountryName = getDatabaseCountryName(selectedCountryName);
            // d.population = currentChoroplethData[choroplethCountryName];
            //if(d.population==undefined) {d.population=0;}
            d.ratio = pyramidChoroplethData[choroplethCountryName];
            if(d.ratio==undefined) {
                d.ratio=-1;
            }
            newColor = (currentColor=='white')?'white':getColor(d.ratio);
            return newColor;
        })
        .select(".countryName")
        .text(function(d){

            return(countryNameDict[d.id]+"\n"+d.ratio)
        })
    //.text(d=>countryNameDict[d.id]+" : "+d.population)
}

function getDatabaseCountryName(choroplethCountryName)
{
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

function initializePyramidChoroplethYearSlider()
{
    var sliderDiv = document.getElementById("Choropleth_Year_Slider");
    var outerWidth  = sliderDiv.clientWidth,
        outerHeight = sliderDiv.clientHeight;

    var margin = {top: 5, right: 100, bottom: 10, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    gChoroplethSlider = d3.select("#Choropleth_Year_Slider").append("svg")
        .attr("id", "pyramidSlider")
        .attr("border",1)
        .attr("width",  outerWidth)
        .attr("height", outerHeight)
        .append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + (height/2) + ")");

    choroplethSlider = d3
        .sliderHorizontal()
        .min(2000)
        .max(2050)
        .step(1)
        .width(width)
        .displayValue(true)
        .on('end', val => {
            choroplethSliderYear = parseInt(val);
            console.log(choroplethSliderYear)

            $.ajax(
                {
                    type: "POST",
                    data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here
                        'year':choroplethSliderYear,
                        'age':choroplethSliderAge
                    },
                    url:"/getPyramidChoroplethData",
                    success: function(result)
                    {
                        pyramidChoroplethData = JSON.parse(result).pyramidChoroplethData;
                        //console.log(pyramidChoroplethData['India']);
                        /*choroplethDataIndex = 0;
                        currentChoroplethData = choroplethData[choroplethSliderYear];
                        //console.log(currentChoroplethData);*/
                        updatePyramidChoroplpeth();
                    }
                }
            );
        });
    gChoroplethSlider.call(choroplethSlider);
}

function initializePyramidLegend(){
    var colorDomain = ['Sex ratio:','No Data', '< 80', '80 - 99.5', '99.5 - 100.5', '100.5 - 120', '> 120'];
    var legendFullHeight = 400, mapDivName="choroplethDiv";
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
        .selectAll('text').data([-1, 79, 99, 100, 101, 120]).enter()
        .append('rect')
        .attr('y', (d, i) => (i * 0.8)* legendWidth + 30)
        .attr('x', (d, i) => legendWidth - 50)
        .attr('width', 50)
        .attr('height', 30)
        .attr('fill', (d, i) => getColor(d));

    legendSvg.append("g")
        .attr('id', mapDivName + 'scale-log-text')
        .attr('transform', 'translate(0, 0)')
        .selectAll('bars').data(colorDomain).enter()
        .append('text')
        .text(d => d)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('y', (d, i) => (i * 0.8) * legendWidth + 12)
        .attr('x', (d, i) => legendWidth )
        .attr('width', 100)
        .attr('height', 20)
        .attr('fill', "black");
}

function initializePyramidChoroplethAgeSlider()
{

    var sliderDiv = document.getElementById("Choropleth_Age_Slider");

    var outerWidth  = sliderDiv.clientWidth,
        outerHeight = sliderDiv.clientHeight;

    var margin = {top: 5, right: 100, bottom: 10, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    gChoroplethSlider = d3.select("#Choropleth_Age_Slider")
        .append("svg")
        .attr("id", "pyramidSlider")
        .attr("border",1)
        .attr("width",  outerWidth)
        .attr("height", outerHeight)
        .append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + (height/2) + ")");

    choroplethSlider = d3
        .sliderHorizontal()
        .min(0)
        .max(100)
        .step(1)
        .width(width)
        .displayValue(true)
        .on('end', val => {
            choroplethSliderAge = parseInt(val);
            $.ajax(
                {
                    type: "POST",
                    data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here
                        'year':choroplethSliderYear,
                        'age':choroplethSliderAge
                    },
                    url:"/getPyramidChoroplethData",
                    success: function(result)
                    {
                        pyramidChoroplethData = JSON.parse(result).pyramidChoroplethData;
                        updatePyramidChoroplpeth();
                    }
                }
            );

        });
    gChoroplethSlider.call(choroplethSlider);
}


function addPyramidCountry(countryName)
{
    //sliderEnd.value(2000);
    selectedCountryNamesList.push(countryName);
}

function removePyramidCountry(countryName) // removes country from selected list
{
    let i=0;
    let noe = selectedCountryNamesList.length;
    for(i=0;i<noe;i++)
    {
        console.log(selectedCountryNamesList[i]);
        if((selectedCountryNamesList[i].localeCompare(countryName))==0)
        {
            selectedCountryNamesList.splice(i,1);
            break;
        }
    }
    console.log(selectedCountryNamesList)
}
