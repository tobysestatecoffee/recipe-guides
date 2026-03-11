// Load batching data
let batchingData = [];

// Function to check if we should display a specific recipe based on URL hash
function checkHashAndDisplayRecipe() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < batchingData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayBatchingRecipeDetail(index);
            return true;
        }
    }
    return false;
}

fetch('data/CafeRecipes--Batching.json')
    .then(response => response.json())
    .then(data => {
        batchingData = data;

        // Check if we should display a specific recipe based on URL hash
        if (!checkHashAndDisplayRecipe()) {
            displayBatchingRecipes();
        }
    })
    .catch(error => {
        console.error('Error loading batching data:', error);
    });

// Display all batching recipes
function displayBatchingRecipes() {
    const batchingList = document.getElementById('batchingList');

    if (!batchingList) return;

    // Show the main heading when displaying the recipe list
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'block';
    }

    // Clear the list first
    batchingList.innerHTML = '';

    // Create a container for search results styling
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'template-grid';

    let html = '';

    batchingData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <article class="template-card" onclick="showBatchingRecipe(${index})" style="cursor: pointer;">
                <div class="card-thumbnail-wrap">
                <img class="card-thumbnail-bg" src="${imgSrc}" alt="" aria-hidden="true" loading="lazy">
                    <img class="card-thumbnail-fg" src="${imgSrc}" loading="lazy" style="object-fit: contain; border-radius: 0;">
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${recipe.name || 'Unnamed Recipe'}</h2>
                        <p class="card-description">Batching</p>
                    </div>
                </article>
                `;
    });

    searchResultsContainer.innerHTML = html;
    batchingList.appendChild(searchResultsContainer);
}

// Show batching recipe detail
function showBatchingRecipe(index) {
    // Update URL hash
    window.location.hash = `recipe-${index}`;

    // Hide the main heading when showing recipe detail
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.display = 'none';
    }

    // Display recipe detail
    displayBatchingRecipeDetail(index);
}

// Display batching recipe detail
function displayBatchingRecipeDetail(index) {
    const recipe = batchingData[index];
    const batchingList = document.getElementById('batchingList');

    if (!batchingList) return;

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

    batchingList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function () {
    const hash = window.location.hash;

    if (!hash || hash === '#') {
        displayBatchingRecipes();
        return;
    }

    if (hash.startsWith('#recipe-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && index >= 0 && index < batchingData.length) {
            // Hide the main heading when showing recipe detail
            const heading = document.querySelector('h1');
            if (heading) {
                heading.style.display = 'none';
            }
            displayBatchingRecipeDetail(index);
        }
    }
});
