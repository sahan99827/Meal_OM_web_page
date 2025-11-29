const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
let mealModal;
let allMeals = [];
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAreas();
    loadAllMeals();
    
    mealModal = new bootstrap.Modal(document.getElementById('mealModal'));
    
    document.getElementById('mealNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByName();
    });
    
    document.getElementById('ingredientInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterByIngredient();
    });
});

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/list.php?c=list`);
        const data = await response.json();
        const select = document.getElementById('categorySelect');
        
        data.meals.forEach(meal => {
            const option = document.createElement('option');
            option.value = meal.strCategory;
            option.textContent = meal.strCategory;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadAreas() {
    try {
        const response = await fetch(`${API_BASE}/list.php?a=list`);
        const data = await response.json();
        const select = document.getElementById('areaSelect');
        
        data.meals.forEach(meal => {
            const option = document.createElement('option');
            option.value = meal.strArea;
            option.textContent = meal.strArea;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading areas:', error);
    }
}

async function loadAllMeals() {
    showLoading();
    currentPage = 1;
    
    try {
        const categories = ['Seafood', 'Beef', 'Chicken', 'Dessert', 'Pasta', 'Vegetarian', 'Pork', 'Lamb'];
        const promises = categories.map(cat => 
            fetch(`${API_BASE}/filter.php?c=${cat}`)
                .then(res => res.json())
                .catch(err => ({ meals: [] }))
        );
        
        const results = await Promise.all(promises);
        allMeals = [];
        
        results.forEach(result => {
            if (result.meals) {
                allMeals = allMeals.concat(result.meals);
            }
        });
        
        allMeals = Array.from(new Set(allMeals.map(m => m.idMeal)))
            .map(id => allMeals.find(m => m.idMeal === id))
            .sort(() => Math.random() - 0.5);
        
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

function displayMealsWithPagination() {
    const container = document.getElementById('mealsContainer');
    const totalPages = Math.ceil(allMeals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMeals = allMeals.slice(startIndex, endIndex);

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4>All Recipes</h4>
                <p class="text-muted mb-0">Showing ${startIndex + 1}-${Math.min(endIndex, allMeals.length)} of ${allMeals.length} recipes</p>
            </div>
            <div class="text-muted">
                Page ${currentPage} of ${totalPages}
            </div>
        </div>
        <div class="meals-grid" id="mealsGrid"></div>
        <div id="paginationContainer"></div>
    `;

    const grid = document.getElementById('mealsGrid');
    currentMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.onclick = () => showMealDetails(meal.idMeal);
        
        card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-image">
            <div class="meal-info">
                <div class="meal-title">${meal.strMeal}</div>
                <div class="meal-badges">
                    ${meal.strCategory ? `<span class="badge bg-primary">${meal.strCategory}</span>` : ''}
                    ${meal.strArea ? `<span class="badge bg-success">${meal.strArea}</span>` : ''}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });

    createMealPagination(totalPages);
}

function createMealPagination(totalPages) {
    const container = document.getElementById('paginationContainer');
    
    let paginationHTML = `
        <nav aria-label="Meal pagination" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeMealPage(${currentPage - 1}); return false;">
                        <i class="bi bi-chevron-left"></i> Previous
                    </a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeMealPage(1); return false;">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeMealPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeMealPage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeMealPage(${currentPage + 1}); return false;">
                        Next <i class="bi bi-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    `;

    container.innerHTML = paginationHTML;
}

function changeMealPage(page) {
    const totalPages = Math.ceil(allMeals.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayMealsWithPagination();
     window.scrollTo({ top: 1000, behavior: 'smooth' });
}

async function searchByName() {
    const input = document.getElementById('mealNameInput').value.trim();
    
    if (!input) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter a meal name first.',
            confirmButtonColor: '#ff9a56'
        });
        return;
    }

    showLoading();
    currentPage = 1;
    
    try {
        const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(input)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        allMeals = data.meals;
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

async function getRandomMeal() {
    showLoading();
    currentPage = 1;
    
    try {
        const promises = Array(12).fill().map(() => 
            fetch(`${API_BASE}/random.php`).then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        allMeals = results.map(r => r.meals[0]);
        
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

async function filterByCategory() {
    const category = document.getElementById('categorySelect').value;
    
    if (!category) {
        loadAllMeals();
        return;
    }

    showLoading();
    currentPage = 1;
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        allMeals = data.meals;
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

async function filterByArea() {
    const area = document.getElementById('areaSelect').value;
    
    if (!area) {
        loadAllMeals();
        return;
    }

    showLoading();
    currentPage = 1;
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        allMeals = data.meals;
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

async function filterByIngredient() {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    
    if (!ingredient) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter an ingredient first.',
            confirmButtonColor: '#ff9a56'
        });
        return;
    }

    showLoading();
    currentPage = 1;
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        allMeals = data.meals;
        displayMealsWithPagination();
    } catch (error) {
        showError();
    }
}

async function showMealDetails(mealId) {
    try {
        const response = await fetch(`${API_BASE}/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        if (!data.meals) return;
        
        const meal = data.meals[0];
        
        document.getElementById('modalTitle').textContent = meal.strMeal;
        document.getElementById('modalMeta').innerHTML = `
            <div class="mt-2">
                <span class="badge bg-light text-dark me-2">${meal.strCategory}</span>
                <span class="badge bg-light text-dark">${meal.strArea}</span>
            </div>
        `;
        
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim()) {
                ingredients.push(`<div class="ingredient-badge">${measure} ${ingredient}</div>`);
            }
        }
        
        const youtubeId = meal.strYoutube ? meal.strYoutube.split('v=')[1] : null;
        
        document.getElementById('modalBody').innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="detail-image">
            
            <div class="detail-section">
                <h5><i class="bi bi-card-checklist me-2"></i>Ingredients</h5>
                <div class="ingredients-grid">
                    ${ingredients.join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h5><i class="bi bi-book me-2"></i>Instructions</h5>
                <div class="instructions">${meal.strInstructions}</div>
            </div>
            
            ${youtubeId ? `
            <div class="detail-section">
                <h5><i class="bi bi-play-circle me-2"></i>Video Tutorial</h5>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            ` : ''}
            
            ${meal.strSource ? `
            <div class="detail-section">
                <h5><i class="bi bi-link-45deg me-2"></i>Source</h5>
                <a href="${meal.strSource}" target="_blank" class="btn btn-outline-danger">
                    <i class="bi bi-box-arrow-up-right me-2"></i>View Original Recipe
                </a>
            </div>
            ` : ''}
        `;
        
        mealModal.show();
    } catch (error) {
        console.error('Error loading meal details:', error);
    }
}

function showLoading() {
    document.getElementById('mealsContainer').innerHTML = `
        <div class="card shadow-lg border-0">
            <div class="card-body text-center loading">
                <div class="spinner-border mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4>🔍 Loading delicious meals...</h4>
            </div>
        </div>
    `;
}

function showNoResults() {
    document.getElementById('mealsContainer').innerHTML = `
        <div class="card shadow-lg border-0">
            <div class="card-body no-results">
                <i class="bi bi-emoji-frown display-1 text-muted mb-3"></i>
                <h3>No Meals Found</h3>
                <p class="text-muted">Please try another search term.</p>
                <button class="btn btn-danger mt-3" onclick="loadAllMeals()">
                    <i class="bi bi-arrow-left me-2"></i>Show All Meals
                </button>
            </div>
        </div>
    `;
}

function showError() {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch meal data. Please try again.',
        confirmButtonColor: '#ff9a56'
    });
    loadAllMeals();
}