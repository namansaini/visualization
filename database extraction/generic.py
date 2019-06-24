import pymongo
import datetime
import os, json
import sys
import calendar

#path_to_json = sys.argv[1]
path_to_json = 'json/monthly/'
json_files = [pos_json for pos_json in os.listdir(path_to_json) if pos_json.endswith(".json")]

i = 1
for file_name in json_files:
	#print file_name
	with open(path_to_json+file_name) as json_file:
		data = json.load(json_file)
		#print data['jobName']

#exit(0)

#with open('job_info.json') as json_file:  
#	main_data = json.load(json_file)
	#print(main_data)
#	i = 1
#	for data in main_data['jobs']:
		print ('')
		print('-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-'+data['jobName']+'-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-')
		print ('')
		print(str(i) +'. New Job Started : '+data['jobName'])
		#print('source >> dbUrl: '+data['source']['dbType']+'://' + data['source']['host']+':'+data['source']['port']+'/')
		#print('source >> dbName: ' + data['source']['dbName'])
		#print('source >> collection: ' + data['source']['collection'])
		#print('destination >> dbUrl: '+data['destination']['dbType']+'://' + data['destination']['host']+':'+data['destination']['port']+'/')
		#print('destination >> dbName: ' + data['destination']['dbName'])
		#print('destination >> collection: ' + data['destination']['collection'])
		#for arg in data['runTimeArguments']:
		#	print('runTimeArguments : ' + arg)
		
		today = datetime.date.today()
		
		if 'jobExecution' in data and data['jobExecution'] == 'monthly':
			start_date = today.replace(day = 1).replace(month = today.month-2)
			days_count = calendar.monthrange(today.year, today.month-2)[1]-1
			end_date = start_date + datetime.timedelta(days = days_count)
		else:	
			start_date = (today - datetime.timedelta (days = data['startDate'])) if 'startDate' in data else today
			end_date = (today - datetime.timedelta (days = data['endDate'])) if 'endDate' in data else today
		#print(start_date)
		#exit(0)
		
		if data['source']['dbType'] == 'mongodb':
			sourceClient = pymongo.MongoClient( data['source']['dbType']+'://' + data['source']['host']+':'+data['source']['port']+'/' )
			sourceDB = sourceClient[ data['source']['dbName'] ]
			sourceCol = sourceDB[ data['source']['collection'] ]
			
			destClient = pymongo.MongoClient( data['destination']['dbType']+'://' + data['destination']['host']+':'+data['destination']['port']+'/' )
			destDB = destClient[ data['destination']['dbName'] ]
			destCol = destDB[ data['destination']['collection'] ]
			
			if 'queryIterationAllowed' in data and data['queryIterationAllowed'] == True:
				maxIteration = len(data['fieldValues'])
			else:
				maxIteration = 1
			#print "maxIteration == ", maxIteration
			
			if 'dateAsString' in data and data['dateAsString'] == True:
				startDate = start_date.strftime("%Y-%m-%d") + ' 00:00:00'
				endDate = end_date.strftime("%Y-%m-%d") + ' 23:59:59'
			else:
				startDate = datetime.datetime(start_date.year, start_date.month, start_date.day, 00, 00, 00, 000)
				endDate = datetime.datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59, 999)
			print (startDate, endDate)
			
			for temp in range(0, maxIteration):
				pipeline = []
				for part in data['query']:
					for key_part, value_part in part.items():
						#print( key_part)
						#print value_part
						if key_part == '$match':
							for key, value in value_part.items():
								#print key, value
								if isinstance(value_part[key], str) == False:
                                    #print(value)
                                    #print(value_part[key])
									for key1, value1 in value_part[key].items():
										#print key1, value1
										if value1 == 'startDate':
											value_part[key][key1] = startDate
										elif value1 == 'endDate':
											value_part[key][key1] = endDate
								elif value == 'startDate':
									value_part[key] = startDate
								elif value == 'endDate':
									value_part[key] = endDate
									
							if 'fieldToIterate' in data and 'queryIterationAllowed' in data:
								fieldValues_key = list(data['fieldValues'])[temp-1]
								fieldValues_value = data['fieldValues'][fieldValues_key]
								value_part[ data['fieldToIterate'] ] = fieldValues_value
					
					pipeline.append( part )	
				
				#exit(0)
				cursor = sourceCol.aggregate(pipeline)
				result = list(cursor)
				for document in result:
					#print document
					dict = {}
					for key2, value2 in document.items():
						if key2 == '_id':
							for key3, value3 in document['_id'].items():
								#print key3, value3
								dict[key3] = value3
						else:
							#print key2, value2
							dict[key2] = value2
					dict['createdate'] = datetime.datetime.today()
					for key4, value4 in data['additionalOutput'].items():
						if key4 == 'lastDate':
							dict[value4] = end_date.strftime("%Y-%m-%d")
						if key4 == 'currentMonth':
							dict[value4] = end_date.strftime("%Y-%m")
					
					try:
						dict['key'] = fieldValues_key
					except NameError:
						print ('')
						
					print (dict)
					#continue
					destCol.insert_one(dict)
					dict.clear()
		
		print('Job Ended : '+data['jobName'])
		#exit(0)
		destClient.close();
		sourceClient.close();	
	i += 1;
    