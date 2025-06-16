fetch('questions.json')
  .then(res => res.json())
  .then(questions => {
    const container = document.getElementById('quiz-container');
    questions.forEach((q, index) => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.innerHTML = `<h2>Q${index + 1}: ${q.question}</h2>`;
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => {
          if (i === q.answerIndex) {
            btn.style.background = 'green';
            const exp = document.createElement('div');
            exp.className = 'explanation';
            exp.textContent = '✔️ ' + q.explanation;
            card.appendChild(exp);
          } else {
            btn.style.background = 'red';
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
          }
        };
        card.appendChild(btn);
      });
      container.appendChild(card);
    });
  });
