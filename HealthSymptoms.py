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
    
@app.route('/getSymptoms', methods=['GET'])
def get_symptoms():
    date = request.args.get("date")
    data = get_logged_symptoms(date)
    print(data)
    flattened_data = list(set(symptom for symptoms_string in data for symptom in json.loads(symptoms_string)))
    json_data = json.dumps(flattened_data)
    return jsonify(json_data)

def get_logged_symptoms(date):
    connection = sqlite3.connect('HealthData.db')
    cursor = connection.cursor()
    #search_date = '2023-11-16'
    # Use json_each to extract individual symptoms and use DISTINCT to get unique symptoms 
    cursor.execute("""
        SELECT DISTINCT json_extract(symptoms, '$') AS symptom
        FROM HealthSymptoms
        WHERE date LIKE ?
    """, ('%' + date + '%',))
    
    symptoms = [row[0] for row in cursor.fetchall()]

    cursor.close()
    connection.close()
    return symptoms



app.run()