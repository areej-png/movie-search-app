// ====== Movie APP SCRIPT ======

// Select Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('movie-container');

// ====== Event Listeners ======

// Click on search button
searchButton.addEventListener('click', searchMovies);

// Press Enter key
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchMovies();
  }
});

// ====== Main Function ======
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) {
    resultsContainer.innerHTML = `<p>Please enter a movie name.</p>`;
    return;
  }

  // Show Loader
  resultsContainer.innerHTML = `<div class="loader"></div>`;

  const apiKey = 'ba676b7d';
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data.Response === 'True') {
      displayMovies(data.Search);
    } else {
      resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    resultsContainer.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  }

  searchInput.value = '';
}

// ===== Display Movies =====
function displayMovies(movies) {
  resultsContainer.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
        <img src="${
          movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/150x220?text=No+Image'
        }" alt="${movie.Title}">
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>Year: ${movie.Year}</p>
        </div>
      </div>
    `
    )
    .join('');
}

// ===== Show Movie Details =====
async function showMovieDetails(id) {
  const apiKey = 'ba676b7d';
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === 'True') {
      document.getElementById('modal-poster').src =
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/150x220?text=No+Image';
      document.getElementById('modal-title').textContent = data.Title;
      document.getElementById('modal-year').textContent = `Year: ${data.Year}`;
      document.getElementById('modal-genre').textContent = `Genre: ${data.Genre}`;
      document.getElementById('modal-plot').textContent = data.Plot;

      document.getElementById('movie-modal').style.display = 'flex';
    }
  } catch (err) {
    console.error('Error loading details:', err);
  }
}

// ===== Close modal =====
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('movie-modal').style.display = 'none';
});

// ===== Close modal when clicking background =====
document.getElementById('movie-modal').addEventListener('click', (e) => {
  if (e.target.id === 'movie-modal') {
    e.currentTarget.style.display = 'none';
  }
});
