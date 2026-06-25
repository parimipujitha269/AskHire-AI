from flask import Flask, jsonify, request
from flask_cors import CORS
from PyPDF2 import PdfReader

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

    pdf = PdfReader(resume)

    text = ""

    for page in pdf.pages:
        text += page.extract_text()

    return jsonify({
        "filename": resume.filename,
        "resume_text": text
    })


if __name__ == "__main__":
    app.run(debug=True)