# -*- coding: utf-8 -*-
"""
Created on Tue Jun 18 11:29:18 2019

@author: naman
"""
import pymongo
import flask
from flask import request, jsonify
from bson.json_util import dumps
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
connection=pymongo.MongoClient('localhost',27017)
CORS(app)

@app.route('/report/', methods=['GET'])
def api_all():
    query_parameters = request.args
    query=query_parameters.get('query')
    startDt=query_parameters.get('startDt')
    endDt=query_parameters.get('endDt')
    
    if not (query or startDt or endDt):
        return "<h1>One or More Arguments not Specified</h1>"
    elif(query=='school_data'):
        database=connection['dest_prod_log']
        collection=database['dest_prod_log']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    elif(query=='school_strength'):
        database=connection['dest_prod_log']
        collection=database['school_strength']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    elif(query=='user_info'):
        database=connection['dest_prod_log']
        collection=database['user_info']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    elif(query=='daily_quiz_class_subject'):
        database=connection['quiz_report_data']
        collection=database['daily_quiz_class_subject']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    elif(query=='daily_quiz_count'):
        database=connection['quiz_report_data']
        collection=database['daily_quiz_count']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    elif(query=='daily_users_count_quiz'):
        database=connection['quiz_report_data']
        collection=database['daily_users_count_quiz']
        return dumps(collection.find({"date":{"$gte":startDt,"$lte":endDt}},{"_id":0,"createdate":0}))
    
    else:
        return "<h1>Invalid Parameter</h1>"
    
@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404
app.run()