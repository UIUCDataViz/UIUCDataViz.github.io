

let store = {}

function firstPyramidCall()
{
    store.firstCallMale = true
    store.firstCallFemale = true
    addHtmlElements();
    pyramidSlider();
    drawPyramidChart2('United States');
    getPyramidChoroplethData()
}

function addHtmlElements()
{
    divElement = document.getElementById('pyramidDiv');
    var outerWidth  = divElement.clientWidth,
        outerHeight = divElement.clientHeight;

    var margin = {top: 0, right: 100, bottom: 0, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    divElement = d3.select('#pyramidDiv');
    svg = divElement.append('svg')
        .attr('id','svgPyramid')
        .attr('width',width)
        .attr('height',outerHeight)
        .attr('transform',"translate(" +  margin.left + "," + 2 + ")")
        .attr('border','1');
    store.svg = svg;

    gPyramidPlot = svg.append('g')
        .attr('id','pyramidPlot')
        .attr('width',width)
        .attr('height',height)
        .attr('transform',"translate(" +  margin.left + "," + 2 + ")");

    gPyramidPlotWidth = width;
    gPyramidPlotHeight = height;

    store.gPyramidPlot = gPyramidPlot;
    store.gPyramidPlotWidth = gPyramidPlotWidth;
    store.gPyramidPlotHeight = gPyramidPlotHeight;

    gCountryName = gPyramidPlot
        .append("g")
        .attr('transform','translate('+(width/2 - margin.left)+','+30+')');

    store.gCountryName = gCountryName;

    gCountryName.append('text')
        .attr('id','CountryName')
        .text("United States")

    gLegend = gPyramidPlot
        .append('g')
        .attr('transform','translate(0,0)')

    gMaleLegend = gLegend.append('g')
        .attr('transform','translate('+(0.75*gPyramidPlotWidth)+','+10+')')
    gMaleLegend.append("rect")
        .attr('fill','#0198E1')
        .attr('width',50)
        .attr('height',10);

    gMaleLegend.append('text')
        .attr('id','legendMale')
        .text("Male")
        .attr('transform','translate(60,10)')

    gFemaleLegend = gLegend.append('g')
        .attr('transform','translate('+(0.75*gPyramidPlotWidth)+','+30+')')
    gFemaleLegend.append("rect")
        .attr('fill','#EE6AA7')
        .attr('width',50)
        .attr('height',10)
    gFemaleLegend.append('text')
        .attr('id','legendFemale')
        .text("Female")
        .attr('transform','translate(60,10)')

    gmPyramidPlotWidth = gfPyramidPlotWidth = (gPyramidPlotWidth-200)/2
    gmPyramidPlotHeight = gfPyramidPlotHeight = (gPyramidPlotHeight - 70)
    gmPyramidPlot = gPyramidPlot.append('g')
        .attr('id','maleBarChart')
        .attr('width',gmPyramidPlotWidth)
        .attr('height',gmPyramidPlotHeight)
        .attr('transform','translate(0,50)')
    store.gmPyramidPlot = gmPyramidPlot;
    store.gmPyramidPlotWidth = gmPyramidPlotWidth;
    store.gmPyramidPlotHeight = gmPyramidPlotHeight;

    gfPyramidPlot = gPyramidPlot.append('g')
        .attr('id','femaleBarChart')
        .attr('width',gfPyramidPlotWidth)
        .attr('height',gfPyramidPlotHeight)
        .attr('transform','translate('+ (gmPyramidPlotWidth + 100) +',50)')
    store.gfPyramidPlot = gfPyramidPlot;
    store.gfPyramidPlotWidth = gfPyramidPlotWidth;
    store.gfPyramidPlotHeight = gfPyramidPlotHeight;

    gPlayPause = gPyramidPlot.append('g')
        .attr('id','PlayPause')
        .attr('transform','translate('+(0.75*gPyramidPlotWidth)+','+(gPyramidPlotHeight)+')')


    gLessGreater = gPyramidPlot.append("g")
    textLessGreater = gLessGreater.append("text")
    textLessGreater.attr('id','lessGreater')
        .text("")
        .attr('font-weight','bold')
        .attr('font-size','4em')
        .attr('transform','translate('+(gmPyramidPlotWidth+35)+','+(50)+')')
    store.gLessGreater = gLessGreater
    store.textLessGreater = textLessGreater
}

function pyramidSlider()
{
    var sliderDiv = document.getElementById("pyramidSliderDiv");
    var outerWidth  = sliderDiv.clientWidth,
        outerHeight = sliderDiv.clientHeight;

    var margin = {top: 5, right: 100, bottom: 10, left: 100};
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom;

    startYear = 2000
    store.currentYear = 2000
    endYear = 2050

    var gPyramidPlot = d3.select("#pyramidSliderDiv")
        .append("svg")
        .attr("id", "pyramidSlider")
        .attr("border",1)
        .attr("width",  outerWidth)
        .attr("height", outerHeight);

    gSlider = gPyramidPlot
        .append('g')
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + (height/2) + ")");


    slider = d3
        .sliderHorizontal()
        .min(startYear)
        .max(endYear)
        .step(1)
        .width(width)
        .displayValue(true)
        .on('end', val => {
            store.currentYear = parseInt(val);
            drawPyramidChart2(store.countryName);
        });
    store.slider = slider;
    gSlider.call(slider);

    d3.select("path.handle").attr("fill", "#4242e4")
}

function emptyPyramid()
{
    drawPyramid()
}

function drawPyramidChart2(countryName)
{
    store.countryName = countryName
    firstCallMale = store.firstCallMale
    firstCallFemale = store.firstCallFemale

    tooltip = store.tooltip;
    d3.select("#CountryName").text(countryName);
    svg = store.svg; //d3.select("#svgPyramid")

    gPyramidPlot = store.gPyramidPlot  // d3.select("#pyramidPlot");
    gPyramidPlotWidth = store.gPyramidPlotWidth  //document.getElementById("pyramidPlot").getBoundingClientRect().width;
    //console.log("This is width "+gPyramidPlotWidth)
    gPyramidPlotHeight = store.gPyramidPlotHeight //document.getElementById("pyramidPlot").getBoundingClientRect().height;
    //console.log("This is height "+gPyramidPlotHeight)

    gmPyramidPlot = store.gmPyramidPlot //d3.select("#maleBarChart")
    gmPyramidPlotWidth = store.gmPyramidPlotWidth //document.getElementById("maleBarChart").getBoundingClientRect().width;
    gmPyramidPlotHeight = store.gmPyramidPlotHeight //document.getElementById("maleBarChart").getBoundingClientRect().height;

    gfPyramidPlot = store.gfPyramidPlot //d3.select("#femaleBarChart")
    gfPyramidPlotWidth = store.gfPyramidPlotWidth //document.getElementById("femaleBarChart").getBoundingClientRect().width;
    gfPyramidPlotHeight = store.gfPyramidPlotHeight //document.getElementById("maleBarChart").getBoundingClientRect().height;

    gLessGreater = store.gLessGreater
    textLessGreater = store.textLessGreater

    // Male Bar Chart
    d3.select('#gmxAxis').remove();
    let gmxAxis = gmPyramidPlot.append('g')
        .attr('id','gmxAxis')

    let gmyAxis = gmPyramidPlot.append('g')
        .attr('id','gmyAxis')

    d3.select('#gfxAxis').remove();
    let gfxAxis = gfPyramidPlot.append('g')
        .attr('id','gfxAxis')

    let gfyAxis = gfPyramidPlot.append('g')
        .attr('id','gfyAxis')

    yr = store.currentYear;
    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here
                'country':countryName, 'year':yr
            },
            url:"/getMaleData",
            success: function(result)
            {
                maleData = JSON.parse(result).maleData
                $.ajax(
                    {
                        type: "POST",
                        data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here
                            'country':countryName, 'year':yr
                        },
                        url:"/getFemaleData",
                        success: function(result)
                        {
                            femaleData = JSON.parse(result).femaleData

                            maxMalePopulation = d3.max(maleData, function(d){
                                return d.population
                            })
                            //console.log("Max male population : "+maxMalePopulation)

                            maxFemalePopulation = d3.max(femaleData, function(d){
                                return d.population
                            })
                            //console.log("Max female population : "+maxFemalePopulation)

                            if(maxMalePopulation>maxFemalePopulation)
                            {
                                maxValueXAxis = maxMalePopulation
                            }
                            else
                            {
                                maxValueXAxis = maxFemalePopulation
                            }

                            //Male Bar Chart
                            var mxScale = d3.scaleLinear()
                                //.range([margin.left, maleChartWidth])
                                .range([0,gmPyramidPlotWidth])
                                .domain([0, maxValueXAxis]);
                            /*maxMalePopulation = d3.max(maleData, function(d){
                                return d.population
                            })
                            console.log("Max male population : "+maxMalePopulation)*/

                            var mxScaleInverted = d3.scaleLinear()
                                .range([gmPyramidPlotWidth,0])
                                .domain([0, maxValueXAxis])


                            var myScale = d3.scaleLinear()
                                .range([gmPyramidPlotHeight,0])
                                .domain([0, d3.max(maleData, function (d) {
                                    return d.age;
                                })]);

                            let mxAxis = d3.axisBottom(mxScaleInverted).ticks(4);
                            let myAxis = d3.axisRight(myScale);

                            var bars = gmPyramidPlot.selectAll(".bar")
                                .remove()
                                .exit()
                                .data(maleData)
                                .enter()
                                .append("g")

                            //append rects
                            bars.append("rect")
                                .attr('id',function(d){
                                    return "m"+d.age
                                })
                                .attr("class", "bar")
                                .attr('fill','#0198E1')
                                .attr("y", function (d) {
                                    return myScale(d.age);
                                })
                                .attr("height", 3)
                                .attr("x", function(d) {
                                    return gmPyramidPlotWidth-mxScale(d.population)
                                })
                                .attr("width", function (d) {
                                    return mxScale(d.population);
                                })
                                .on("mouseover",function(d){
                                    //console.log(d)
                                    this.style.fill="black"
                                    d3.select("#f"+d.age)
                                        .attr("fill","black")

                                    mWidth = parseInt(d3.select("#m"+d.age).attr('width'))
                                    fWidth = parseInt(d3.select("#f"+d.age).attr('width'))

                                    gLessGreater
                                        .attr('transform','translate('+(0)+','+(myScale(d.age))+')')
                                    if(mWidth>fWidth)
                                    {
                                        textLessGreater.text('>')
                                    }
                                    else
                                    {
                                        textLessGreater.text('<')
                                    }
                                })
                                .on("mouseout",function(d){
                                    this.style.fill="#0198E1"
                                    d3.select("#f"+d.age)
                                        .attr("fill","#EE6AA7")
                                    textLessGreater.text('')
                                }).append('title')
                                .attr('class','countryName')
                                .text(function(d){
                                    return("Population : "+d.population + "\n Age: " + d.age)
                                });

                            gmxAxis.call(mxAxis).attr('transform','translate('+0+','+gmPyramidPlotHeight+')')
                            if(firstCallMale)
                            {
                                gmyAxis.call(myAxis).attr('transform','translate('+(gmPyramidPlotWidth)+',0)')
                                store.firstCallMale = false
                            }

                            // female bar chart
                            var fxScale = d3.scaleLinear()
                                .range([0,gfPyramidPlotWidth])
                                //.range([width, 0])
                                .domain([0, maxValueXAxis])

                            var fyScale = d3.scaleLinear()
                                .range([gfPyramidPlotHeight,0])
                                .domain([0, d3.max(femaleData, function (d) {
                                    return d.age;
                                })]);

                            let fxAxis = d3.axisBottom(fxScale).ticks(4);
                            let fyAxis = d3.axisLeft(fyScale);

                            var bars = gfPyramidPlot.selectAll(".bar")
                                .remove()
                                .exit()
                                .data(femaleData)
                                .enter()
                                .append("g")

                            //append rects
                            bars.append("rect")
                                .attr('id',function(d){
                                    return "f"+d.age
                                })
                                .attr("class", "bar")
                                .attr('fill','#EE6AA7')
                                .attr("y", function (d) {
                                    return fyScale(d.age);
                                })
                                .attr("height", 3)
                                .attr("width", function (d) {
                                    return fxScale(d.population);
                                })
                                .on("mouseover",function(d){
                                    //console.log(d)
                                    this.style.fill="black"
                                    d3.select("#m"+d.age)
                                        .attr("fill","black")
                                    mWidth = parseInt(d3.select("#m"+d.age).attr('width'))
                                    fWidth = parseInt(d3.select("#f"+d.age).attr('width'))
                                    gLessGreater
                                        .attr('transform','translate('+(0)+','+(fyScale(d.age))+')')
                                    if(mWidth>fWidth)
                                    {
                                        textLessGreater.text('>')
                                    }
                                    else
                                    {
                                        textLessGreater.text('<')
                                    }
                                })
                                .on("mouseout",function(d){
                                    this.style.fill="#EE6AA7"
                                    d3.select("#m" + d.age)
                                        .attr("fill","#0198E1");
                                    textLessGreater.text("")
                                })
                                .append('title')
                                .attr('class','countryName')
                                .text(function(d){
                                    return("Population : "+d.population + "\n Age: " + d.age)
                                });

                            gfxAxis.call(fxAxis).attr('transform','translate('+0+','+gfPyramidPlotHeight+')')
                            if(firstCallFemale)
                            {
                                gfyAxis.call(fyAxis).attr('transform','translate('+(0)+',0)')
                                store.firstCallFemale = false
                            }

                        }
                    });
            }
        });
}