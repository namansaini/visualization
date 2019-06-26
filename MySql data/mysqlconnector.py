import MySQLdb
import datetime
import os, json
import calendar
import pymongo
#path_to_json = sys.argv[1]
path_to_json = 'json/'
json_files = [pos_json for pos_json in os.listdir(path_to_json) if pos_json.endswith("sample.json")]

i = 1
for file_name in json_files:
    with open(path_to_json+file_name) as json_file:
        data = json.load(json_file)
     
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
            
        if data['source']['dbType'] == 'mysql':
            sourceDb=MySQLdb.connect(data['source']['host'],"root","system",data['source']['dbName'])
            sourceCursor=sourceDb.cursor()
            
            destClient=pymongo.MongoClient(data['destination']['dbType']+'://' + data['destination']['host']+':'+data['destination']['port']+'/' )
            destDb=destClient[ data['destination']['dbName'] ]
            destCol = destDb[ data['destination']['collection'] ]
            
            sourceCursor.execute(data['query'])
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
                json_data.append(d)
            
            destCol.insert_many(json_data)
                
            
            
            
'''db = MySQLdb.connect("localhost","root","abc54312","doubtDatabase")
sourceCursor = db.cursor()
sourceCursor.execute("SELECT * FROM messages")
for x in mycursor:
    print(x)'''

