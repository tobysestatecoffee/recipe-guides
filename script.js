// Load data from JSON files
let coffeeData = [];
let teaData = [];
let slurryData = [];
let chocchaimatchaData = [];

// Fetch all data when the page loads
Promise.all([
    fetch('data/CafeRecipes--Coffee.json').then(response => response.json()),
    fetch('data/CafeRecipes--Tea.json').then(response => response.json()),
    fetch('data/CafeRecipes--Slurry.json').then(response => response.json()),
    fetch('data/CafeRecipes--ChocChaiMatcha.json').then(response => response.json())
])
    .then(([coffee, tea, slurry, chocchaimatcha]) => {
        coffeeData = coffee;
        teaData = tea;
        slurryData = slurry;
        chocchaimatchaData = chocchaimatcha;

        // Initialize Lunr.js search index
        initializeSearch();

        const grid = document.getElementById('template-grid');
        if (grid) {
            displayAllCategorized(grid);
        }
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// Initialize search functionality
function initializeSearch() {
    // Create search index
    const searchIndex = lunr(function () {
        this.ref('id');
        this.field('name');
        this.field('type');
        this.field('details');

        // Add coffee recipes
        coffeeData.forEach((recipe, index) => {
            this.add({
                id: `coffee-${index}`,
                name: recipe.coffee || '',
                type: 'coffee',
                details: Object.values(recipe).join(' ')
            });
        });

        // Add tea recipes
        teaData.forEach((recipe, index) => {
            this.add({
                id: `tea-${index}`,
                name: recipe.tea || '',
                type: 'tea',
                details: Object.values(recipe).join(' ')
            });
        });

        // Add slurry recipes
        slurryData.forEach((recipe, index) => {
            this.add({
                id: `slurry-${index}`,
                name: recipe.name || '',
                type: 'slurry',
                details: Object.values(recipe).join(' ')
            });
        });

        // Add Chocolate, Chai, Matcha recipes
        chocchaimatchaData.forEach((recipe, index) => {
            this.add({
                id: `chocchaimatcha-${index}`,
                name: recipe.drink || '',
                type: 'chocchaimatcha',
                details: Object.values(recipe).join(' ')
            });
        });
    });

    // Set up search input event listener
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchIcon = document.querySelector('.search-icon');
    const clearIcon = document.getElementById('clearIcon');

    // Handle input events
    searchInput.addEventListener('input', function () {
        const query = this.value.trim();

        // Toggle icons and section links based on input
        if (query.length > 0) {
            searchIcon.style.opacity = '0';
            clearIcon.style.display = 'block';
            const templateGrid = document.getElementById('template-grid');
            if (templateGrid) templateGrid.style.setProperty('display', 'none', 'important');
        } else {
            searchIcon.style.opacity = '1';
            clearIcon.style.display = 'none';
            const templateGrid = document.getElementById('template-grid');
            if (templateGrid) templateGrid.style.setProperty('display', 'flex', 'important');
        }

        if (query.length === 0) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        // Perform search
        const results = searchIndex.search(query);

        // Display results
        displaySearchResults(results);
        searchResults.style.display = results.length > 0 ? 'grid' : 'block';
    });

    // Handle clear button click
    clearIcon.addEventListener('click', function () {
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchIcon.style.opacity = '1';
        clearIcon.style.display = 'none';
        const templateGrid = document.getElementById('template-grid');
        if (templateGrid) templateGrid.style.setProperty('display', 'flex', 'important');
        searchInput.focus();
    });

    // Function to display search results
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="empty-state"><h3>No recipes found matching your search.</h3></div>';
            searchResults.className = 'search-results';
            return;
        }

        searchResults.className = 'template-grid';
        let html = '';

        results.slice(0, 10).forEach(result => {
            const [type, index] = result.ref.split('-');
            const idx = parseInt(index);

            let recipeName = '';
            let recipeDetails = '';
            let pageLink = '';
            let imgSrcPath = '';

            switch (type) {
                case 'coffee':
                    recipeName = coffeeData[idx].coffee || '';
                    recipeDetails = `Coffee - ${coffeeData[idx].numShots || ''}`;
                    pageLink = `coffee.html#recipe-${idx}`;
                    imgSrcPath = coffeeData[idx].Image;
                    break;
                case 'tea':
                    recipeName = teaData[idx].tea || '';
                    recipeDetails = `Tea - ${teaData[idx].temp || ''}`;
                    pageLink = `tea.html#recipe-${idx}`;
                    imgSrcPath = teaData[idx].Image;
                    break;
                case 'slurry':
                    recipeName = slurryData[idx].name || '';
                    recipeDetails = 'Slurry';
                    pageLink = `slurry.html#recipe-${idx}`;
                    imgSrcPath = slurryData[idx].Image;
                    break;
                case 'chocchaimatcha':
                    recipeName = chocchaimatchaData[idx].drink || '';
                    recipeDetails = 'Chocolate, Chai & Matcha';
                    pageLink = `chocchaimatcha.html#recipe-${idx}`;
                    imgSrcPath = chocchaimatchaData[idx].Image;
                    break;
            }

            const imgSrc = imgSrcPath && imgSrcPath.trim() !== '' ? 'img/' + imgSrcPath : 'img/placeholder.png';

            html += `
                <article class="template-card" onclick="window.location.href='${pageLink}'" style="cursor: pointer; min-width: 300px;">
                    <div class="card-thumbnail-wrap">
                        <img class="card-thumbnail-bg" src="${imgSrc}" alt="" aria-hidden="true" loading="lazy">
                        <img class="card-thumbnail-fg" src="${imgSrc}" loading="lazy" style="object-fit: contain; border-radius: 0;">
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${recipeName}</h2>
                        <p class="card-description">${recipeDetails}</p>
                    </div>
                </article>
            `;
        });

        searchResults.innerHTML = html;
    }
}

// Function to display all grouped recipes on index load
function displayAllCategorized(container) {
    let html = '';

    // Helper to render a group
    function renderSection(title, count, htmlCards, link) {
        if (!htmlCards) return '';
        return `
            <div class="category-section">
                <div class="category-header">
                    <h2 class="category-title">${title} <span class="count">${count}</span></h2>
                    <a href="${link}" class="view-all-button">View all</a>
                </div>
                <div class="category-scroll-container">
                    ${htmlCards}
                </div>
            </div>
        `;
    }

    // Helper to create card HTML
    function createCardHTML(img, title, type, link) {
        const imgSrc = img && img.trim() !== '' ? 'img/' + img : 'img/placeholder.png';
        return `
            <article class="template-card" onclick="window.location.href='${link}'" style="cursor: pointer; min-width: 300px;">
                <div class="card-thumbnail-wrap">
                    <img class="card-thumbnail-bg" src="${imgSrc}" alt="" aria-hidden="true" loading="lazy">
                    <img class="card-thumbnail-fg" src="${imgSrc}" loading="lazy" style="object-fit: contain; border-radius: 0;">
                </div>
                <div class="card-body">
                    <h2 class="card-title">${title}</h2>
                    <p class="card-description">${type}</p>
                </div>
            </article>
        `;
    }

    // Build Coffee
    let coffeeHTML = coffeeData.map((r, i) => createCardHTML(r.Image, r.coffee || 'Unnamed Recipe', r.type || 'coffee', `coffee.html#recipe-${i}`)).join('');
    html += renderSection('Coffee', coffeeData.length, coffeeHTML, 'coffee.html');

    // Build Chocolate, Chai, Matcha
    let chocHTML = chocchaimatchaData.map((r, i) => createCardHTML(r.Image, r.drink || 'Unnamed Recipe', r.type || 'Chocolate, Chai & Matcha', `chocchaimatcha.html#recipe-${i}`)).join('');
    html += renderSection('Chocolate, Chai & Matcha', chocchaimatchaData.length, chocHTML, 'chocchaimatcha.html');

    // Build Tea
    let teaHTML = teaData.map((r, i) => createCardHTML(r.Image, r.tea || 'Unnamed Recipe', 'Tea', `tea.html#recipe-${i}`)).join('');
    html += renderSection('Tea', teaData.length, teaHTML, 'tea.html');

    // Build Slurry
    let slurryHTML = slurryData.map((r, i) => createCardHTML(r.Image, r.name || 'Unnamed Recipe', 'Slurry', `slurry.html#recipe-${i}`)).join('');
    html += renderSection('Slurry', slurryData.length, slurryHTML, 'slurry.html');

    container.innerHTML = html;

    // Initialize scroll arrows after rendering
    if (window.initScrollArrows) {
        window.initScrollArrows();
    }
}

// Function to initialize horizontal scroll arrows
window.initScrollArrows = function () {
    const containers = document.querySelectorAll('.category-scroll-container');

    containers.forEach(container => {
        // Prevent double initialization
        if (container.parentElement.classList.contains('category-scroll-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'category-scroll-wrapper';
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);

        const leftBtn = document.createElement('button');
        leftBtn.className = 'scroll-btn left';
        leftBtn.innerHTML = '←';
        leftBtn.setAttribute('aria-label', 'Scroll left');

        const rightBtn = document.createElement('button');
        rightBtn.className = 'scroll-btn right';
        rightBtn.innerHTML = '→';
        rightBtn.setAttribute('aria-label', 'Scroll right');

        wrapper.appendChild(leftBtn);
        wrapper.appendChild(rightBtn);

        const updateArrows = () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            // Show left arrow if we have scrolled right
            if (scrollLeft > 20) {
                leftBtn.classList.add('is-visible');
            } else {
                leftBtn.classList.remove('is-visible');
            }

            // Show right arrow if there is more to scroll (with some buffer)
            if (scrollLeft < maxScroll - 20) {
                rightBtn.classList.add('is-visible');
            } else {
                rightBtn.classList.remove('is-visible');
            }
        };

        leftBtn.addEventListener('click', () => {
            container.scrollBy({ left: -container.clientWidth * 0.75, behavior: 'smooth' });
        });

        rightBtn.addEventListener('click', () => {
            container.scrollBy({ left: container.clientWidth * 0.75, behavior: 'smooth' });
        });

        container.addEventListener('scroll', updateArrows);
        // Using ResizeObserver for more robust updates
        const resizeObserver = new ResizeObserver(() => updateArrows());
        resizeObserver.observe(container);

        // Initial check
        setTimeout(updateArrows, 100);
    });
}
