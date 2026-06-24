const resumeInput = document.getElementById("resume");
const roleSelect = document.getElementById("role");
const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", function () {

    const resume = resumeInput.files;
    const role = roleSelect.value;
    const difficulty = document.querySelector(
        'input[name="difficulty"]:checked'
    );

    if (resume.length === 0) {
        message.textContent = "❌ Please upload your resume.";

message.style.color = "red";

return;
    }

    if (role === "") {
        alert("Please select a job role.");
        return;
    }

    if (difficulty === null) {
        alert("Please choose a difficulty level.");
        return;
    }

    alert("All inputs are valid!");

});