let currentUser = "";

function loadQuestions() {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('quiz-container');
      const answered = getAnswered();

      data.forEach(q => {
        if (answered.includes(q.question)) return;

        const box = document.createElement('div');
        box.className = 'question-box';

        const ques = document.createElement('h2');
        ques.textContent = q.question;
        box.appendChild(ques);

        let answeredThis = false;
        q.options.forEach(opt => {
          const div = document.createElement('div');
          div.className = 'option';
          div.textContent = opt;

          div.onclick = () => {
            if (answeredThis) return;
            if (opt === q.answer) {
              div.classList.add('correct');
            } else {
              div.classList.add('wrong');
            }
            answeredThis = true;
            document.getElementById("exp_" + q.question).style.display = "block";
            markAnswered(q.question, opt);
          };

          box.appendChild(div);
        });

        const expl = document.createElement('div');
        expl.className = 'explanation';
        expl.id = "exp_" + q.question;
        expl.textContent = "📘 व्याख्या: " + q.explanation;
        box.appendChild(expl);

        container.appendChild(box);
      });
    });
}

function getAnswered() {
  const saved = localStorage.getItem("answered_" + currentUser);
  return saved ? JSON.parse(saved) : [];
}

function markAnswered(q, ans) {
  const answered = getAnswered();
  if (!answered.includes(q)) {
    answered.push(q);
    localStorage.setItem("answered_" + currentUser, JSON.stringify(answered));
    localStorage.setItem(currentUser + "_ans_" + q, ans);
  }
}

function showAnswers() {
  const review = document.getElementById("review-container");
  if (review.style.display === "block") {
    review.style.display = "none";
    return;
  }

  review.innerHTML = "";
  const all = JSON.parse(localStorage.getItem("answered_" + currentUser) || "[]");
  if (!all.length) {
    review.innerHTML = "<p>आपने अभी तक कोई उत्तर नहीं दिया है।</p>";
  } else {
    fetch('questions.json')
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(q => map[q.question] = q);
        all.forEach(qText => {
          const q = map[qText];
          if (q) {
            const userAns = localStorage.getItem(currentUser + "_ans_" + q.question) || "N/A";
            const div = document.createElement("div");
            div.style.marginBottom = "12px";
            div.innerHTML = `<strong>प्रश्न:</strong> ${q.question}<br>
                             <strong>आपका उत्तर:</strong> ${userAns}<br>
                             <strong>सही उत्तर:</strong> ${q.answer}<br>
                             <strong>📘 व्याख्या:</strong> ${q.explanation}`;
            review.appendChild(div);
          }
        });
      });
  }
  review.style.display = "block";
}

function startQuiz() {
  const name = document.getElementById("username").value.trim();
  if (!name) {
    alert("कृपया नाम दर्ज करें!");
    return;
  }
  currentUser = name;
  localStorage.setItem("currentUser", currentUser);
  document.getElementById("login-container").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  document.getElementById("review-btn").style.display = "inline-block";
  loadQuestions();
}

window.onload = () => {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = savedUser;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    document.getElementById("review-btn").style.display = "inline-block";
    loadQuestions();
  }
};

