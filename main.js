var query;
var startDt;
var endDt;
var startMonth;
var endMonth;
$(document).ready(function(){
    google.charts.load('current', {packages: ['bar','corechart','table']});
    
	$("#btn, #btn2").click(function(){
		$('#chart_div').html('');
		if(this.id == 'btn'){
			startDt = $("#startDt").val();
			endDt = $("#endDt").val();
		}else{
			startMonth = $("#startMonth").val();
			endMonth = $("#endMonth").val();
		}
		$("#design").css('display','block');
		$('#title').css('display','none');
		google.charts.setOnLoadCallback(drawChart);
		$("a").removeClass("active");
		$("#"+query).addClass("active");
	})
	
	$( "#school_range, #school_strength, #user_info, #daily_quiz_class_subject, #daily_quiz_count, #daily_user_class_subject, #daily_users_count_quiz, #quiz_played_per_user, #daily_time_spent_user_quiz, #daily_time_per_user_class_subject" ).click(function() {
		query = this.id;
		$("a").removeClass("active");
		$("#"+this.id).addClass("active");
		console.log(query);
		if(query == 'school_range'){
			$("#month").css('display','block');
			$('#date').css('display','none');
		}else{
			$("#date").css('display','block');
			$("#month").css('display','none');
		}
	});

})

var jsonObj;
function drawChart(){
	var link = `http://quizreport.fliplearn.com:8081/report/${query}?startDt=${startDt}&endDt=${endDt}`;
	if(query == "school_range")
		link = `http://quizreport.fliplearn.com:8081/report/${query}?startMonth=${startMonth}&endMonth=${endMonth}`;
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
						data.addColumn('string', 'Class Name');	data.addColumn('number', 'Time Spent');	data.addColumn('number', 'Count');
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
						data.addColumn('string','User Id');		data.addColumn('number','Time');
					}
					else if(query == 'daily_time_per_user_class_subject'){
						data.addColumn('string','User Id');		data.addColumn('string','Class Name');
						data.addColumn('string','Subject Name');data.addColumn('number','Time');
					}
					data.addColumn('string', 'Date');
					
					for(var item, i=0; item = jsonObj[i++];){
						var temp = [];
						if(query == 'school_strength'){
							temp = [item.school_name, item.count];
						}
						else if(query == 'user_info'){
							temp = [item.UUID, item.role_name, item.school_name, item.class_name, item.time_spent, item.count];
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
							temp = [item.uuid, item.timeTaken];
                        }
						else if(query == 'daily_time_per_user_class_subject'){
							temp = [item.uuid, item.className, item.subjectName, item.timeTaken];
                        }
						temp.push(item.date);
                        responseJson.push(temp);
                    }
                    console.log(responseJson);
                    data.addRows(responseJson);
                    
                    var table = new google.visualization.Table(document.getElementById("chart_div"));
                    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
					
					break;
				
				case "daily_quiz_count":
				case "daily_users_count_quiz":
					$("#chart_div").css('display','block');
					var responseJson = [];
                    var heading = [];
					heading.push('Date');
                    heading.push('Count');
					responseJson.push(heading);
					for(var item,i=0; item = jsonObj[i++];){
                        var temp = [item.date, item.count];
                        responseJson.push(temp);
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
					
				default:
					alert("Something wrong ! query param mismatched !");
			}
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