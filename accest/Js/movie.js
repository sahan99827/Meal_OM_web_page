const API_KEY = 'd168c0dd';

// Popular movies to display on page load
const POPULAR_MOVIES = [
    'Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction', 'The Matrix',
    'Fight Club', 'Forrest Gump', 'The Godfather', 'The Shawshank Redemption', 
    'Titanic', 'Avatar', 'The Avengers', 'Jurassic Park', 'Star Wars', 'The Lion King',
    'Gladiator', 'The Lord of the Rings', 'Harry Potter', 'Iron Man', 'Spider-Man',
    'Batman Begins', 'The Prestige', 'Memento', 'The Departed', 'Good Will Hunting',
    'Cast Away', 'Saving Private Ryan', 'Schindler\'s List', 'The Green Mile', 'Catch Me If You Can',
    'The Wolf of Wall Street', 'Django Unchained', 'Inglourious Basterds', 'Kill Bill',
    'The Terminator', 'Aliens', 'Blade Runner', 'The Fifth Element', 'Back to the Future',
    'Raiders of the Lost Ark', 'Die Hard', 'Mad Max', 'Rocky', 'Rambo', 'Joker',
    'Parasite', 'Get Out', 'A Quiet Place', 'Dunkirk', 'Whiplash', 'La La Land',
    'Black Panther', 'Wonder Woman', 'Aquaman', 'Deadpool', 'Logan', 'Thor'
];

let allMovies = [];
let currentPage = 1;
const itemsPerPage = 12;

// Load popular movies when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPopularMovies();
});

document.getElementById('fetchButton').addEventListener('click', getMovieData);
document.getElementById('movieInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getMovieData();
});

async function loadPopularMovies() {
    const output = document.getElementById('movieInfo');
    output.innerHTML = `
        <div class="text-center mb-4">
            <div class="spinner-border text-danger mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4>Loading Popular Movies...</h4>
        </div>
        <div class="movies-grid" id="moviesGrid"></div>
    `;

    const grid = document.getElementById('moviesGrid');
    
    // Show loading placeholders
    for (let i = 0; i < 12; i++) {
        grid.innerHTML += `
            <div class="movie-card-grid">
                <div class="placeholder-glow">
                    <div class="placeholder bg-secondary" style="height: 300px; width: 100%; border-radius: 10px;"></div>
                </div>
                <div class="movie-info-grid p-2">
                    <div class="placeholder-glow">
                        <span class="placeholder col-12 mb-2"></span>
                        <span class="placeholder col-8"></span>
                    </div>
                </div>
            </div>
        `;
    }

    // Fetch movies
    const moviePromises = POPULAR_MOVIES.map(title => 
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
            .then(res => res.json())
            .catch(err => null)
    );

    const movies = await Promise.all(moviePromises);
    allMovies = movies.filter(m => m && m.Response !== 'False');

    displayMoviesWithPagination();
}

function displayMoviesWithPagination() {
    const output = document.getElementById('movieInfo');
    const totalPages = Math.ceil(allMovies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovies = allMovies.slice(startIndex, endIndex);

    output.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3>Popular Movies</h3>
                <p class="text-muted mb-0">Showing ${startIndex + 1}-${Math.min(endIndex, allMovies.length)} of ${allMovies.length} movies</p>
            </div>
            <div class="text-muted">
                Page ${currentPage} of ${totalPages}
            </div>
        </div>
        <div class="movies-grid" id="moviesGrid"></div>
        <div id="paginationContainer"></div>
    `;

    const grid = document.getElementById('moviesGrid');
    currentMovies.forEach(movie => {
        const card = createMovieGridCard(movie);
        grid.appendChild(card);
    });

    // Add pagination controls
    createPagination(totalPages);
}

function createPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    
    let paginationHTML = `
        <nav aria-label="Movie pagination" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                        <i class="bi bi-chevron-left"></i> Previous
                    </a>
                </li>
    `;

    // Show page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                        Next <i class="bi bi-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    `;

    container.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(allMovies.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayMoviesWithPagination();
    window.scrollTo({ top: 1380, behavior: 'smooth' });
}

function createMovieGridCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card-grid';
    card.onclick = () => showMovieDetails(movie);
    
    card.innerHTML = `
        ${movie.imdbRating && movie.imdbRating !== 'N/A' ? 
            `<div class="movie-rating"><i class="bi bi-star-fill me-1"></i>${movie.imdbRating}</div>` : ''}
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
             alt="${movie.Title}" class="movie-poster">
        <div class="movie-info-grid">
            <div class="movie-title-grid">${movie.Title}</div>
            <div class="movie-year">${movie.Year}</div>
        </div>
    `;
    
    return card;
}

async function getMovieData() {
    const input = document.getElementById('movieInput').value.trim();
    const output = document.getElementById('movieInfo');

    if (!input) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter a movie name first.',
            confirmButtonColor: '#ff6b9d'
        });
        return;
    }

    output.innerHTML = `
        <div class="card shadow-lg border-0">
            <div class="card-body text-center loading">
                <div class="spinner-border text-danger mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4>🔍 Searching for "${input}"...</h4>
            </div>
        </div>
    `;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(input)}`);
        const data = await response.json();
        
        if (data.Response === 'False') {
            // Try searching by title if exact match fails
            const searchResponse = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(input)}`);
            const searchData = await searchResponse.json();
            
            if (searchData.Response === 'False' || !searchData.Search) {
                output.innerHTML = `
                    <div class="card shadow-lg border-0">
                        <div class="card-body no-results text-center py-5">
                            <i class="bi bi-film display-1 text-muted mb-3"></i>
                            <h3>Movie Not Found</h3>
                            <p class="text-muted">Please try another search term.</p>
                            <button class="btn btn-danger mt-3" onclick="currentPage=1; loadPopularMovies();">
                                <i class="bi bi-arrow-left me-2"></i>Back to Popular Movies
                            </button>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Show search results in grid
            displaySearchResults(searchData.Search);
            return;
        }

        // Show single movie details
        showMovieDetails(data);
    } catch (err) {
        console.error('Error:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch movie data. Please try again.',
            confirmButtonColor: '#ff6b9d'
        });
        loadPopularMovies();
    }
}

async function displaySearchResults(searchResults) {
    const output = document.getElementById('movieInfo');
    
    output.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3>Search Results</h3>
                <p class="text-muted mb-0">Found ${searchResults.length} movies</p>
            </div>
            <button class="btn btn-outline-danger" onclick="currentPage=1; loadPopularMovies();">
                <i class="bi bi-arrow-left me-2"></i>Back to Popular Movies
            </button>
        </div>
        <div class="movies-grid" id="searchGrid"></div>
    `;
    
    const grid = document.getElementById('searchGrid');
    
    // Fetch full details for each search result
    for (const result of searchResults.slice(0, 12)) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${result.imdbID}`);
            const movie = await response.json();
            
            if (movie.Response !== 'False') {
                const card = createMovieGridCard(movie);
                grid.appendChild(card);
            }
        } catch (err) {
            console.error('Error fetching movie:', err);
        }
    }
}

function showMovieDetails(movie) {
    const output = document.getElementById('movieInfo');
    let html = `
        <button class="btn btn-danger mb-4" onclick="currentPage=1; loadPopularMovies();">
            <i class="bi bi-arrow-left me-2"></i>Back to All Movies
        </button>
        
        <div class="card shadow-lg border-0">
            <div class="row g-0">
                <div class="col-md-4">
                    ${movie.Poster !== 'N/A' ? 
                        `<img src="${movie.Poster}" class="img-fluid rounded-start" alt="${movie.Title}" style="height: 100%; object-fit: cover;">` : 
                        '<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="height: 100%;"><i class="bi bi-film" style="font-size: 5rem;"></i></div>'}
                </div>
                <div class="col-md-8">
                    <div class="card-body p-4">
                        <h2 class="card-title mb-3">${movie.Title}</h2>
                        <div class="mb-3">
                            <span class="badge bg-primary me-2"><i class="bi bi-calendar3 me-1"></i>${movie.Year}</span>
                            <span class="badge bg-secondary me-2"><i class="bi bi-clock me-1"></i>${movie.Runtime || 'N/A'}</span>
                            <span class="badge bg-info me-2">${movie.Rated || 'N/A'}</span>
                            <span class="badge bg-warning text-dark">${movie.Type || 'movie'}</span>
                        </div>
    `;

    if (movie.Awards && movie.Awards !== 'N/A') {
        html += `<div class="awards-badge mb-3">🏆 ${movie.Awards}</div>`;
    }

    if (movie.Ratings && movie.Ratings.length > 0) {
        html += `
            <div class="mb-4">
                <h5><i class="bi bi-star-fill text-warning me-2"></i>Ratings</h5>
                <div class="ratings-section">
        `;
        
        movie.Ratings.forEach(rating => {
            html += `
                <div class="rating-card">
                    <div class="rating-source">${rating.Source}</div>
                    <div class="rating-value">${rating.Value}</div>
                </div>
            `;
        });
        
        html += `</div></div>`;
    }

    if (movie.Plot && movie.Plot !== 'N/A') {
        html += `
            <div class="mb-3">
                <h5>📖 Plot</h5>
                <p>${movie.Plot}</p>
            </div>
        `;
    }

    html += `
        <div class="row">
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Director</h6>
                <p>${movie.Director || 'N/A'}</p>
            </div>
            <div class="col-md-6 mb-3">
                <h6 class="text-muted">Genre</h6>
                <p>${movie.Genre || 'N/A'}</p>
            </div>
            <div class="col-md-12 mb-3">
                <h6 class="text-muted">Cast</h6>
                <p>${movie.Actors || 'N/A'}</p>
            </div>
        </div>
    `;

    html += `</div></div></div></div>`;
    output.innerHTML = html;
    window.scrollTo({ top: 1380, behavior: 'smooth' });
}