# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 17:42:18 2019

@author: Shubham
"""

from operator import itemgetter
from flask import request
from bson.json_util import dumps

from . import routes_blueprint
from . import connection

@routes_blueprint.route('/report/daily_quiz_class_subject', methods=['GET'])
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