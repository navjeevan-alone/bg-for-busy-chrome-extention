const bhagavadGitaChapters = [
  { chapter: 1, verses: 47 },
  { chapter: 2, verses: 72 },
  { chapter: 3, verses: 43 },
  { chapter: 4, verses: 42 },
  { chapter: 5, verses: 29 },
  { chapter: 6, verses: 47 },
  { chapter: 7, verses: 30 },
  { chapter: 8, verses: 28 },
  { chapter: 9, verses: 34 },
  { chapter: 10, verses: 42 },
  { chapter: 11, verses: 55 },
  { chapter: 12, verses: 20 },
  { chapter: 13, verses: 35 },
  { chapter: 14, verses: 27 },
  { chapter: 15, verses: 20 },
  { chapter: 16, verses: 24 },
  { chapter: 17, verses: 28 },
  { chapter: 18, verses: 78 },
];

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "9892626e54msh5fda951b290e0c2p1e343fjsn1291936e2614",
    "X-RapidAPI-Host": "bhagavad-gita3.p.rapidapi.com",
  },
};

const chapterSelect = document.getElementById("chapter");
const verseSelect = document.getElementById("verse");

chapterSelect.addEventListener("change", () => {
  const chapterNumber = parseInt(chapterSelect.value);
  if (chapterNumber) {
    // Clear existing options
    verseSelect.innerHTML = "";
    // Add option for each verse in selected chapter
    for (let i = 1; i <= bhagavadGitaChapters[chapterNumber - 1].verses; i++) {
      const option = document.createElement("option");
      option.text = "Verse " + i;
      option.value = i;
      verseSelect.add(option);
    }
  }
});

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const chapterNumber = chapterSelect.value;
  const verseNumber = verseSelect.value;
  const resultContainer = document.getElementById("result");
  const meaningContainer = document.getElementById("meaning");
  const currentChapterContainer = document.getElementById("currentChapter");
  const currentVerseContainer = document.getElementById("currentVerse");
  const speakButton = document.getElementById("speakButton");
  const whichVerse = document.getElementById("whichVerse");
  const nextVerse = document.getElementById("nextButton");

  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/${verseNumber}/`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      updateUIWithAnimation(data, 'top');
    })
    .catch((err) => {
      console.error("Error fetching verse:", err);
      // Show error message to user
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML =
        "Sorry, couldn't load the verse. Please try again.";
      resultContainer.style.color = "red";
    });
});

//for random verse in random chapter
function showRandomVerse() {
  const resultContainer = document.getElementById("result");
  const meaningContainer = document.getElementById("meaning");
  const whichVerse = document.getElementById("whichVerse");
  const currentChapterContainer = document.getElementById("currentChapter");
  const currentVerseContainer = document.getElementById("currentVerse");
  const speakButton = document.getElementById("speakButton");
  const nextVerse = document.getElementById("nextButton");

  const maxChapters = 18;
  const maxVerses = [
    47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
  ];
  const randomChapterNumber = Math.floor(Math.random() * maxChapters) + 1;
  const randomVerseNumber =
    Math.floor(Math.random() * maxVerses[randomChapterNumber - 1]) + 1;

  // Update the chapter select
  chapterSelect.value = randomChapterNumber;

  // Clear and update verse select options for the random chapter
  verseSelect.innerHTML = "";
  for (let i = 1; i <= maxVerses[randomChapterNumber - 1]; i++) {
    const option = document.createElement("option");
    option.text = "Verse " + i;
    option.value = i;
    verseSelect.add(option);
  }

  // Set the verse select value
  verseSelect.value = randomVerseNumber;

  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${randomChapterNumber}/verses/${randomVerseNumber}/`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      updateUIWithAnimation(data, 'top');
    })
    .catch((err) => {
      console.error("Error fetching verse:", err);
      // Show error message to user
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML =
        "Sorry, couldn't load the verse. Please try again.";
      resultContainer.style.color = "red";
    });
}

const randomForm = document.getElementById("randomForm");

randomForm.addEventListener("submit", (e) => {
  e.preventDefault();

  showRandomVerse();
});

// latest for showing next verse

function showNextVerse() {
  const chapterNumber = chapterSelect.value;
  let verseNumber = parseInt(verseSelect.value);
  if (verseNumber < bhagavadGitaChapters[chapterNumber - 1].verses) {
    verseNumber++;
    verseSelect.value = verseNumber;
  } else {
    // go to next chapter if end of current chapter is reached
    if (chapterNumber < bhagavadGitaChapters.length) {
      chapterSelect.value = parseInt(chapterSelect.value) + 1;
      verseSelect.innerHTML = "";
      for (let i = 1; i <= bhagavadGitaChapters[chapterNumber].verses; i++) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = 1;
      verseSelect.value = verseNumber;
    } else {
      // reached end of Bhagavad Gita, reset to first chapter and verse
      chapterSelect.value = 1;
      verseSelect.innerHTML = "";
      for (let i = 1; i <= bhagavadGitaChapters[0].verses; i++) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = 1;
      verseSelect.value = verseNumber;
    }
  }

  // Fetch the verse directly instead of using form submission
  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterSelect.value}/verses/${verseSelect.value}/`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      updateUIWithAnimation(data, 'right');
    })
    .catch((err) => {
      console.error("Error fetching verse:", err);
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = "Sorry, couldn't load the verse. Please try again.";
      resultContainer.style.color = "red";
    });
}

document.getElementById("nextButton").addEventListener("click", showNextVerse);

//to show previous verse
function showPreviousVerse() {
  const chapterNumber = chapterSelect.value;
  let verseNumber = parseInt(verseSelect.value);
  if (verseNumber > 1) {
    verseNumber--;
    verseSelect.value = verseNumber;
  } else {
    // go to previous chapter if beginning of current chapter is reached
    if (chapterNumber > 1) {
      chapterSelect.value = parseInt(chapterSelect.value) - 1;
      verseSelect.innerHTML = "";
      for (
        let i = 1;
        i <= bhagavadGitaChapters[chapterNumber - 2].verses;
        i++
      ) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber = bhagavadGitaChapters[chapterNumber - 2].verses;
      verseSelect.value = verseNumber;
    } else {
      // reached beginning of Bhagavad Gita, go to last chapter and verse
      chapterSelect.value = bhagavadGitaChapters.length;
      verseSelect.innerHTML = "";
      for (
        let i = 1;
        i <= bhagavadGitaChapters[bhagavadGitaChapters.length - 1].verses;
        i++
      ) {
        const option = document.createElement("option");
        option.text = "Verse " + i;
        option.value = i;
        verseSelect.add(option);
      }
      verseNumber =
        bhagavadGitaChapters[bhagavadGitaChapters.length - 1].verses;
      verseSelect.value = verseNumber;
    }
  }

  // Fetch the verse directly instead of using form submission
  fetch(
    `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterSelect.value}/verses/${verseSelect.value}/`,
    options
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      updateUIWithAnimation(data, 'left');
    })
    .catch((err) => {
      console.error("Error fetching verse:", err);
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = "Sorry, couldn't load the verse. Please try again.";
      resultContainer.style.color = "red";
    });
}

document
  .getElementById("previousButton")
  .addEventListener("click", showPreviousVerse);

function updateUIWithAnimation(data, direction = 'top') {
  const resultContainer = document.getElementById("result");
  const meaningContainer = document.getElementById("meaning");
  const transliterationContainer = document.getElementById("transliteration");
  const wordMeaningsContainer = document.getElementById("word_meanings");
  const currentChapterContainer = document.getElementById("currentChapter");
  const currentVerseContainer = document.getElementById("currentVerse");
  const whichVerse = document.getElementById("whichVerse");
  const speakButton = document.getElementById("speakButton");
  const navButtons = document.querySelector(".nav-buttons");

  // Process word meanings to make Sanskrit terms bold and add spaces after semicolons
  const formattedWordMeanings = data.word_meanings.split(';')
    .map(part => {
      const [term, ...meaning] = part.split('—');
      if (meaning.length > 0) {
        return `<strong>${term.trim()}</strong>—${meaning.join('—')}`;
      }
      return part;
    })
    .join('; ');

  // Update content with formatted word meanings
  resultContainer.innerHTML = data.text;
  meaningContainer.innerHTML = data.translations[2].description;
  meaningContainer.setAttribute('data-title', 'Translation:');
  transliterationContainer.innerHTML = data.transliteration;
  transliterationContainer.setAttribute('data-title', 'Transliteration:');
  wordMeaningsContainer.innerHTML = formattedWordMeanings;
  wordMeaningsContainer.setAttribute('data-title', 'Word Meanings:');
  currentChapterContainer.innerHTML = data.chapter_number;
  currentVerseContainer.innerHTML = data.verse_number;

  // Make elements visible first
  resultContainer.style.display = 'block';
  meaningContainer.style.display = 'block';
  transliterationContainer.style.display = 'block';
  wordMeaningsContainer.style.display = 'block';
  whichVerse.style.display = 'block';
  speakButton.style.display = 'block';
  navButtons.style.display = 'flex';

  // Remove existing animation classes
  const elements = [
    resultContainer, 
    meaningContainer, 
    transliterationContainer,
    wordMeaningsContainer,
    whichVerse, 
    speakButton
  ];
  elements.forEach(el => {
    if (el) {
      el.classList.remove('slide-in-right', 'slide-in-left', 'show');
    }
  });

  // Force reflow to restart animation
  void resultContainer.offsetWidth;

  // Apply animations based on direction
  elements.forEach(el => {
    if (el) {
      if (direction === 'right') {
        el.classList.add('slide-in-right', 'show');
      } else if (direction === 'left') {
        el.classList.add('slide-in-left', 'show');
      } else {
        el.classList.add('show');
      }
    }
  });
  
  navButtons.classList.add("show");

  // Remove old event listeners first
  const oldSpeakButton = document.getElementById("speakButton");
  const newSpeakButton = oldSpeakButton.cloneNode(true);
  oldSpeakButton.parentNode.replaceChild(newSpeakButton, oldSpeakButton);

  // Add new event listener
  newSpeakButton.addEventListener("click", () => {
    chrome.tts.speak(data.text, {
      lang: "sa",
      rate: 1.0,
      pitch: 1.0
    });
  });

  const bookmarkButton = document.getElementById('bookmarkButton');
  bookmarkButton.hidden = false;
  
  // Check if verse is in favorites
  const isBookmarked = favorites.some(f => 
    f.chapter === data.chapter_number && f.verse === data.verse_number
  );
  bookmarkButton.classList.toggle('active', isBookmarked);

  // Update bookmark click handler
  bookmarkButton.onclick = () => {
    const verseInfo = {
      chapter: data.chapter_number,
      verse: data.verse_number
    };
    
    const existingIndex = favorites.findIndex(f => 
      f.chapter === verseInfo.chapter && f.verse === verseInfo.verse
    );
    
    if (existingIndex === -1) {
      favorites.push(verseInfo);
      bookmarkButton.classList.add('active');
    } else {
      favorites.splice(existingIndex, 1);
      bookmarkButton.classList.remove('active');
    }
    
    // Save to chrome storage
    chrome.storage.sync.set({ favorites });
    updateFavoritesList();
  };
}

document.getElementById('infoButton').addEventListener('click', () => {
    window.location.href = 'about.html';
});

// Add at the top with other constants
let favorites = [];

// Load favorites from storage when extension opens
chrome.storage.sync.get(['favorites'], (result) => {
  favorites = result.favorites || [];
  updateFavoritesList();
});

// Add this function to update favorites list
function updateFavoritesList() {
  const bookmarkCount = document.getElementById('bookmarkCount');
  const topBookmarkCount = document.getElementById('topBookmarkCount');
  
  if (favorites.length > 0) {
    const count = favorites.length.toString();
    bookmarkCount.textContent = count;
    topBookmarkCount.textContent = count;
    bookmarkCount.classList.add('show');
    topBookmarkCount.classList.add('show');
  } else {
    bookmarkCount.classList.remove('show');
    topBookmarkCount.classList.remove('show');
  }

  // Add click handler to both bookmark buttons to open favorites page
  document.getElementById('bookmarkButton').onclick = () => {
    window.location.href = 'favorites.html';
  };
  document.getElementById('savedVersesButton').onclick = () => {
    window.location.href = 'favorites.html';
  };
}
