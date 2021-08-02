
function drawPyramid()
{
    drawMaleBarChart()
    drawFemaleBarChart()
}

function drawMaleBarChart()
{
    countryName = 'India';
    year = 2020;
    $.ajax(
        {
            type: "POST",
            data: { csrfmiddlewaretoken: "{{ csrf_token }}",   // < here
                'countryName':countryName, 'year':year
            },
            url:"/getMaleData",
            success: function(result)
            {
                data = JSON.parse(result)
                //console.log(data)
                mp = data['maleData']
                console.log(mp)
                //showChart(chartName);
            }
        });
}

function drawFemaleBarChart()
{

}