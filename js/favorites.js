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

        const mergedVersesMap = {
            '1': [[16, 18], [21, 22], [32, 35], [37, 38]],
            '2': [[42, 43]],
            '5': [[8, 9], [27, 28]],
            '6': [[11, 12], [20, 23]],
            '10': [[4, 5], [12, 13]],
            '11': [[10, 11], [26, 27], [41, 42]],
            '12': [[3, 4], [6, 7], [13, 14], [18, 19]],
            '13': [[1, 2], [6, 7], [8, 12]],
            '14': [[22, 25]],
            '15': [[3, 4]],
            '16': [[1, 3], [13, 15]],
            '17': [[5, 6], [26, 27]],
            '18': [[51, 53]]
        };

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

            const chapter = parseInt(fav.chapter);
            const verseStr = String(fav.verse);
            const verse = parseInt(verseStr.split('-')[0]);

            let targetStart = verse;
            let targetEnd = verse;
            let isMerged = false;

            if (mergedVersesMap[chapter]) {
                for (const [start, end] of mergedVersesMap[chapter]) {
                    if (verse >= start && verse <= end) {
                        targetStart = start;
                        targetEnd = end;
                        isMerged = true;
                        break;
                    }
                }
            }

            const verseEntry = gitaData.find((v) => {
                if (isMerged) {
                    return v.verse_start === targetStart && v.verse_end === targetEnd && (v.chapter === chapter || v.chapter === targetStart);
                }
                return v.chapter === chapter && v.verse_start <= verse && v.verse_end >= verse;
            });

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