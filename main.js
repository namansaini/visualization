var query;
var startDt;
var endDt;
var startMonth;
var endMonth;
var week;
$(document).ready(function(){
    google.charts.load('current', {packages: ['bar','corechart','table']});
    
	$("#btn, #btn2, #btn3").click(function(){
		startDt = endDt = startMonth = endMonth = undefined;
		if(this.id == 'btn'){
			startDt = $("#startDt").val();
			endDt = $("#endDt").val();
		}else if(this.id == 'btn2'){
			startMonth = $("#startMonth").val();
			endMonth = $("#endMonth").val();
		}
		else if(this.id == 'btn3')
		{
			week= $("#week").val();
			
		}
		console.log("{ "+startDt+ ", "+ endDt + ", " + startMonth + ", " + endMonth + " }");
		if((startDt == '' || endDt == '') || (startMonth=='' || endMonth=='')){
            alert('Choose fields before proceeeding...');
            return false;
        }
		if(query=='user_info' && !confirm("The data set is humongous and hence is gonna take a lot of time to fetch.. Get a cup of tea before proceeding!!"))
			return false;
		$('#chart_div').html('');
		$("#design").css('display','block');
		$('#title, #alert').css('display','none');
		google.charts.setOnLoadCallback(drawChart);
		$("a").removeClass("active");
		$("#"+query).addClass("active");
		
	})
	
	$( "a" ).click(function() {
		query = this.id;
		$("a").removeClass("active");
		$("#"+this.id).addClass("active");
		console.log(query);
		if(query == 'school_range'){
			$("#month").css('display','block');
			$('#date').css('display','none');
			$("#weekbox").css('display','none');
		}
		else if(query == 'new_returning_user')
		{
			$("#weekbox").css('display','block');
			$("#date").css('display','none');
			$("#month").css('display','none');
		}else{
			$("#date").css('display','block');
			$("#month").css('display','none');
			$("#weekbox").css('display','none');
		}
	});

})

var jsonObj;
function drawChart(){
	var link;
	if(query == "school_range")
		link = `http://quizreport.fliplearn.com:8081/report/${query}?startMonth=${startMonth}&endMonth=${endMonth}`;
	else
	if(query == "new_returning_user")
		link = `http://quizreport.fliplearn.com:8081/report/${query}?week=${week}`;
	else
		link = `http://quizreport.fliplearn.com:8081/report/${query}?startDt=${startDt}&endDt=${endDt}`;
	
    console.log(link);
    $.ajax({
		url: link,//"http://quizreport.fliplearn.com:8081/report/school_range?startMonth=2019-04&endMonth=2019-06",
		success:function(jsonData){
			console.log(jsonData);
            jsonObj = JSON.parse(jsonData);
            console.log(jsonObj);
			
			switch(query){
				case "school_range":
					$("#chart_div").css('display','block');
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
							title: $('#'+query).html()
                        }
                    };
                    
                    var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    chart.draw(data, google.charts.Bar.convertOptions(options));
					
					break;
				
				case "school_strength":
				case "user_info":
				case "daily_quiz_class_subject":
				case "daily_user_class_subject":
				case "quiz_played_per_user":
				case "daily_time_spent_user_quiz":
				case "daily_time_per_user_class_subject":
				
					$("#title, #chart_div").css('display','block');
                    $("#title").html($('#'+query).html())
					var data = new google.visualization.DataTable();
					var responseJson = [];
					if(query == 'school_strength'){
						data.addColumn('string', 'School');		data.addColumn('number', 'Count');
					} 
					else if(query == 'user_info'){
						data.addColumn('string', 'UUID');		data.addColumn('string', 'Role Name');	data.addColumn('string', 'School Name');
						data.addColumn('string', 'Class Name');	data.addColumn('number', 'Time Spent (in minutes)');	data.addColumn('number', 'Count');
					} 
					else if(query == 'daily_quiz_class_subject'){
						data.addColumn('string', 'Class Name');	data.addColumn('string', 'Subject Name');	data.addColumn('number', 'Count');
					}
					else if(query == 'daily_user_class_subject'){
						data.addColumn('string','Class Name');	data.addColumn('string','Subject Name');	data.addColumn('number','Count');
					}
					else if(query == 'quiz_played_per_user'){
						data.addColumn('string','User Id');		data.addColumn('string','User Name');		data.addColumn('string','Class Name');
						data.addColumn('string','Subject Name');data.addColumn('number','Quiz Count');
					}
					else if(query == 'daily_time_spent_user_quiz'){
						data.addColumn('string','User Id');		data.addColumn('number','Time (in minutes)');
					}
					else if(query == 'daily_time_per_user_class_subject'){
						data.addColumn('string','User Id');		data.addColumn('string','Class Name');
						data.addColumn('string','Subject Name');data.addColumn('number','Time (in minutes)');
					}
					data.addColumn('string', 'Date');
					
					for(var item, i=0; item = jsonObj[i++];){
						var temp = [];
						if(query == 'school_strength'){
							temp = [item.school_name, item.count];
						}
						else if(query == 'user_info'){
							temp = [item.UUID, item.role_name, item.school_name, item.class_name, item.time_spent/60000, item.count];
						}
						else if(query == 'daily_quiz_class_subject'){
							temp = [item.className, item.subjectName, item.count];
						}
						else if(query == 'daily_user_class_subject'){
							temp = [item.className, item.subjectName, item.count];
						}
						else if(query == 'quiz_played_per_user'){
							temp = [item.user, item.userName, item.className, item.subjectName, item.quiz_count];
                        }
						else if(query == 'daily_time_spent_user_quiz'){
							temp = [item.uuid, item.timeTaken/60000];
                        }
						else if(query == 'daily_time_per_user_class_subject'){
							temp = [item.uuid, item.className, item.subjectName, item.timeTaken/60000];
                        }
						temp.push(item.date);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
					$('.google-visualization-table-table').addClass('display')
					$('.google-visualization-table-table').addClass('nowrap')
					$('.google-visualization-table-table').dataTable({dom: 'lBfrtip',buttons: ['copy', 'csv', 'excel', 'pdf', 'print']});
					break;
				
				case "daily_quiz_count":
				case "daily_users_count_quiz":
				case "doubt_forum_counts":
				case "platform_wise_otp_counts":
					$("#chart_div").css('display','block');
					var responseJson = [];
                    var heading = [];
					if(query=="doubt_forum_counts"){
						heading.push('Date');
						heading.push('Mesaage Count');
						heading.push('Answers Count');
					}else if(query=="platform_wise_otp_counts"){
						heading = ['Date', 'Android', 'iOs', 'Web'];
					}
					else{
						heading.push('Date');
						heading.push('Count');
					}
					responseJson.push(heading);
					for(var item,i=0; item = jsonObj[i++];){
						if(query=="doubt_forum_counts")
							var temp = [item.date, item.messages_count, item.answers_count];
						else if(query=="platform_wise_otp_counts")
							var temp = [item.date, item.androidCount, item.iosCount, item.webCount];
						else
							var temp = [item.date, item.count];
                        responseJson.push(temp);
                    }
					console.log(responseJson);
					var data = google.visualization.arrayToDataTable(responseJson);
                    var options = {
                        title: $('#'+query).html()
					};
                    
                    //var chart = new google.charts.Bar(document.getElementById("chart_div"));
                    //chart.draw(data, google.charts.Bar.convertOptions(options));
					var chart = new google.visualization.LineChart(document.getElementById("chart_div"));
                    chart.draw(data, options);
					
					break;

				case "new_returning_user":
					$("#weekly_user_tab").css('display','block');
					$("#title").html($('#'+query).html())
					var a=$("#new_user_table");
					var b=$("#returning_user_table");

					var aJson = $.grep( jsonObj, function( n, i ) {
						return n.user_type==='new user';
					});

					var bJson = $.grep( jsonObj, function( n, i ) {
						return n.user_type==='returning user';
					});
					a.DataTable(
						{
							"data":aJson,
							"columns" : 
							[
								{ "data" : "User Id" },
								{ "data" : "Login Id" },
								{ "data" : "First Name" },
								{ "data" : "User Type" }
							]
						}
					);
					b.DataTable(
						{
							"data":bJson,
							"columns" : 
							[
								{ "data" : "User Id" },
								{ "data" : "Login Id" },
								{ "data" : "First Name" },
								{ "data" : "User Type" }
							]
						}
					);
				default:
					alert("Something wrong ! query param mismatched !");
			}
			$("#design").css('display','none');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			$('#alertMsg').html("Status: " + textStatus+", "+"Error: " + errorThrown);
			$('#alert').css('display', 'block');
			$("#design").css('display','none');
		}       
		
    })
}

function getCount(range, month){
	for (var item, i = 0; item = jsonObj[i++];) {
		if(item.type == range && item.month == month)
			return item.count;
	}
	return 0;
}
