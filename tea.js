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
    searchResultsContainer.className = 'template-grid';

    let html = '';

    teaData.forEach((recipe, index) => {
        const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
        html += `
            <article class="template-card" onclick="showTeaRecipe(${index})" style="cursor: pointer;">
                <div class="card-thumbnail-wrap">
                <img class="card-thumbnail-bg" src="${imgSrc}" alt="" aria-hidden="true" loading="lazy">
                    <img class="card-thumbnail-fg" src="${imgSrc}" loading="lazy" style="object-fit: contain; border-radius: 0;">
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${recipe.tea || 'Unnamed Recipe'}</h2>
                        <p class="card-description">Tea</p>
                    </div>
                </article>
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

    const imgSrc = recipe.Image && recipe.Image.trim() !== '' ? 'img/' + recipe.Image : 'img/placeholder.png';
    let html = `
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    <img src="${imgSrc}" style="max-width: 200px; width: 100%; display: block; margin: 0 auto 2rem; border-radius: var(--radius-md);" />
                    <h1 style="font-size: 2.5rem; font-weight: 400; color: var(--text-primary); margin-bottom: 2rem;">${recipe.tea}</h1>
                    <div class="recipe-detail first" style="text-align: left;">
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

    teaList.innerHTML = html;
}

// Handle hash changes for navigation
window.addEventListener('hashchange', function () {
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
