// script.js - Interactive logic for birthday wish

document.addEventListener('DOMContentLoaded', () => {
  const revealBtn = document.getElementById('revealBtn');
  const messageDiv = document.getElementById('message');

  revealBtn.addEventListener('click', () => {
    // Add a gentle pulse effect before revealing
    revealBtn.classList.add('pulse');
    setTimeout(() => {
      revealBtn.disabled = true;
      revealBtn.style.opacity = '0';
      messageDiv.classList.add('show');
    }, 300);
  });
});

/* Optional: add subtle pulse animation via CSS */
