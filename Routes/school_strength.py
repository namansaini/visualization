# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 16:39:21 2019

@author: user
"""

#from flask import Blueprint
#school_strength_blueprint = Blueprint('school_strength', __name__)
from operator import itemgetter
import pymongo
from flask import request
from bson.json_util import dumps

connection=pymongo.MongoClient('localhost',27017)

from . import routes_blueprint

@routes_blueprint.route('/report/school_strength', methods=['GET'])
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