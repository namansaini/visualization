var query;
var startDt;
var endDt;
var startMonth;
var endMonth;
var startWeek, endWeek;
$(document).ready(function(){
    google.charts.load('current', {packages: ['bar','corechart','table']});
    
	$("#btn, #btn2, #btn3").click(function(){
		startDt = endDt = startMonth = endMonth = startWeek = endWeek= undefined;
		if(this.id == 'btn'){
			startDt = $("#startDt").val();
			endDt = $("#endDt").val();
		}
		else if(this.id == 'btn2'){
			startMonth = $("#startMonth").val();
			endMonth = $("#endMonth").val();
		}
		else if(this.id == 'btn3')
		{
			startWeek= $("#startWeek").val();
			endWeek= $("#endWeek").val();
		}
		console.log("{ "+startDt+ ", "+ endDt + ", " + startMonth + ", " + endMonth + " }");
		if((startDt == '' || endDt == '') || (startMonth=='' || endMonth=='' || startWeek == '' || endWeek == '')){
            alert('Choose fields before proceeeding...');
            return false;
        }
		if(query=='user_info' && !confirm("The data set is humongous and hence is gonna take a lot of time to fetch.. Get a cup of tea before proceeding!!"))
			return false;
		$('#chart_div').html('');
		$("#design").css('display','block');
		$('#title, #alert').css('display','none');
		$("#table_view").css('display','none');
		google.charts.setOnLoadCallback(drawChart);
		$("a").removeClass("active");
		$("#"+query).addClass("active");	
	});

	$("#back").click(function()
	{
		$("#table_view").css('display','none');
		$('#chart_div').css('display','block');
	});
	
	$( "#school_range,#school_strength,#user_info,#daily_quiz_count,#daily_quiz_class_subject,#daily_users_count_quiz,#daily_user_class_subject,#quiz_played_per_user,#daily_time_spent_user_quiz,#daily_time_per_user_class_subject,#doubt_forum_counts,#platform_wise_otp_counts,#weekly_assessment_users,#platform_wise_activities,#platform_wise_users" )
	.click(function() 
	{
		query = this.id;
		$("a").removeClass("active");
		$("#"+this.id).addClass("active");
		console.log(query);
		$("#tabs").css('display','none');
		if(query == 'school_range'){
			$("#month").css('display','block');
			$('#date').css('display','none');
			$("#weekbox").css('display','none');
		}
		else if(query == 'weekly_assessment_users')
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
var prevPlatform = 'Android';
function drawChart(){
	var link;
	if(query == "school_range")
		link = `http://localhost:8081/report/${query}?startMonth=${startMonth}&endMonth=${endMonth}`;
	else
	if(query == "weekly_assessment_users")
		link = `http://localhost:8081/report/${query}?startWeek=${startWeek}&endWeek=${endWeek}`;
	else
		link = `http://localhost:8081/report/${query}?startDt=${startDt}&endDt=${endDt}`;
	
    console.log(link);
    $.ajax({
		url: link,//"http://quizreport.fliplearn.com:8081/report/school_range?startMonth=2019-04&endMonth=2019-06",
		success:function(jsonData){
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
                            item.push( getCount(uniqueRanges[i], uniqueMonths[j]));
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

				case "weekly_assessment_users":
					$("#chart_div").css('display','block');
					var responseJson = [];
					var heading = [];
					heading=['Week','New User','Returning User'];
					responseJson.push(heading);

					var userTypeLookup = {},  weekLookup = {};
                    var uniqueUserType = [], uniqueWeek = [];
                    for (var item, i = 0;item = jsonObj[i++];) {
                        var week = item.weekNumber;
                        if (!(week in weekLookup)) {
                            weekLookup[week] = 1;
                            uniqueWeek.push(week);
                        }
                        
                        var userType = item.user_type;
                        if (!(userType in userTypeLookup)) {
                            userTypeLookup[userType] = 1;
                            uniqueUserType.push(userType);
                        }
					}
					
					for (i = 0; i < uniqueWeek.length; i++) {
                        var item = [uniqueWeek[i]];
                        for(j = 0; j < uniqueUserType.length; j++){
                            item.push( getUserCount(uniqueWeek[i], uniqueUserType[j]));
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

					google.visualization.events.addListener(chart, 'select', selectHandler);

					function selectHandler() 
					{
						var week, type;
						var selection = chart.getSelection();
						for (var i = 0; i < selection.length; i++) 
						{
							var item = selection[i];
							if (item.row != null && item.column != null)
							{
								week = data.getValue(chart.getSelection()[0].row, 0);

								if(item.column == 1)
									type = 'new user';
								else
								if(item.column == 2)
									type = 'returning user';
							}
						}
						var uuidString;
						for (var item, i = 0; item = jsonObj[i++];) 
						{
							if(item.user_type == type && item.weekNumber == week)
							{
								uuidString = item.uuid;
								break;
							}
						}
						console.log(uuidString);
						getUserInfoAjax(uuidString);
					}
					
					break;
				case "platform_wise_activities":
				case "platform_wise_users":
					$("#title,#chart_div").css('display','block');
					$("#tabs").css('display','block');
					$("#title").html($('#'+query).html());

					$("#"+prevPlatform).removeClass('active');
					$("#Android").addClass('active');
					tabsData('Android');
					$("li").click(function()
					{
						prevPlatform=this.id;
						var platform=this.id;
						tabsData(platform);
					});
					break;
				default:
					alert("Something wrong ! query param mismatched !");
			}
			$("#design").css('display','none');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
			$('#alertMsg').html("Status: " + textStatus+", "+"Error: " + errorThrown);
			$('#alert').css('display', 'block');
			$("#design").css('display','none');
			console.log(XMLHttpRequest);
		}       
		
    })
}
function tabsData(platform1)
{

						//{
							var filtered_json;
							

							var platform=platform1;
							console.log(platform);
							filtered_json = jsonObj.filter(function (entry) {
								return entry.platform === platform;
							});
						
							var data = new google.visualization.DataTable();
							console.log(filtered_json);
							if(query == 'platform_wise_activities')
							{
								data.addColumn('string','Activity');
								data.addColumn('number','Activity Count');
							}
							else
							if(query == 'platform_wise_users')
							{
								data.addColumn('string','UUID');
								data.addColumn('string','Login ID');
								data.addColumn('string','Name');
								data.addColumn('string','Class Name');
								data.addColumn('number','Count');
								
							}
							data.addColumn('string','Date');
							
							var responseJson = [];
							for(var item, i=0; item = filtered_json[i++];)
							{
								var temp = [];
								if(query == 'platform_wise_activities')
									temp=[item.activity, item.activity_count, item.date];
								else
								if(query == 'platform_wise_users')
									temp=[item.uuid, item.login_id, item.user_name, item.class_name, item.activity_count, item.date];
								responseJson.push(temp);
							}
							data.addRows(responseJson);
							var table = new google.visualization.Table(document.getElementById("chart_div"));
							table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
							$('.google-visualization-table-table').addClass('display');
							$('.google-visualization-table-table').addClass('nowrap');
							$('.google-visualization-table-table').dataTable({dom: 'lBfrtip',buttons: ['copy', 'csv', 'excel', 'pdf', 'print']});
						//});
}
function getCount(range, month){
	for (var item, i = 0; item = jsonObj[i++];) {
		if(item.type == range && item.month == month)
			return item.count;
	}
	return 0;
}

function getUserCount(week, user){
	for (var item, i = 0; item = jsonObj[i++];) {
		if(item.user_type == user && item.weekNumber == week)
			return item.user_count;
	}
	return 0;
}

function getUserInfoAjax(uuid)
{
			$.ajax ({
				url: `http://localhost:8081/report/get_user_info`,  
				error: function (xhr, error, code)
            {
					console.log(xhr);
					console.log(code);
					console.log(error);
            },
				data: {
					uuid:uuid
				},
				type: "POST",
				dataType: "json",
				success:function(jsonData)
				{
					console.log(jsonData);
					var temp=JSON.stringify(jsonData);
					var jsonObj2 = JSON.parse(temp);
					console.log(jsonObj2);
					$("#chart_div").css('display','none');
					$("#table_view").css('display','block');
					populateDatatable(jsonObj2);
				}
			});
	
}
function populateDatatable(jsonObj2)
{
	$("#user_data_table").dataTable().fnClearTable();
	for (var item, i = 0; item = jsonObj2[i++];) 
	{
		$("#user_data_table").dataTable().fnAddData
		(
			[
				item.uuid,
				item.login_id,
				item.first_name
			]
		);
	}
}

