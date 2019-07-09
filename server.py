"""
Created on Tue Jun 18 11:29:18 2019

@author: naman
"""
import pymongo
import flask
import sys
from flask import request
from bson.json_util import dumps
from flask_cors import CORS
from operator import itemgetter
import MySQLdb

app = flask.Flask(__name__)
app.config["DEBUG"] = True
connection=pymongo.MongoClient('localhost',27017)
CORS(app)

#1
@app.route('/report/school_range', methods=['GET'])
def school_range():
    query_parameters = request.args
    startMonth=query_parameters.get('startMonth')
    endMonth=query_parameters.get('endMonth')
    
    if not (startMonth or endMonth):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['dest_prod_log']
    collection=database['school_range']
    data=list(collection.find({"month":{"$gte":startMonth,"$lte":endMonth}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('type'))
    return dumps(data)

#2
@app.route('/report/school_strength', methods=['GET'])
def school_strength():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['dest_prod_log']
    collection=database['school_strength']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#3
@app.route('/report/user_info', methods=['GET'])
def user_info():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['dest_prod_log']
    collection=database['user_info']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#4
@app.route('/report/daily_quiz_class_subject', methods=['GET'])
def daily_quiz_class_subject():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_quiz_class_subject']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#5
@app.route('/report/daily_quiz_count', methods=['GET'])
def daily_quiz_count():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_quiz_count']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#6  
@app.route('/report/daily_user_class_subject', methods=['GET'])
def daily_user_class_subject():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_user_class_subject']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#7
@app.route('/report/daily_users_count_quiz', methods=['GET'])
def daily_users_count_quiz():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_users_count_quiz']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#8
@app.route('/report/quiz_played_per_user', methods=['GET'])
def quiz_played_per_user():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['quiz_played_per_user']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#9
@app.route('/report/daily_time_spent_user_quiz', methods=['GET'])
def daily_time_spent_user_quiz():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_time_spent_user_quiz']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#10
@app.route('/report/daily_time_per_user_class_subject', methods=['GET'])
def daily_time_per_user_class_subject():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['quiz_report_data']
    collection=database['daily_time_per_user_class_subject']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#11
@app.route('/report/doubt_forum_counts', methods=['GET'])
def doubt_forum_counts():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['data_analysis']
    collection=database['doubt_forum_counts']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)


#12
@app.route('/report/platform_wise_otp_counts', methods=['GET'])
def platform_wise_otp_counts():
    query_parameters = request.args
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['data_analysis']
    collection=database['platform_wise_otp_counts']
    data=list(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('date'))
    return dumps(data)

#13
@app.route('/report/weekly_assessment_users', methods=['GET'])
def weekly_assessment_users():
    query_parameters = request.args
    startWeek=query_parameters.get('startWeek')
    endWeek=query_parameters.get('endWeek')

    if not (startWeek or endWeek):
        return "<h1>One or More Arguments not Specified</h1>", 500
    database=connection['data_analysis']
    collection=database['new_returning_user']
    data=list(collection.find({"weekNumber":{"$gte":startWeek,"$lte":endWeek}},{"_id":0,"createdate":0}))
    data=sorted(data, key=itemgetter('weekNumber'))
    return dumps(data)

#13.1
@app.route('/report/get_user_info', methods=['POST'])
def get_user_info():
    uuid=request.form['uuid']
    sourceDb=MySQLdb.connect('localhost','root','abc54312','doubtdatabase')
    sourceCursor=sourceDb.cursor()


    if not (uuid):
        return "<h1> Arguments not Specified</h1>", 500
    uuidList = uuid.split(',')
    uuidStr=''
    for x in uuidList:
        if x==uuidList[-1]:
            uuidStr+="'" + x + "'"
        else:
            uuidStr+="'" + x + "',"
    x=sourceCursor.execute("SELECT um.uuid, um.login_id, um.first_name FROM user_master um WHERE uuid IN (" + uuidStr + ");")   
    row_headers=[x[0] for x in sourceCursor.description]
    rv = sourceCursor.fetchall()
    json_data=[]
    for result in rv:
        d=dict(zip(row_headers,result))
        json_data.append(d)
    print(json_data)
    return dumps(json_data)

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

app.debug=False
app.run(port=8081)

