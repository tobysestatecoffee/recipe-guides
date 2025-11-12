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
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Toggle icons and section links based on input
        if (query.length > 0) {
            searchIcon.style.opacity = '0';
            clearIcon.style.display = 'block';
            document.querySelector('.section-links').style.display = 'none';
        } else {
            searchIcon.style.opacity = '1';
            clearIcon.style.display = 'none';
            document.querySelector('.section-links').style.display = 'flex';
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
        searchResults.style.display = 'block';
    });
    
    // Handle clear button click
    clearIcon.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        searchIcon.style.opacity = '1';
        clearIcon.style.display = 'none';
        document.querySelector('.section-links').style.display = 'flex';
        searchInput.focus();
    });
    
    // Function to display search results
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No recipes found matching your search.</p>';
            return;
        }
        
        let html = '';
        
        results.slice(0, 10).forEach(result => {
            const [type, index] = result.ref.split('-');
            const idx = parseInt(index);
            
            let recipeName = '';
            let recipeDetails = '';
            let pageLink = '';
            
            switch (type) {
                case 'coffee':
                    recipeName = coffeeData[idx].coffee || '';
                    recipeDetails = `Coffee - ${coffeeData[idx].numShots || ''}`;
                    pageLink = `coffee.html#recipe-${idx}`;
                    break;
                case 'tea':
                    recipeName = teaData[idx].tea || '';
                    recipeDetails = `Tea - ${teaData[idx].temp || ''}`;
                    pageLink = `tea.html#recipe-${idx}`;
                    break;
                case 'slurry':
                    recipeName = slurryData[idx].name || '';
                    recipeDetails = 'Slurry';
                    pageLink = `slurry.html#recipe-${idx}`;
                    break;
                case 'chocchaimatcha':
                    recipeName = chocchaimatchaData[idx].drink || '';
                    recipeDetails = 'Chocolate, Chai & Matcha';
                    pageLink = `chocchaimatcha.html#recipe-${idx}`;
                    break;
            }
            
            html += `
                <div class="recipe-card">
                    <a href="${pageLink}">
                        <div class="recipe-placeholder"><img src="img/placeholder.png" width=40/></div>
                        <div>
                            <h3>${recipeName}</h3>
                            <p>${recipeDetails}</p>
                        </div>
                    </a>
                </div>
            `;
        });
        
        searchResults.innerHTML = html;
    }
}
