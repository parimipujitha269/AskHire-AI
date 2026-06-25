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
    role = request.form["role"]
    difficulty = request.form["difficulty"]

    pdf = PdfReader(resume)

    text = ""

    for page in pdf.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    prompt = f"""
You are an experienced technical interviewer.

Candidate Resume:
{text}

Target Job Role:
{role}

Difficulty:
{difficulty}

Generate:

1. Five Technical Interview Questions

2. Three HR Interview Questions

3. Two Coding Questions

Return ONLY valid JSON.

Use this exact structure:

{{
    "technical": [
        "Question 1",
        "Question 2",
        "Question 3",
        "Question 4",
        "Question 5"
    ],
    "hr": [
        "Question 1",
        "Question 2",
        "Question 3"
    ],
    "coding": [
        "Question 1",
        "Question 2"
    ]
}}

Do not return markdown.
Do not use ```json.
Return only the JSON object.
"""

    response = model.generate_content(prompt)

    return jsonify({
        "filename": resume.filename,
        "questions": response.text
    })
if __name__ == "__main__":
    app.run(debug=True)