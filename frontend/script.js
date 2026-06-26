const resumeInput = document.getElementById("resume");
const selectedFile = document.getElementById("selectedFile");
const roleSelect = document.getElementById("role");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");
const loader = document.getElementById("loader");

const technicalQuestions = document.getElementById("technicalQuestions");
const hrQuestions = document.getElementById("hrQuestions");
const codingQuestions = document.getElementById("codingQuestions");

const resumeScore = document.getElementById("resumeScore");
const strengths = document.getElementById("strengths");
const weaknesses = document.getElementById("weaknesses");
const skills = document.getElementById("skills");
const suggestions = document.getElementById("suggestions");


// ---------------------------
// Show Selected File Name
// ---------------------------

resumeInput.addEventListener("change", function () {

    if (resumeInput.files.length > 0) {

        selectedFile.textContent =
            "📄 " + resumeInput.files[0].name;

    }

});


// ---------------------------
// Generate Button
// ---------------------------

generateBtn.addEventListener("click", function () {

    const resume = resumeInput.files;
    const role = roleSelect.value;
    const difficulty =
        document.querySelector('input[name="difficulty"]:checked');


    // ---------------------------
    // Validation
    // ---------------------------

    if (resume.length === 0) {

        message.textContent = "❌ Please upload your resume.";
        message.style.color = "red";
        return;

    }

    if (role === "") {

        message.textContent = "❌ Please select a job role.";
        message.style.color = "red";
        return;

    }

    if (difficulty === null) {

        message.textContent =
            "❌ Please choose a difficulty level.";

        message.style.color = "red";
        return;

    }


    resultSection.style.display = "none";

    generateBtn.disabled = true;
    generateBtn.textContent =
        "🤖 AI is preparing your interview...";

    loader.style.display = "block";


    // ---------------------------
    // Form Data
    // ---------------------------

    const formData = new FormData();

    formData.append("resume", resumeInput.files[0]);
    formData.append("role", role);
    formData.append("difficulty", difficulty.value);


    // ---------------------------
    // Loading Messages
    // ---------------------------

    message.innerHTML = `
  Reading your resume...

<br><br>

████░░░░░░░
`;
    message.style.color = "#2563eb";


    setTimeout(function () {

        message.innerHTML = `
Analyzing your skills...

<br><br>

████████░░░
`;

        setTimeout(function () {

            message.innerHTML = `
🤖 Generating personalized interview...

<br><br>

████████████
`;


            fetch("http://127.0.0.1:5000/upload", {

                method: "POST",
                body: formData

            })

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (data.error) {

                    loader.style.display = "none";

                    message.textContent =
                        "❌ " + data.error;

                    message.style.color = "red";

                    generateBtn.disabled = false;

                    generateBtn.textContent =
                        "🚀 Start Interview Preparation";

                    return;

                }


                // ---------------------------
                // Parse Gemini JSON
                // ---------------------------

                const cleanJSON = data.questions
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const questions = JSON.parse(cleanJSON);


                resultSection.style.display = "block";


                // ---------------------------
                // Resume Analysis
                // ---------------------------

                resumeScore.textContent =
                    questions.resume_score;


                strengths.innerHTML =
                    "<ul>" +
                    questions.strengths.map(function (item) {

                       return `
<div class="analysis-item success">

✅ ${item}

</div>
`;

                    }).join("") +
                    "</ul>";


                weaknesses.innerHTML =
                    "<ul>" +
                    questions.weaknesses.map(function (item) {

                       return `
<div class="analysis-item warning">

⚠ ${item}

</div>
`;

                    }).join("") +
                    "</ul>";


             skills.innerHTML =
questions.skills.map(function(item){

    return `<span class="skill-badge">${item}</span>`;

}).join("");


                suggestions.innerHTML =
                    "<ul>" +
                    questions.suggestions.map(function (item) {

                      return `
<div class="analysis-item">

💡 ${item}

</div>
`;

                    }).join("") +
                    "</ul>";


                // ---------------------------
                // Technical Questions
                // ---------------------------

                technicalQuestions.innerHTML =
                    questions.technical.map(function (q, index) {

                        return `
                        <div class="question-card">
                            <h4>💻 Technical Question ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;

                    }).join("");


                // ---------------------------
                // HR Questions
                // ---------------------------

                hrQuestions.innerHTML =
                    questions.hr.map(function (q, index) {

                        return `
                        <div class="question-card">
                            <h4>👥 HR Question ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;

                    }).join("");


                // ---------------------------
                // Coding Questions
                // ---------------------------

                codingQuestions.innerHTML =
                    questions.coding.map(function (q, index) {

                        return `
                        <div class="question-card">
                            <h4>💡 Coding Challenge ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;

                    }).join("");


                loader.style.display = "none";

                message.textContent =
                    "✅ " + data.filename +
                    " uploaded successfully!";

                message.style.color = "green";

                generateBtn.disabled = false;

                generateBtn.textContent =
                    "🚀 Start Interview Preparation";

            })

            .catch(function (error) {

                console.error(error);

                loader.style.display = "none";

                message.textContent =
                    "❌ Unable to connect to the backend.";

                message.style.color = "red";

                generateBtn.disabled = false;

                generateBtn.textContent =
                    "🚀 Start Interview Preparation";

            });

        }, 2000);

    }, 2000);

});