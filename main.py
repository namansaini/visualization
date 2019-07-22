# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 16:15:49 2019

@author: Shubham
"""

from flask_cors import CORS
from flask import Flask
app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

from Routes import routes_blueprint
app.register_blueprint(routes_blueprint)

if __name__ == "__main__":
    app.run(port = 8081)