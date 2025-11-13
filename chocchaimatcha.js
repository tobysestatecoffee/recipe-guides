// Load Chocolate, Chai, Matcha data
let chocchaimatchaData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < chocchaimatchaData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayChocChaiMatchaRecipeDetail(index);
            return true;
        }
    }
    return false;
}

fetch('data/CafeRecipes--ChocChaiMatcha.json')
    .then(response => response.json())
    .then(data => {
        chocchaimatchaData = data;
        
        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displayChocChaiMatchaRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading Chocolate, Chai, Matcha data:', error);
    });

// Display all Chocolate, Chai, Matcha recipes
function displayChocChaiMatchaRecipes() {
    const chocchaimatchaList = document.getElementById('chocchaimatchaList');
    
    if (!chocchaimatchaList) return;
    
    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }
    
    // Clear the list first
    chocchaimatchaList.innerHTML = '';
    
    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    let html = '';
    
    chocchaimatchaData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <div class="recipe-card" onclick="showChocChaiMatchaRecipe(${index})">
                <div class="recipe-placeholder"><img src="${imgSrc}" width=40/></div>
                <div>
                    <h3>${recipe.drink || 'Unnamed Recipe'}</h3>
                    <p>${recipe.type || 'Unnamed Recipe'}</p>
                </div>
            </div>
        `;
    });
    
    searchResultsContainer.innerHTML = html;
    chocchaimatchaList.appendChild(searchResultsContainer);
}

// Show Chocolate, Chai, Matcha recipe detail
function showChocChaiMatchaRecipe(index) {
    // Update URL hash
    window.location.hash = `recipe-${index}`;
    
    // Hide the main heading when showing recipe detail
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'none';
    }
    
    // Display recipe detail
    displayChocChaiMatchaRecipeDetail(index);
}

// Display Chocolate, Chai, Matcha recipe detail
function displayChocChaiMatchaRecipeDetail(index) {
    const recipe = chocchaimatchaData[index];
    const chocchaimatchaList = document.getElementById('chocchaimatchaList');
    
    if (!chocchaimatchaList) return;
    
    const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
    let html = `
        <div>
            <img src="${imgSrc}" style="max-width: 200px; width: 100%; display: block; margin: 0 auto;"/>
            <h1>${recipe.drink}</h1>
            <div class="recipe-detail first">
    `;
    
    // Add recipe details    
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
                <span>Amount</span>
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
    
    chocchaimatchaList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#') {
        displayChocChaiMatchaRecipes();
        return;
    }
    
    if (hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < chocchaimatchaData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayChocChaiMatchaRecipeDetail(index);
        }
    }
});
