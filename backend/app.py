from flask import Flask, jsonify, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Backend Connected Successfully"
    })
@app.route("/generate")
def generate():

    response = model.generate_content(
        "Generate one interview question for a Software Engineer."
    )

    return jsonify({
        "question": response.text
    })

@app.route("/upload", methods=["POST"])
def upload_resume():

    resume = request.files["resume"]

    pdf = PdfReader(resume)

    text = ""

    for page in pdf.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    return jsonify({
        "filename": resume.filename,
        "resume_text": text
    })

if __name__ == "__main__":
    app.run(debug=True)