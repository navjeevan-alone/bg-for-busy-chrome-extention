document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    const card = document.getElementById('card');

    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        card.classList.add('slide-out');
        
        setTimeout(() => {
            window.location.href = 'popup.html';
        }, 280);
    });
});
