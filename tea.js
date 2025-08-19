// Load tea data
let teaData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < teaData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayTeaRecipeDetail(index);
            return true;
        }
    }
    return false;
}

fetch('data/CafeRecipes--Tea.json')
    .then(response => response.json())
    .then(data => {
        teaData = data;
        
        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displayTeaRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading tea data:', error);
    });

// Display all tea recipes
function displayTeaRecipes() {
    const teaList = document.getElementById('teaList');
    
    if (!teaList) return;
    
    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }
    
    // Clear the list first
    teaList.innerHTML = '';
    
    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    let html = '';
    
    teaData.forEach((recipe, index) => {
        html += `
            <div class="recipe-card" onclick="showTeaRecipe(${index})">
                <div class="recipe-placeholder"><img src="img/placeholder.png" width=40/></div>
                <div>
                    <h3>${recipe.tea || 'Unnamed Recipe'}</h3>
                    <p>tea</p>
                </div>
            </div>
        `;
    });
    
    searchResultsContainer.innerHTML = html;
    teaList.appendChild(searchResultsContainer);
}

// Show tea recipe detail
function showTeaRecipe(index) {
    // Update URL hash
    window.location.hash = `recipe-${index}`;
    
    // Hide the main heading when showing recipe detail
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'none';
    }
    
    // Display recipe detail
    displayTeaRecipeDetail(index);
}

// Display tea recipe detail
function displayTeaRecipeDetail(index) {
    const recipe = teaData[index];
    const teaList = document.getElementById('teaList');
    
    if (!teaList) return;
    
    let html = `
        <div>
            <img src="img/placeholder.png" style="max-width: 200px; width: 100%; display: block; margin: 0 auto;"/>
            <h1>${recipe.tea}</h1>
            <div class="recipe-detail">
    `;
    
    // Add recipe details
    if (recipe.teaAmount) {
        html += `
        <div class="recipe-detail-row">
            <span>Tea Amount</span>
            <span>${recipe.teaAmount}</span>
        </div>`;
    }
    
    if (recipe.waterAmount) {
        html += `
        <div class="recipe-detail-row">
            <span>Water Amount</span>
            <span>${recipe.waterAmount}</span>
        </div>`;
    }
    
    if (recipe.temp) {
        html += `
        <div class="recipe-detail-row">
            <span>Temperature</span>
            <span>${recipe.temp}</span>
        </div>`;
    }
    
    if (recipe.serve) {
        html += `
        <div class="recipe-detail-row">
            <span>Serve</span>
            <span>${recipe.serve}</span>
        </div>`;
    }
    
    html += `
        </div>
    `;
    
    teaList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#') {
        displayTeaRecipes();
        return;
    }
    
    if (hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < teaData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayTeaRecipeDetail(index);
        }
    }
});
