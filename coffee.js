// Load coffee data
let coffeeData = [];
let filteredCoffeeData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < filteredCoffeeData.length) {
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
        filteredCoffeeData = data; // Initially show all recipes
        
        // Create filter buttons
        createFilterButtons();
        
        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displayCoffeeRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading coffee data:', error);
    });

// Create filter buttons
function createFilterButtons() {
    const coffeeList = document.getElementById('coffeeList');
    if (!coffeeList) return;
    
    // Create filter container if it doesn't exist
    let filterContainer = document.getElementById('filter-container');
    if (!filterContainer) {
        filterContainer = document.createElement('div');
        filterContainer.id = 'filter-container';
        filterContainer.style.marginBottom = '20px';
        filterContainer.style.textAlign = 'center';
        
        // Add filter buttons
        const filterHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="milk">Milk</button>
            <button class="filter-btn" data-filter="black">Black</button>
            <button class="filter-btn" data-filter="ice">Iced</button>
        `;
        filterContainer.innerHTML = filterHTML;
        coffeeList.parentNode.insertBefore(filterContainer, coffeeList);
        
        // Add event listeners to filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter recipes based on selection
                const filterType = this.getAttribute('data-filter');
                filterRecipes(filterType);
            });
        });
    }
}

// Filter recipes based on type
function filterRecipes(filterType) {
    switch(filterType) {
        case 'all':
            filteredCoffeeData = coffeeData;
            break;
        case 'milk':
            filteredCoffeeData = coffeeData.filter(recipe => recipe.type === 'milk');
            break;
        case 'black':
            filteredCoffeeData = coffeeData.filter(recipe => recipe.type === 'black');
            break;
        case 'ice':
            filteredCoffeeData = coffeeData.filter(recipe => recipe.type === 'ice');
            break;
        default:
            filteredCoffeeData = coffeeData;
    }
    
    // Display the filtered recipes
    if (!checkHashAndDisplayRecipe()) {
        displayCoffeeRecipes();
    }
}

// Display all coffee recipes
function displayCoffeeRecipes() {
    const coffeeList = document.getElementById('coffeeList');
    
    if (!coffeeList) return;
    
    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }
    
    // Show the filter container when displaying the recipe list
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        filterContainer.style.display = 'block';
    }
    
    // Clear the list first
    coffeeList.innerHTML = '';
    
    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    
    let html = '';
    
    filteredCoffeeData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <div class="recipe-card" onclick="showCoffeeRecipe(${index})">
                <div class="recipe-placeholder"><img src="${imgSrc}" width=40/></div>
                <div>
                    <h3>${recipe.coffee || 'Unnamed Recipe'}</h3>
                    <p>${recipe.type || 'coffee'}</p>
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
    const recipe = filteredCoffeeData[index];
    const coffeeList = document.getElementById('coffeeList');
    
    if (!coffeeList) return;
    
    // Hide the filter container when showing recipe detail
    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        filterContainer.style.display = 'none';
    }
    
    const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
    let html = `
        <div>
            <img src="${imgSrc}" style="max-width: 200px; width: 100%; display: block; margin: 0 auto;"/>
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

    
    if (recipe.dose) {
        html += `
            <div class="recipe-detail-row">
                <span>Dose</span>
                <span>${recipe.dose}</span>
            </div>        
        `;
    }    

    if (recipe.water) {
        html += `
            <div class="recipe-detail-row">
                <span>Water</span>
                <span>${recipe.water}</span>
            </div>        
        `;
    }
    
    if (recipe.waterTemp) {
        html += `
            <div class="recipe-detail-row">
                <span>Water Temperature</span>
                <span>${recipe.waterTemp}</span>
            </div>        
        `;
    }
    
    if (recipe.grind) {
        html += `
            <div class="recipe-detail-row">
                <span>Grind</span>
                <span>${recipe.grind}</span>
            </div>        
        `;
    }
    
    if (recipe.brewTime) {
        html += `
            <div class="recipe-detail-row">
                <span>Brew Time</span>
                <span>${recipe.brewTime}</span>
            </div>        
        `;
    }       
    
    html += `
            </div>
    `;

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
        if (!isNaN(index) && index >= 0 && index < filteredCoffeeData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayCoffeeRecipeDetail(index);
        }
    }
});
