$(document).ready(function(){
    var query;
    var startDt;
    var endDt;
    google.charts.load('current', {packages: ['bar','corechart']});
    function drawChart()
    {
        $(document).ready(function()
        {
            var link="http://localhost:5000/report/?query="+query+"&startDt="+startDt+"&endDt="+endDt;
            console.log(link);
            $.ajax({url: link,//"http://localhost:5000/report/?query=school_data&startDt=2019-06-06&endDt=2019-06-07",
            success:function(jsonData)
            {
                var jsonObj = JSON.parse(jsonData);
                if(query=="school_data")
                {
                    
                    
                    var dateLookup = {},  rangeLookup = {};
                    var uniqueDates = [], uniqueRanges = [];
                    for (var item, i = 0;item = jsonObj[i++];) {
                        var date = item.date;
                        if (!(date in dateLookup)) {
                            dateLookup[date] = 1;
                            uniqueDates.push(date);
                        }
                        
                        var range = item.range;
                        if (!(range in rangeLookup)) {
                            rangeLookup[range] = 1;
                            uniqueRanges.push(range);
                        }
                    }
                    console.log(uniqueDates);
                    console.log(uniqueRanges);

                    var responseJson = [];
                    var heading = [];
                    heading.push('Range');
                    for(i = 0; i < uniqueDates.length; i++)
                        heading.push(uniqueDates[i]);
                    console.log(heading);
                    responseJson.push(heading);

                    function getCount(range, date){
                        for (var item, i = 0; item = jsonObj[i++];) {
                            if(item.range == range && item.date == date)
                                return item.count;
                        }
                        return 0;
                    }
                    for (i = 0; i < uniqueRanges.length; i++) {
                        var item = [uniqueRanges[i]];
                        for(j = 0; j < uniqueDates.length; j++){
                            item.push( getCount(uniqueRanges[i], uniqueDates[j],jsonData));
                            console.log(uniqueRanges[i]+" "+uniqueDates[j]+" "+getCount(uniqueRanges[i], uniqueDates[j]));
                        }
                        responseJson.push(item);
                    }

                    console.log(responseJson);

                    
                    var data = google.visualization.arrayToDataTable(responseJson);
                    var options = {
                        chart: {
                        title: 'School Data'
                        //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
                }
                else
                if(query=="school_strength")
                {
                    var responseJson = [];
                    var heading = [];
                    heading.push('School');
                    heading.push('Count');
                    responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var school=[item.unique_id];
                        school.push(item.count);
                        responseJson.push(school);
                    }
                    console.log(responseJson);
                    var data = google.visualization.arrayToDataTable(responseJson);
                    var options = {
                        chart: {
                        title: 'School Strength'
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
                }
            }
            
        })
        })
    }




$("#btn").click(function()
{
    startDt=$("#startDt").val();
    endDt=$("#endDt").val();
    $("#date").css('display','none');
    $("#list").css('display','none');
    $("#chart_div").css('display','block');
    google.charts.setOnLoadCallback(drawChart);
})
$( "#school_data" ).click(function() {
    query="school_data";
    $("#date").css('display','block');
});
$( "#school_strength" ).click(function() {
    query="school_strength";
    $("#date").css('display','block');
});
$( "#user_info" ).click(function() {
    query="user_info";
    $("#date").css('display','block');
});
$( "#daily_quiz_class_subject" ).click(function() {
    query="daily_quiz_class_subject";
    $("#date").css('display','block');
});
$( "#daily_quiz_count" ).click(function() {
    query="daily_quiz_count";
    $("#date").css('display','block');
});
$( "#daily_user_count_quiz" ).click(function() {
    query="daily_user_count_quiz";
    $("#date").css('display','block');
});


})




