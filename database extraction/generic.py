import pymongo
import datetime
import os, json
import sys
import MySQLdb
import calendar

#path_to_json = sys.argv[1]
path_to_json = 'json/daily/'
json_files = [pos_json for pos_json in os.listdir(path_to_json) if pos_json.endswith("daily_quiz_count.json")]

i = 1
for file_name in json_files:
    with open(path_to_json+file_name) as json_file:
        data = json.load(json_file)
        print ('')
        print('-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-'+data['jobName']+'-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-')
        print ('')
        print(str(i) +'. New Job Started : '+data['jobName'])
        
        today = datetime.date.today()
        if 'jobExecution' in data and data['jobExecution'] == 'monthly':
            start_date = today.replace(day = 1).replace(month = today.month-2)
            days_count = calendar.monthrange(today.year, today.month-2)[1]-1
            end_date = start_date + datetime.timedelta(days = days_count)
        else:	
            start_date = (today - datetime.timedelta (days = data['startDate'])) if 'startDate' in data else today
            end_date = (today - datetime.timedelta (days = data['endDate'])) if 'endDate' in data else today
        if 'dateAsString' in data and data['dateAsString'] == True:
            startDate = start_date.strftime("%Y-%m-%d") + ' 00:00:00'
            endDate = end_date.strftime("%Y-%m-%d") + ' 23:59:59'
        else:
            startDate = datetime.datetime(start_date.year, start_date.month, start_date.day, 00, 00, 00, 000)
            endDate = datetime.datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59, 999)
        print(start_date,end_date)
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
                
            for temp in range(0, maxIteration):
                pipeline = []
                for part in data['query']:
                    for key_part, value_part in part.items():
                        if key_part == '$match':
                            for key, value in value_part.items():
                                if isinstance(value_part[key], str) == False:
                                    for key1, value1 in value_part[key].items():
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
                    
                cursor = sourceCol.aggregate(pipeline)
                result = list(cursor)
                for document in result:
                    dict1 = {}
                    for key2, value2 in document.items():
                        if key2 == '_id':
                            for key3, value3 in document['_id'].items():
                                dict[key3] = value3
                        else:
                            dict1[key2] = value2
                    dict1['createdate'] = datetime.datetime.today()
                    for key4, value4 in data['additionalOutput'].items():
                        if key4 == 'lastDate':
                            dict1[value4] = end_date.strftime("%Y-%m-%d")
                        if key4 == 'currentMonth':
                            dict1[value4] = end_date.strftime("%Y-%m")
                        if key== 'weeekDuration':
                            d[value]= end_date.isocalendar()[1]
                        
                    try:
                        dict1['key'] = fieldValues_key
                    except NameError:
                        print ('')
						
                    print (dict1)
                    destCol.insert_one(dict)
                    dict1.clear()
                    sourceClient.close()
                    
                    
        elif data['source']['dbType'] == 'mysql':
            sourceDb=MySQLdb.connect(data['source']['host'],data['source']['username'],data['source']['password'],data['source']['dbName'])
            sourceCursor=sourceDb.cursor()
            
            destClient=pymongo.MongoClient(data['destination']['dbType']+'://' + data['destination']['host']+':'+data['destination']['port']+'/' )
            destDb=destClient[ data['destination']['dbName'] ]
            destCol = destDb[ data['destination']['collection'] ]
            
            temp = data['query'].replace("startDate",startDate)
            finalQuery = temp.replace("endDate",endDate)
            sourceCursor.execute(finalQuery)
            
            row_headers=[x[0] for x in sourceCursor.description] #this will extract row headers
            rv = sourceCursor.fetchall()
            json_data=[]
            for result in rv:
                d=dict(zip(row_headers,result))
                
                d['createdate'] = datetime.datetime.today()
                for key, value in data['additionalOutput'].items():
                    if key == 'lastDate':
                        d[value] = end_date.strftime("%Y-%m-%d")
                    if key == 'currentMonth':
                        d[value] = end_date.strftime("%Y-%m")
                    if key== 'lastWeek':
                        d[value]= end_date.strftime("%y") + "-W" + end_date.strftime("%V")
                    if key== 'weekDuration':
                        d[value] = start_date.strftime("%d-%b-%Y") + " - " + end_date.strftime("%d-%b-%Y")
                        
                json_data.append(d)
            print(json_data)
            destCol.insert_many(json_data)
            sourceCursor.close()
            sourceDb.close()
            
        destClient.close()
print('Job Ended : '+data['jobName'])		
i += 1

today=datetime.date.today()
end_date=(today - datetime.timedelta (days = 150))
print(end_date.strftime("%Y") + "-W" + end_date.strftime("%V"))