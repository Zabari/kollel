from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
import json
import users

with open("secret.json") as f:
    secret_keys = json.load(f)
# print(secret_keys["google_client_id"])

app = Flask(__name__)
app.secret_key = secret_keys["flask_secret"]
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def login():
    google_dictionary = request.get_json()
    id_token = google_dictionary["tokenId"]
    url = f"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={id_token}"
    google_request = requests.post(url)
    authorized_dictionary = google_request.json()
    id = 0
    if (
        (google_request.status_code == 200) and
        (secret_keys["google_client_id"] == authorized_dictionary["aud"])
    ):
        id = users.exists(authorized_dictionary)
        if (not id):
            id = users.add_user(authorized_dictionary)
    session["id"] = id
    return jsonify(session["id"])
