# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 17:58:23 2019

@author: user
"""

from operator import itemgetter
import pymongo
from flask import request
from bson.json_util import dumps

connection=pymongo.MongoClient('localhost',27017)

from . import routes_blueprint

@routes_blueprint.route('/report/weekly_assessment_users', methods=['GET'])
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