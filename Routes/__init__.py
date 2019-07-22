# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 16:55:24 2019

@author: Shubham
"""

from flask import Blueprint
routes_blueprint = Blueprint('routes', __name__)
import pymongo
connection=pymongo.MongoClient('localhost',27017)
 
from .school_range import *
from .school_strength import *
from .user_info import *
from .daily_quiz_class_subject import *
from .daily_quiz_count import *
from .daily_user_class_subject import *
from .daily_users_count_quiz import *
from .quiz_played_per_user import *
from .daily_time_spent_user_quiz import *
from .daily_time_per_user_class_subject import *
from .doubt_forum_counts import *
from .platform_wise_otp_counts import *
from .weekly_assessment_users import *
from .get_user_info import *
from .platform_wise_activities import *
from .platform_wise_users import *