const API_BASE = 'https://www.themealdb.com/api/json/v1/1';
let currentMeals = [];
let mealModal;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAreas();
    
    // Initialize Bootstrap modal
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

async function searchByName() {
    const input = document.getElementById('mealNameInput').value.trim();
    
    if (!input) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Input',
            text: 'Please enter a meal name first.',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(input)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        displayMeals(data.meals);
    } catch (error) {
        showError();
    }
}

async function getRandomMeal() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/random.php`);
        const data = await response.json();
        
        if (data.meals) {
            displayMeals(data.meals);
        }
    } catch (error) {
        showError();
    }
}

async function filterByCategory() {
    const category = document.getElementById('categorySelect').value;
    
    if (!category) {
        Swal.fire({
            icon: 'warning',
            title: 'No Selection',
            text: 'Please select a category first.',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        displayMeals(data.meals, true);
    } catch (error) {
        showError();
    }
}

async function filterByArea() {
    const area = document.getElementById('areaSelect').value;
    
    if (!area) {
        Swal.fire({
            icon: 'warning',
            title: 'No Selection',
            text: 'Please select an area first.',
            confirmButtonColor: '#667eea'
        });
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        displayMeals(data.meals, true);
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
            confirmButtonColor: '#667eea'
        });
        return;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
        const data = await response.json();
        
        if (!data.meals) {
            showNoResults();
            return;
        }
        
        displayMeals(data.meals, true);
    } catch (error) {
        showError();
    }
}

function displayMeals(meals) {
    const container = document.getElementById('mealsContainer');
    container.innerHTML = '<div class="meals-grid"></div>';
    const grid = container.querySelector('.meals-grid');
    
    currentMeals = meals;
    
    meals.forEach(meal => {
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
                <a href="${meal.strSource}" target="_blank" class="btn btn-outline-primary">
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
                <div class="spinner-border text-light mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <h4 class="text-white">🔍 Searching for delicious meals...</h4>
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
            </div>
        </div>
    `;
}

function showError() {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch meal data. Please try again.',
        confirmButtonColor: '#667eea'
    });
    document.getElementById('mealsContainer').innerHTML = '';
}