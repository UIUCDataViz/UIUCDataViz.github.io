var mortalityTrend = {
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
        'rgb(196, 166, 157)', 'rgb(198, 224, 255)', 'rgb(244, 93, 1)', 'rgb(84, 56, 220)',
        'rgb(181, 107, 69)', 'rgb(255, 159, 178)', 'rgb(143, 57, 133)', 'rgb(231, 29, 54)',
        'rgb(33, 41, 92)', 'rgb(106, 1, 54)'],
    selectedData: {},
    selectedCountryNamesList: [],
    choroplethData: {},
    choroplethDataIndex: 0,
    choroplethSliderYear: 1950,
    currentChoroplethData: {},
    lineChart: null,
    lineDateAxis: null,
    lineValueAxis: null,
    lineChartXAxis: {
        category: 'year',
        title: 'Year'},
    lineChartYAxis: {
        title: 'Total Infant Mortality Rate per 1000 infants under age 5.'
    },
    showChoroplethLegend: false,
    showChoroplethSlider: false,
    deletePlace: "",
    currentColor: "",
    addPlace: "",
    fillKey: "",
    mapDivName: 'mortalityMapDiv',
    mapSliderName:''
};