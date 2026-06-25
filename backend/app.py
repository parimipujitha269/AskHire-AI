from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Backend Connected Successfully"
    })


@app.route("/upload", methods=["POST"])
def upload_resume():

    resume = request.files["resume"]

    return jsonify({
        "filename": resume.filename
    })


if __name__ == "__main__":
    app.run(debug=True)