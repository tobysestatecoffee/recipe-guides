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
    searchResultsContainer.className = 'template-grid';

    let html = '';

    slurryData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <article class="template-card" onclick="showSlurryRecipe(${index})" style="cursor: pointer;">
                <div class="card-thumbnail-wrap">
                <img class="card-thumbnail-bg" src="${imgSrc}" alt="" aria-hidden="true" loading="lazy">
                    <img class="card-thumbnail-fg" src="${imgSrc}" loading="lazy" style="object-fit: contain; border-radius: 0;">
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${recipe.name || 'Unnamed Recipe'}</h2>
                        <p class="card-description">Slurry</p>
                    </div>
                </article>
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
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    <img src="${imgSrc}" style="max-width: 200px; width: 100%; display: block; margin: 0 auto 2rem; border-radius: var(--radius-md);" />
                    <h1 style="font-size: 2.5rem; font-weight: 400; color: var(--text-primary); margin-bottom: 2rem;">${recipe.name}</h1>    `;

    // Add ingredients
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        html += `
            <div class="recipe-detail first" style="text-align: left;">
                <span>Ingredients</span><ul style="color: var(--text-primary); margin-top: 1rem;">`;
        recipe.ingredients.forEach(ingredient => {
            html += `<li>${ingredient}</li>`;
        });
        html += `</ul></div>`;
    }

    // Add method
    if (recipe.method && recipe.method.length > 0) {
        html += `
                <div class="recipe-detail first" style="text-align: left;">
                    <span>Method</span>
                    <ol style="color: var(--text-primary); margin-top: 1rem;">`;
        recipe.method.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += `</ol></div>`;
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

    slurryList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function () {
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
