$(document).ready(function(){
    var query;
    var startDt;
    var endDt;
    var startMonth;
    var endMonth;
    google.charts.load('current', {packages: ['bar','corechart','table']});
    function drawChart()
    {
        $(document).ready(function()
        {
            if(query=="school_range")
            {
                var link=`http://localhost:5000/report/${query}?startMonth=${startMonth}&endMonth=${endMonth}`
            }
            else
            {
                var link=`http://localhost:5000/report/${query}?startDt=${startDt}&endDt=${endDt}`;
            }
            console.log(link);
            $.ajax({url: link,//"http://localhost:5000/report/school_range?startMonth=2019-04&endMonth=2019-06",
            success:function(jsonData)
            {
                console.log(jsonData);
                var jsonObj = JSON.parse(jsonData);
                console.log(jsonData);
                if(query=="school_range")
                {
                    var monthLookup = {},  rangeLookup = {};
                    var uniqueMonths = [], uniqueRanges = [];
                    for (var item, i = 0;item = jsonObj[i++];) {
                        var month = item.month;
                        if (!(month in monthLookup)) {
                            monthLookup[month] = 1;
                            uniqueMonths.push(month);
                        }
                        
                        var range = item.type;
                        if (!(range in rangeLookup)) {
                            rangeLookup[range] = 1;
                            uniqueRanges.push(range);
                        }
                    }
                    console.log(uniqueMonths);
                    console.log(uniqueRanges);

                    var responseJson = [];
                    var heading = [];
                    heading.push('Range');
                    for(i = 0; i < uniqueMonths.length; i++)
                        heading.push(uniqueMonths[i]);
                    console.log(heading);
                    responseJson.push(heading);

                    function getCount(range, month){
                        for (var item, i = 0; item = jsonObj[i++];) {
                            if(item.type == range && item.month == month)
                                return item.count;
                        }
                        return 0;
                    }
                    for (i = 0; i < uniqueRanges.length; i++) {
                        var item = [uniqueRanges[i]];
                        for(j = 0; j < uniqueMonths.length; j++){
                            item.push( getCount(uniqueRanges[i], uniqueMonths[j],jsonData));
                            console.log(uniqueRanges[i]+" "+uniqueMonths[j]+" "+getCount(uniqueRanges[i], uniqueMonths[j]));
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
                        var temp=[item.school_name];
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
                    data.addColumn('number', 'Time Spent')
                    data.addColumn('number','Count');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.UUID];
                        temp.push(item.role_name);
                        temp.push(item.school_name);
                        temp.push(item.class_name);
                        temp.push(item.count);
                        temp.push(item.time_spent);
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
                else if(query=="daily_time_spent_user_quiz")
                {
                    $("#title").css('display','block');
                    $("#title").html('Time Spent per User');
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    data.addColumn('string','User Id')
                    data.addColumn('number','Time');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.uuid];
                        temp.push(item.timeTaken);

                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
                }
                else if(query=="daily_time_per_user_class_subject")
                {
                    $("#title").css('display','block');
                    $("#title").html('Time Spent per User(on the basis of class and subject)');
                    var data = new google.visualization.DataTable();
                    var responseJson = [];
                    data.addColumn('string','User Id')
                    data.addColumn('string','Class Name')
                    data.addColumn('string','Subject Name')
                    data.addColumn('number','Time');
                    //responseJson.push(heading);
                    for(var item,i=0;item=jsonObj[i++];)
                    {
                        var temp=[item.uuid];
                        temp.push(item.className);
                        temp.push(item.subjectName);
                        temp.push(item.timeTaken);

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
    $("#chart_div").css('display','block');

    google.charts.setOnLoadCallback(drawChart);
})

$("#btn2").click(function()
{
    startMonth=$("#startMonth").val();
    endMonth=$("#endMonth").val();
    console.log(startMonth);
    $("#chart_div").css('display','block');

    google.charts.setOnLoadCallback(drawChart);
})

$( "#school_range" ).click(function() {
    query="school_range";
    $("#month").css('display','block');
});
$( "#school_strength" ).click(function() {

    query="school_strength";
    $("#date").css('display','block');
    $("#month").css('display','none');
});
$( "#user_info" ).click(function() {
    query="user_info";
    $("#date").css('display','block');
    $("#month").css('display','none');
});
$( "#daily_quiz_class_subject" ).click(function() {
    query="daily_quiz_class_subject";
    $("#date").css('display','block');
    $("#month").css('display','none');
});
$( "#daily_quiz_count" ).click(function() {
    query="daily_quiz_count";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

$( "#daily_user_class_subject" ).click(function() {
    query="daily_user_class_subject";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

$( "#daily_users_count_quiz" ).click(function() {
    query="daily_users_count_quiz";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

$( "#quiz_played_per_user" ).click(function() {
    query="quiz_played_per_user";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

$( "#daily_time_spent_user_quiz" ).click(function() {
    query="daily_time_spent_user_quiz";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

$( "#daily_time_per_user_class_subject" ).click(function() {
    query="daily_time_per_user_class_subject";
    $("#date").css('display','block');
    $("#month").css('display','none');
});

})




