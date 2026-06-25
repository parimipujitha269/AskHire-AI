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
    const difficulty = document.querySelector(
        'input[name="difficulty"]:checked'
    );

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
   message.textContent = "📄 Reading your resume...";
message.style.color = "#2563eb";
setTimeout(function () {

    message.textContent = "🧠 Analyzing your skills...";

}, 2000);

setTimeout(function () {

    message.textContent = "🤖 Generating interview questions...";

}, 4000);


setTimeout(function () {

    resultSection.style.display = "block";

    technicalQuestions.innerHTML = `
    <ul>
        <li>What is a REST API?</li>
        <li>Explain Stack vs Heap Memory.</li>
        <li>What is Polymorphism?</li>
    </ul>
    `;

    hrQuestions.innerHTML = `
    <ul>
        <li>Tell me about yourself.</li>
        <li>Why should we hire you?</li>
        <li>What are your strengths?</li>
    </ul>
    `;

    codingQuestions.innerHTML = `
    <ul>
        <li>Reverse a string.</li>
        <li>Find the largest element in an array.</li>
        <li>Check whether a string is a palindrome.</li>
    </ul>
    `;

    const formData = new FormData();

formData.append("resume", resumeInput.files[0]);

fetch("http://127.0.0.1:5000/upload", {

    method: "POST",

    body: formData

})
.then(function(response){

    return response.json();

})
.then(function(data){

    console.log(data.filename);
    console.log(data.resume_text);

    message.textContent = "✅ Uploaded : " + data.filename;
    message.style.color = "green";

});
}, 6000);
});