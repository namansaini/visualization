"""
Created on Tue Jun 18 11:29:18 2019

@author: naman
"""
import pymongo
import flask
from flask import request
from bson.json_util import dumps
from flask_cors import CORS
from operator import itemgetter

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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))



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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))

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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))

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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))

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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))

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
    return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

app.run()