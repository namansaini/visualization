# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 16:17:18 2019

@author: user
"""

#from flask import Blueprint
#school_range_blueprint = Blueprint('school_range', __name__)
from operator import itemgetter
from flask import request
from bson.json_util import dumps

from . import connection
from . import routes_blueprint

@routes_blueprint.route('/report/school_range', methods=['GET'])
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