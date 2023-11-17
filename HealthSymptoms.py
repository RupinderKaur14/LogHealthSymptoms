import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/logSymptoms', methods=['POST'])
def log_symptoms():
    data = request.get_data()
    decoded_data = data.decode('utf-8')
    print(decoded_data)
    store_data(decoded_data)
    return jsonify({'message':'logged Health Symptoms'})


def store_data(symptoms):
    connection = sqlite3.connect('HealthData.db')
    cursor = connection.cursor()

    cursor.execute('Create table if not exists HealthSymptoms (id integer primary key, date datetime, symptoms varchar(300))')
    cursor.execute("insert into HealthSymptoms(date, symptoms) values (current_timestamp, '{0}')".format(symptoms))

    connection.commit()
    cursor.close()
    connection.close()




app.run()