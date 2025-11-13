// Load slurry data
let slurryData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < slurryData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displaySlurryRecipeDetail(index);
            return true;
        }
    }
    return false;
}

fetch('data/CafeRecipes--Slurry.json')
    .then(response => response.json())
    .then(data => {
        slurryData = data;
        
        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displaySlurryRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading slurry data:', error);
    });

// Display all slurry recipes
function displaySlurryRecipes() {
    const slurryList = document.getElementById('slurryList');
    
    if (!slurryList) return;
    
    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }
    
    // Clear the list first
    slurryList.innerHTML = '';
    
    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    let html = '';
    
    slurryData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <div class="recipe-card" onclick="showSlurryRecipe(${index})">
                <div class="recipe-placeholder"><img src="${imgSrc}" width=40/></div>
                <div>
                    <h3>${recipe.name || 'Unnamed Recipe'}</h3>
                    <p>slurry</p>
                </div>
            </div>
        `;
    });
    
    searchResultsContainer.innerHTML = html;
    slurryList.appendChild(searchResultsContainer);
}

// Show slurry recipe detail
function showSlurryRecipe(index) {
    // Update URL hash
    window.location.hash = `recipe-${index}`;
    
    // Hide the main heading when showing recipe detail
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'none';
    }
    
    // Display recipe detail
    displaySlurryRecipeDetail(index);
}

// Display slurry recipe detail
function displaySlurryRecipeDetail(index) {
    const recipe = slurryData[index];
    const slurryList = document.getElementById('slurryList');
    
    if (!slurryList) return;
    
    const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
    let html = `
        <div>
            <img src="${imgSrc}" style="max-width: 200px; width: 100%; display: block; margin: 0 auto;"/>
            <h1>${recipe.name}</h1>    `;
    
    // Add ingredients
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        html += `
            </div>
            <div class="recipe-detail">
                <span>Ingredients</span><ul>`;
        recipe.ingredients.forEach(ingredient => {
            html += `<li>${ingredient}</li>`;
        });
        html += `</ul>`;
    }
    
    // Add method
    if (recipe.method && recipe.method.length > 0) {
        html += `
                </div>
                <div class="recipe-detail">
                    <span>Method</span><ol>`;
        recipe.method.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += `</ol>`;
    }
    
    html += `
                </div>    `;

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

    slurryList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#') {
        displaySlurryRecipes();
        return;
    }
    
    if (hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < slurryData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displaySlurryRecipeDetail(index);
        }
    }
});
