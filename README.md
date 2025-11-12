# Toby's Cafe Recipe Guide

A comprehensive web-based application for standardising drink preparation across Toby's Estate Coffee Roasters' national and international markets. This guide ensures consistent quality and preparation methods for all cafe beverages.

## Purpose

This application serves as a centralised digital recipe guide to maintain consistency in drink preparation across all Toby's Estate locations. It provides detailed instructions for preparing coffee, tea, chocolate, chai, matcha, and slurry beverages according to standardised recipes.

## Features

- **Search Functionality**: Quickly find recipes by name using the search feature
- **Categorized Recipes**: Browse drinks by category (Coffee, Chocolate/Chai/Matcha, Tea, Slurry)
- **Detailed Instructions**: Each recipe includes specific preparation details:
  - Shot time and yield
  - Number of shots
  - Recommended vessel
  - Milk texture requirements
  - Finished look guidelines
  - Additional notes
- **Responsive Design**: Works on both desktop and mobile devices

## Recipe Categories

1. **Coffee**: Espresso-based drinks including Ristretto, Espresso, Long Black, Macchiato, Piccolo, Flat White, Cappuccino, Latte, and specialty items
2. **Chocolate, Chai & Matcha**: Specialty beverages in these categories
3. **Tea**: Various tea preparations
4. **Slurry**: Specialized slurry-based drinks

## Technical Implementation

### File Structure
```
├── index.html              # Main search page
├── coffee.html             # Coffee recipes page
├── chocchaimatcha.html     # Chocolate/Chai/Matcha recipes page
├── tea.html                # Tea recipes page
├── slurry.html             # Slurry recipes page
├── styles.css              # Shared styling
├── script.js               # Main search functionality
├── coffee.js               # Coffee recipes logic
├── chocchaimatcha.js       # Chocolate/Chai/Matcha recipes logic
├── tea.js                  # Tea recipes logic
├── slurry.js               # Slurry recipes logic
├── data/
│   ├── CafeRecipes--Coffee.json
│   ├── CafeRecipes--ChocChaiMatcha.json
│   ├── CafeRecipes--Tea.json
│   └── CafeRecipes--Slurry.json
└── img/
    ├── logo.png
    └── placeholder.png
```

### Data Structure
Each recipe in the JSON files contains the following fields:
- `coffee`: Name of the drink
- `shotTime`: Recommended extraction time
- `yield`: Expected output weight
- `numShots`: Number and type of shots
- `vessel`: Recommended serving vessel
- `milkTexture`: Milk preparation requirements
- `finishedLook`: Visual description of properly prepared drink
- `notes`: Additional preparation notes

### How to Use
1. Open `index.html` in a web browser
2. Search for a specific drink or browse by category
3. Click on any recipe to view detailed preparation instructions
4. Use the back link to return to the category list

### Dependencies
- [Lunr.js](https://lunrjs.com/) for search functionality (loaded via CDN)

## Deployment
Simply host all files on a web server or open `index.html` directly in a browser. No build process is required.

## Contributing
To add or modify recipes:
1. Update the appropriate JSON file in the `data/` directory
2. Ensure all required fields are filled in consistently
3. Test changes by opening the relevant HTML file in a browser

## License
© 2025 Toby's Estate Coffee Roasters. All rights reserved.
