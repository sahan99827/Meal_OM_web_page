const API_KEY = '1c768e4f';

document.getElementById('fetchButton').addEventListener('click', getMovieData);
document.getElementById('movieInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') getMovieData();
});

function getMovieData() {
    const input = document.getElementById('movieInput').value.trim();
    const output = document.getElementById('movieInfo');

    if (!input) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter a movie name first.',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    output.innerHTML = `
        <div class="card shadow-lg border-0">
            <div class="card-body text-center loading">
                <div class="spinner-border text-light mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4 class="text-white">🔍 Searching for movie...</h4>
            </div>
        </div>
    `;

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(input)}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === 'False') {
                output.innerHTML = `
                    <div class="card shadow-lg border-0">
                        <div class="card-body no-results">
                            <i class="bi bi-film display-1 text-muted mb-3"></i>
                            <h3>Movie Not Found</h3>
                            <p class="text-muted">Please try another search term.</p>
                        </div>
                    </div>
                `;
                return;
            }

            output.innerHTML = '';
            const card = createMovieCard(data);
            output.innerHTML = card;
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch movie data. Please try again.',
                confirmButtonColor: '#667eea'
            });
            output.innerHTML = '';
        });
}

function createMovieCard(movie) {
    const accordionId = `accordion-${movie.imdbID}`;
    
    let html = `
        <div class="card shadow-lg border-0 movie-card">
            <div class="movie-header">
                <h2 class="mb-3">${movie.Title}</h2>
                <div class="movie-meta">
                    <span class="badge bg-light text-dark"><i class="bi bi-calendar3 me-1"></i>${movie.Year}</span>
                    <span class="badge bg-light text-dark"><i class="bi bi-clock me-1"></i>${movie.Runtime}</span>
                    <span class="badge bg-light text-dark"><i class="bi bi-star-fill me-1"></i>${movie.Rated}</span>
                    <span class="badge bg-light text-dark"><i class="bi bi-film me-1"></i>${movie.Type}</span>
                </div>
            </div>
            
            ${movie.Poster !== 'N/A' ? `
            <div class="poster-container">
                <img src="${movie.Poster}" alt="${movie.Title} Poster" onclick="window.open('${movie.Poster}', '_blank')">
            </div>
            ` : ''}
            
            <div class="card-body">
                <div class="mb-4">
                    <input type="text" class="form-control" placeholder="🔍 Search within this card..." 
                           onkeyup="filterCard('${accordionId}', this.value)">
                </div>
                
                <div id="${accordionId}">
    `;

    // Awards Section
    if (movie.Awards && movie.Awards !== 'N/A') {
        html += `<div class="awards-section">🏆 ${movie.Awards}</div>`;
    }

    // Ratings Section
    if (movie.Ratings && movie.Ratings.length > 0) {
        html += `
            <div class="mb-4">
                <h4 class="mb-3"><i class="bi bi-star-fill text-warning me-2"></i>Ratings</h4>
                <div class="ratings-grid">
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

    // Categories as Bootstrap Accordion
    const categories = categorizeMovieData(movie);
    html += `<div class="accordion" id="movieAccordion">`;
    
    let index = 0;
    for (const [categoryName, categoryData] of Object.entries(categories)) {
        const collapseId = `collapse-${movie.imdbID}-${index}`;
        const hasData = Object.values(categoryData).some(val => val && val !== 'N/A');
        
        if (hasData) {
            html += `
                <div class="accordion-item category-section">
                    <h2 class="accordion-header">
                        <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                            ${categoryName}
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                         data-bs-parent="#movieAccordion">
                        <div class="accordion-body">
            `;
            
            for (const [key, value] of Object.entries(categoryData)) {
                if (value && value !== 'N/A') {
                    html += `
                        <div class="info-row row">
                            <div class="col-md-4 info-label">${key}</div>
                            <div class="col-md-8 info-value">${value}</div>
                        </div>
                    `;
                }
            }
            
            html += `
                        </div>
                    </div>
                </div>
            `;
        }
        index++;
    }
    
    html += `</div></div></div></div>`;
    return html;
}

function categorizeMovieData(movie) {
    return {
        '📋 Basic Information': {
            'Title': movie.Title,
            'Year': movie.Year,
            'Released': movie.Released,
            'Runtime': movie.Runtime,
            'Genre': movie.Genre,
            'Type': movie.Type,
            'Rated': movie.Rated
        },
        '🎭 Cast & Crew': {
            'Director': movie.Director,
            'Writer': movie.Writer,
            'Actors': movie.Actors
        },
        '📖 Plot & Details': {
            'Plot': movie.Plot,
            'Language': movie.Language,
            'Country': movie.Country
        },
        '💰 Box Office & Production': {
            'Box Office': movie.BoxOffice,
            'Production': movie.Production,
            'DVD': movie.DVD,
            'Website': movie.Website
        },
        '🔢 IMDB Information': {
            'IMDB Rating': movie.imdbRating,
            'IMDB Votes': movie.imdbVotes,
            'IMDB ID': movie.imdbID,
            'Metascore': movie.Metascore
        }
    };
}

function filterCard(accordionId, searchTerm) {
    const accordion = document.getElementById(accordionId);
    const items = accordion.querySelectorAll('.info-row, .category-section, .rating-card, .awards-section');
    const term = searchTerm.toLowerCase();

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}