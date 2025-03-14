document.addEventListener('DOMContentLoaded', () => {
    // Back button handler
    document.getElementById('backButton').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('card').classList.add('slide-out');
        setTimeout(() => {
            window.location.href = 'popup.html';
        }, 280);
    });

    // Load saved verses
    chrome.storage.sync.get(['favorites'], (result) => {
        const favorites = result.favorites || [];
        const savedVersesList = document.getElementById('savedVersesList');
        
        if (favorites.length === 0) {
            savedVersesList.innerHTML = '<p class="no-favorites">No saved verses yet</p>';
            return;
        }

        // Create elements for each saved verse
        favorites.forEach(fav => {
            const verseCard = document.createElement('div');
            verseCard.className = 'verse-card';
            verseCard.setAttribute('data-chapter', fav.chapter);
            verseCard.setAttribute('data-verse', fav.verse);
            
            verseCard.innerHTML = `
                <div class="verse-header">
                    <span class="verse-number">Chapter ${fav.chapter}, Verse ${fav.verse}</span>
                    <button class="remove-button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
                <div class="verse-content">Loading...</div>
            `;

            savedVersesList.appendChild(verseCard);

            // Load verse content
            fetch(
                `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${fav.chapter}/verses/${fav.verse}/`,
                {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Key": "9892626e54msh5fda951b290e0c2p1e343fjsn1291936e2614",
                        "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
                    },
                }
            )
            .then(response => response.json())
            .then(data => {
                verseCard.querySelector('.verse-content').innerHTML = `
                    <div class="sanskrit-text">${data.text}</div>
                    <div class="translation">${data.translations[2].description}</div>
                `;
            })
            .catch(err => {
                verseCard.querySelector('.verse-content').innerHTML = 'Failed to load verse';
            });

            // Add remove button handler
            verseCard.querySelector('.remove-button').addEventListener('click', () => {
                chrome.storage.sync.get(['favorites'], (result) => {
                    const updatedFavorites = result.favorites.filter(f => 
                        !(f.chapter === fav.chapter && f.verse === fav.verse)
                    );
                    chrome.storage.sync.set({ favorites: updatedFavorites }, () => {
                        verseCard.style.animation = 'slideOutRight 0.3s ease-out';
                        setTimeout(() => {
                            verseCard.remove();
                            if (savedVersesList.children.length === 0) {
                                savedVersesList.innerHTML = '<p class="no-favorites">No saved verses yet</p>';
                            }
                        }, 280);
                    });
                });
            });
        });
    });
}); 