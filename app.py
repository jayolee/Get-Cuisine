from flask import Flask
from flask import request
from flask import redirect, url_for
from flask import render_template
import json
from flask import jsonify
import numpy
import pandas as pd
import pickle 

#code which helps initialize our server
app = Flask(__name__)

#getting the model
model = pickle.load(open("./model.pkl","rb"))

@app.route('/',) 
def index():
    return render_template('index.html')


@app.route('/result', methods=['POST','GET'])
def post_data():
    jsdata = request.json['ingredient']
    jsdata=pd.DataFrame({'ingredient':jsdata})
    jsdata_ingre=jsdata['ingredient']
    predict_result=model.predict(jsdata_ingre)
    predict_result=numpy.array_str(predict_result)
    predict_result=predict_result[2:-2]
    return json.dumps({'predict_result':predict_result})

if __name__ == "__main__":
  app.run(debug=True)