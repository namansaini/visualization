# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 17:58:22 2019

@author: user
"""

from operator import itemgetter
import pymongo
from flask import request
from bson.json_util import dumps

connection=pymongo.MongoClient('localhost',27017)

from . import routes_blueprint

@routes_blueprint.route('/report/platform_wise_otp_counts', methods=['GET'])
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