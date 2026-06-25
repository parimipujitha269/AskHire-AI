const resumeInput = document.getElementById("resume");
const roleSelect = document.getElementById("role");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");
const resultSection = document.getElementById("resultSection");

const technicalQuestions = document.getElementById("technicalQuestions");
const hrQuestions = document.getElementById("hrQuestions");
const codingQuestions = document.getElementById("codingQuestions");

generateBtn.addEventListener("click", function () {

    const resume = resumeInput.files;
    const role = roleSelect.value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked');

    // Validation
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
        message.textContent = "❌ Please choose a difficulty level.";
        message.style.color = "red";
        return;
    }

    // Hide previous result
    resultSection.style.display = "none";

    // Disable button
    generateBtn.disabled = true;
    generateBtn.textContent = "⏳ Generating...";

    // Prepare form data
    const formData = new FormData();
    formData.append("resume", resumeInput.files[0]);
    formData.append("role", role);
    formData.append("difficulty", difficulty.value);

    // Step 1
    message.textContent = "📄 Reading your resume...";
    message.style.color = "#2563eb";

    setTimeout(function () {

        // Step 2
        message.textContent = "🧠 Analyzing your skills...";

        setTimeout(function () {

            // Step 3
            message.textContent = "🤖 Generating interview questions...";

            fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData
            })

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {

                // Error from backend
                if (data.error) {

                    message.textContent = "❌ " + data.error;
                    message.style.color = "red";

                    generateBtn.disabled = false;
                    generateBtn.textContent = "🚀 Start Interview Preparation";

                    return;
                }

                resultSection.style.display = "block";

                const questions = JSON.parse(data.questions);

                technicalQuestions.innerHTML =
                    questions.technical.map(function (q, index) {
                        return `
                        <div class="question-card">
                            <h4>💻 Technical Question ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;
                    }).join("");

                hrQuestions.innerHTML =
                    questions.hr.map(function (q, index) {
                        return `
                        <div class="question-card">
                            <h4>👥 HR Question ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;
                    }).join("");

                codingQuestions.innerHTML =
                    questions.coding.map(function (q, index) {
                        return `
                        <div class="question-card">
                            <h4>💡 Coding Challenge ${index + 1}</h4>
                            <p>${q}</p>
                        </div>
                        `;
                    }).join("");

                message.textContent =
                    "✅ " + data.filename + " uploaded successfully!";
                message.style.color = "green";

                generateBtn.disabled = false;
                generateBtn.textContent = "🚀 Start Interview Preparation";

            })

            .catch(function (error) {

                console.error(error);

                message.textContent =
                    "❌ Unable to connect to the backend.";
                message.style.color = "red";

                generateBtn.disabled = false;
                generateBtn.textContent = "🚀 Start Interview Preparation";

            });

        }, 2000);

    }, 2000);

});