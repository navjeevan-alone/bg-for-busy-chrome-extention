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
    chrome.storage.sync.get(['favorites'], async (result) => {
        const favorites = result.favorites || [];
        const savedVersesList = document.getElementById('savedVersesList');
        
        if (favorites.length === 0) {
            savedVersesList.innerHTML = '<p class="no-favorites">No saved verses yet</p>';
            return;
        }

        let gitaData = [];
        try {
            const response = await fetch('./data/bhagavad_gita_unified.json');
            gitaData = await response.json();
        } catch (err) {
            console.error("Error loading gita data:", err);
            savedVersesList.innerHTML = '<p class="no-favorites">Failed to load verses data</p>';
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

            // Find verse in local JSON data
            const chapter = parseInt(fav.chapter);
            const verse = parseInt(fav.verse);
            const verseEntry = gitaData.find((v) => v.chapter === chapter && v.verse_start <= verse && v.verse_end >= verse);

            if (verseEntry) {
                const text = verseEntry.devanagari ? verseEntry.devanagari.replace(/\n+$/g, '').replace(/\n/g, '<br/>') : '';
                const translation = verseEntry.translation || '';
                verseCard.querySelector('.verse-content').innerHTML = `
                    <div class="sanskrit-text">${text}</div>
                    <div class="translation">${translation}</div>
                `;
            } else {
                verseCard.querySelector('.verse-content').innerHTML = 'Failed to load verse';
            }

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