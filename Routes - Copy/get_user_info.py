# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 17:58:23 2019

@author: user
"""
import MySQLdb
from operator import itemgetter
import pymongo
from flask import request
from bson.json_util import dumps

connection=pymongo.MongoClient('localhost',27017)

from . import routes_blueprint

@routes_blueprint.route('/report/get_user_info', methods=['POST'])
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