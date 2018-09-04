from flask import Flask, request, jsonify, session, Response
from flask_cors import CORS
import requests
import json
import users
import datetime
import hours
import pytz

with open("secret.json") as f:
    secret_keys = json.load(f)
# print(secret_keys["google_client_id"])

app = Flask(__name__)
app.secret_key = secret_keys["flask_secret"]
CORS(app, supports_credentials=True)


@app.route('/api/login', methods=['GET', 'POST'])
def login():
    admin = False
    google_dictionary = request.get_json()
    id_token = google_dictionary["tokenId"]
    url = f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}"
    google_request = requests.post(url)
    authorized_dictionary = google_request.json()
    user_id = False
    if (
        (google_request.status_code == 200) and
        (secret_keys["google_client_id"] == authorized_dictionary["aud"])
    ):
        user_id = users.exists(authorized_dictionary)
        if (not user_id):
            user_id = users.add_user(authorized_dictionary)
        else:
            admin = user_id["admin"]
            user_id = user_id["id"]
        if (admin):
            session["admin"] = admin
        session["id"] = user_id
    return jsonify({"id": "id" in session, "admin": admin})


@app.route('/api/getid', methods=['GET', 'POST'])
def get_id():
    cookie_object = {
        "id": False,
        "admin": False
    }
    # Looking for a True/False, not truthy/falsey.
    cookie_object["id"] = "id" in session
    cookie_object["admin"] = "admin" in session
    return jsonify(cookie_object)
    # return jsonify((("id" in session) and session["id"]) or 0)


@app.route('/api/getlog', methods=['GET', 'POST'])
def get_log():
    # print(request.get_json())
    request_object = request.get_json()
    if (
        ("id" in request_object) and
        ("admin" in session) and
        session["admin"]
    ):
        hour_log = [dict(log) for log in hours.get_log(request_object["id"])]
        total_hours = hours.get_totals(request_object["id"])
    else:
        hour_log = [dict(log) for log in hours.get_log(session["id"])]
        total_hours = hours.get_totals(session["id"])
    return jsonify({"logList": hour_log, "totals": total_hours})
    return jsonify(False)


@app.route('/api/getlearningstate', methods=['GET', 'POST'])
def get_learning():
    return jsonify("start_time" in session)


@app.route('/api/getuserlist', methods=['GET', 'POST'])
def get_user_list():
    if ("admin" in session):
        all_users = users.get_user_list()
        return jsonify(all_users)
    return jsonify(False)


@app.route('/api/startlearning', methods=['GET', 'POST'])
def start_learning():
    if (session["id"]):
        session["start_time"] = datetime.datetime.now(
            tz=pytz.timezone("US/Eastern")).isoformat()
        hours.start_learning(session["id"], session["start_time"])
        return jsonify(True)
    return jsonify(False)


@app.route('/api/endlearning', methods=['GET', 'POST'])
def end_learning():
    # request_object = request.get_json()
    # print("start")
    if ("start_time" in session):
        # print("in here")
        hours.end_learning(session["id"], session["start_time"])
        # temp = session["start_time"]
        session.pop("start_time")
        # return jsonify(False)
    print("start_time" in session)
    return jsonify(False)
