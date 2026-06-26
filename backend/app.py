from flask import Flask, jsonify, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import google.generativeai as genai
import os
from dotenv import load_dotenv

# -----------------------------------
# Flask App Configuration
# -----------------------------------

app = Flask(__name__)
CORS(app)

# -----------------------------------
# Load Gemini API Key
# -----------------------------------

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

# -----------------------------------
# Home Route
# -----------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "Backend Connected Successfully"
    })


# -----------------------------------
# Test Gemini Route
# -----------------------------------

@app.route("/generate")
def generate():

    response = model.generate_content(
        "Generate one interview question for a Software Engineer."
    )

    return jsonify({
        "question": response.text
    })


# -----------------------------------
# Upload Resume Route
# -----------------------------------

@app.route("/upload", methods=["POST"])
def upload_resume():

    # Receive data
    resume = request.files["resume"]
    role = request.form["role"]
    difficulty = request.form["difficulty"]

    # Read PDF
    pdf = PdfReader(resume)

    text = ""

    for page in pdf.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted + "\n"

    # Gemini Prompt
    prompt = f"""
You are an expert ATS Resume Reviewer, HR Recruiter, and Technical Interviewer.

Candidate Resume:
{text}

Target Job Role:
{role}

Interview Difficulty:
{difficulty}

Perform ALL of the following tasks.

1. Analyze the resume and assign an ATS Resume Score out of 100.

2. List the top strengths of the resume.

3. List the weaknesses or missing areas.

4. Detect all important technical skills mentioned in the resume.

5. Give four personalized suggestions to improve the resume.

6. Generate interview questions based ONLY on the candidate's resume and the selected job role.

Generate:

- Five Technical Interview Questions
- Three HR Interview Questions
- Two Coding Questions

Return ONLY valid JSON.

Use this exact structure:

{{
    "resume_score": 85,

    "strengths": [
        "Strength 1",
        "Strength 2",
        "Strength 3"
    ],

    "weaknesses": [
        "Weakness 1",
        "Weakness 2",
        "Weakness 3"
    ],

    "skills": [
        "Skill 1",
        "Skill 2",
        "Skill 3",
        "Skill 4",
        "Skill 5"
    ],

    "suggestions": [
        "Suggestion 1",
        "Suggestion 2",
        "Suggestion 3",
        "Suggestion 4"
    ],

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

Rules:

- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use ```json.
- Do NOT include explanations outside the JSON.
- Ensure the JSON is valid and can be parsed directly.
"""

    # Generate AI Response
    try:

        response = model.generate_content(prompt)

        return jsonify({
            "filename": resume.filename,
            "questions": response.text
        })

    except Exception as e:

        print(e)

        return jsonify({
            "error": str(e)
        }), 500


# -----------------------------------
# Run Flask App
# -----------------------------------

if __name__ == "__main__":
    app.run(debug=True)