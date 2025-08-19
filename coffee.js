// Load coffee data
let coffeeData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < coffeeData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayCoffeeRecipeDetail(index);
            return true;
        }
    }
    return false;
}

fetch('data/CafeRecipes--Coffee.json')
    .then(response => response.json())
    .then(data => {
        coffeeData = data;
        
        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displayCoffeeRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading coffee data:', error);
    });

// Display all coffee recipes
function displayCoffeeRecipes() {
    const coffeeList = document.getElementById('coffeeList');
    
    if (!coffeeList) return;
    
    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }
    
    // Clear the list first
    coffeeList.innerHTML = '';
    
    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    let html = '';
    
    coffeeData.forEach((recipe, index) => {
        html += `
            <div class="recipe-card" onclick="showCoffeeRecipe(${index})">
                <div class="recipe-placeholder"><img src="img/placeholder.png" width=40/></div>
                <div>
                    <h3>${recipe.coffee || 'Unnamed Recipe'}</h3>
                    <p>coffee</p>
                </div>
            </div>
        `;
    });
    
    searchResultsContainer.innerHTML = html;
    coffeeList.appendChild(searchResultsContainer);
}

// Show coffee recipe detail
function showCoffeeRecipe(index) {
    // Update URL hash
    window.location.hash = `recipe-${index}`;
    
    // Hide the main heading when showing recipe detail
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'none';
    }
    
    // Display recipe detail
    displayCoffeeRecipeDetail(index);
}

// Display coffee recipe detail
function displayCoffeeRecipeDetail(index) {
    const recipe = coffeeData[index];
    const coffeeList = document.getElementById('coffeeList');
    
    if (!coffeeList) return;
    
    let html = `
        <div>
            <img src="img/placeholder.png" style="max-width: 200px; width: 100%; display: block; margin: 0 auto;"/>
            <h1>${recipe.coffee}</h1>
            <div class="recipe-detail first">
    `;
    
    // Add recipe details
    if (recipe.shotTime) {
        html += `
            <div class="recipe-detail-row">
                <span>Shot Time</span>
                <span>${recipe.shotTime}</span>
            </div>        
        `;
    }
    
    if (recipe.yield) {
        html += `
            <div class="recipe-detail-row">
                <span>Yield</span>
                <span>${recipe.yield}</span>
            </div>
        `;
    }
    
    if (recipe.numShots) {
        html += `
            <div class="recipe-detail-row">
                <span>Shot type</span>
                <span>${recipe.numShots}</span>
            </div>        
        `;
    }
    
    if (recipe.vessel) {
        html += `
            <div class="recipe-detail-row">
                <span>Vessel</span>
                <span>${recipe.vessel}</span>
            </div>        
        `;
    }
    
    html += `
            </div>
    `;
    
    if (recipe.milkTexture) {
        html += `
            <div class="recipe-detail">
                <span>Milk Texture</span></br>
                <p>${recipe.milkTexture}</p>
            </div>
        `;
    }
    
    if (recipe.finishedLook) {
        html += `
            <div class="recipe-detail">
                <span>Finished Look</span><br>
                <span>${recipe.finishedLook}</span>
            </div>
        `;
    }
    
    if (recipe.notes) {
        html += `
            <div class="recipe-detail">
                <span>Notes</span><br>
                <span>${recipe.notes.replace(/\n/g, '<br>')}</span>
            </div>
        `;
    }
    
    html += `
        </div>
    `;
    
    coffeeList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#') {
        displayCoffeeRecipes();
        return;
    }
    
    if (hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < coffeeData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayCoffeeRecipeDetail(index);
        }
    }
});
