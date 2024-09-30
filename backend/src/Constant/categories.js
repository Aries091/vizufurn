// src/constants/categories.js

export const CATEGORIES = {
    ELECTRONICS: 'electronics',
    CLOTHING: 'clothing',
    BOOKS: 'books',
    HOME_AND_GARDEN: 'home_and_garden',
    TOYS: 'toys',
    SPORTS: 'sports',
    BEAUTY: 'beauty',
    AUTOMOTIVE: 'automotive'
  };
  
  export const getCategoryName = (category) => {
    return category.toLowerCase().replace('_', ' ');
  };
  
  export const getAllCategories = () => Object.values(CATEGORIES);
  
  export const isValidCategory = (category) => Object.values(CATEGORIES).includes(category);