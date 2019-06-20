$(document).ready(function(){
    var query;
    var startDt;
    var endDt;
    google.charts.load('current', {packages: ['bar','corechart','table']});
    function drawChart()
    {
        $(document).ready(function()
        {
            var link=`http://localhost:5000/report/${query}?startDt=${startDt}&endDt=${endDt}`;
            console.log(link);
            $.ajax({url: link,//"http://localhost:5000/report/school_data?startDt=2019-06-06&endDt=2019-06-07",
            success:function(jsonData)
            {
                var jsonObj = JSON.parse(jsonData);
                console.log(jsonData);
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
                        title: 'No. of Schools in specific range '
                        //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
                }
                else
                if(query=="school_strength")
                {
                    $("#title").css('display','block');
                    $("#title").html('No of users per School')
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    
                    data.addColumn('string','School');
                    data.addColumn('number','Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.unique_id];
                        temp.push(item.count);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
                }
                else
                if(query=="user_info")
                {
                    $("#title").css('display','block');
                    $("#title").html('Session and activity logs')
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    
                    data.addColumn('string','UUID');
                    data.addColumn('string','Role Name')
                    data.addColumn('string','School Name')
                    data.addColumn('string','Class Name')
                    data.addColumn('number','Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.UUID];
                        temp.push(item.role_name);
                        temp.push(item.school_name);
                        temp.push(item.class_name);
                        temp.push(item.count);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
                }
                else if(query=="daily_quiz_class_subject")
                {
                    $("#title").css('display','block');
                    $("#title").html('No. of quizzes (on the basis of class and subject)');
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    data.addColumn('string','Class Name')
                    data.addColumn('string','Subject Name')
                    data.addColumn('number','Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.className];
                        temp.push(item.subjectName);
                        temp.push(item.count);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
                }
                else if(query=="daily_quiz_count")
                {
                    var responseJson = [];
                    var heading = [];
                    heading.push('Date');
                    heading.push('Count');
                    console.log(heading);
                    responseJson.push(heading);

                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.date];
                        temp.push(item.count);
                        responseJson.push(temp);
                    }

                    console.log(responseJson);

                    
                    var data = google.visualization.arrayToDataTable(responseJson);
                    var options = {
                        chart: {
                        title: 'No. of Quizzes'
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
                }
                else if(query=="daily_user_class_subject")
                {
                    $("#title").css('display','block');
                    $("#title").html('No. of users (on the basis of class and subject)');
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    data.addColumn('string','Class Name')
                    data.addColumn('string','Subject Name')
                    data.addColumn('number','Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.className];
                        temp.push(item.subjectName);
                        temp.push(item.count);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
                }
                else if(query=="daily_users_count_quiz")
                {
                    var responseJson = [];
                    var heading = [];
                    heading.push('Date');
                    heading.push('Count');
                    console.log(heading);
                    responseJson.push(heading);

                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.date];
                        temp.push(item.count);
                        responseJson.push(temp);
                    }

                    console.log(responseJson);

                    
                    var data = google.visualization.arrayToDataTable(responseJson);
                    var options = {
                        chart: {
                        title: 'No. of users playing quiz '
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
                }
                else if(query=="quiz_played_per_user")
                {
                    $("#title").css('display','block');
                    $("#title").html('No. of quizzes played per user');
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    data.addColumn('string','User Id')
                    data.addColumn('string','User Name')
                    data.addColumn('string','Class Name')
                    data.addColumn('string','Subject Name')
                    data.addColumn('number','Quiz Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.user];
                        temp.push(item.userName);
                        temp.push(item.className);
                        temp.push(item.subjectName);
                        temp.push(item.quiz_count);

                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
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

$( "#daily_user_class_subject" ).click(function() {
    query="daily_user_class_subject";
    $("#date").css('display','block');
});

$( "#daily_users_count_quiz" ).click(function() {
    query="daily_users_count_quiz";
    $("#date").css('display','block');
});

$( "#quiz_played_per_user" ).click(function() {
    query="quiz_played_per_user";
    $("#date").css('display','block');
});

})




