console.log("Hi");
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart()
{
    let jsonData=$(document).ready(function(){
        $.ajax({url: "http://localhost:5000/report/?query=school_data&startDt=2019-06-06&endDt=2019-06-07",
        success:function(jsonData)
        {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'range');
            data.addColumn('number', 'count');
            for (var i = 0; i < jsonData.length; i++) {
                data.addRow([jsonData[i].range, jsonData[i].count]);
            }
            var options = {
                'title': 'Visualized Data...'//,
                //'is3D': true
            };
            var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    })
    })
    //let data = new google.visualization.DataTable(jsonData);
   // console.log(data);
    //var data = new google.visualization.DataTable();
    // data.addColumn('string', 'Topping');
    // data.addColumn('number', 'Slices');
    // data.addRows([
    //     ['Mushrooms', 3],
    //     ['Onions', 1],
    //     ['Olives', 1], 
    //     ['Zucchini', 1],
    //     ['Pepperoni', 2]
    // ]);

//     var options = {'title':'Visualized Data...',
//                     'width':400,
//                     'height':240,
//                     'is3D':true};

//     var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//     chart.draw(data, options);
// 
}

