# Movie and Meal Hub 🎬🍽️

A modern web application that combines movie discovery with delicious recipe exploration. Built with clean UI/UX design and interactive features.

![Movie and Meal Hub](https://img.shields.io/badge/version-1.0.0-pink) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Movie Hub
- 🔍 Search thousands of movies
- ⭐ View ratings and reviews
- 👥 See cast and crew details
- 🖼️ High-quality movie posters
- 📊 Comprehensive movie information

### Meal Food Hub
- 🍳 Browse hundreds of recipes
- 🥗 Filter by ingredients
- 🌍 Cuisines from around the world
- 🎥 Video cooking tutorials
- 📝 Step-by-step instructions

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling and animations
- **JavaScript** - Interactive functionality
- **Bootstrap** - Responsive grid system and components
- **SweetAlert2** - Beautiful, responsive popup boxes
- **OMDB API** - Movie database integration
- **TheMealDB API** - Recipe database integration

## 📋 Prerequisites

Before running this project, ensure you have:

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (for API calls)
- Basic understanding of HTML, CSS, and JavaScript

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Meal_OM_web_page.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd Meal_OM_web_page
   ```

3. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use a local server like Live Server in VS Code

### File Structure

```
Meal_OM_web_page/
│
├── index.html          # Main landing page
├── meal.html           # Recipe exploration page
├── movie.html          # Movie exploration page
│
├── accest/
│   ├── css/
│   │   ├── meal.css        # Meal page styles
│   │   ├── movie.css       # Movie page styles
│   │   ├── pagination.css  # Pagination styles
│   │   └── styles.css      # Main stylesheet
│   │
│   ├── Js/
│   │   ├── app.js          # Main application logic
│   │   ├── meal.js         # Meal functionality
│   │   └── movie.js        # Movie functionality
│   │
│   └── img/
│       ├── Food/           # Food-related images
│       ├── Movie/          # Movie-related images
│       ├── fm.png          # Main icon
│       └── food.png        # Food icon
│
├── .gitattributes      # Git attributes
└── .git/               # Git repository
```

## 🎨 Design Features

- **Gradient Backgrounds** - Eye-catching pink-to-coral gradient design
- **Card-Based Layout** - Clean, organized content presentation
- **Hover Effects** - Interactive button and card animations
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Typography** - Clean, readable fonts

## 💻 Usage

### Exploring Movies

1. Click on "Explore Movies" button or navigate to Movies section
2. Use the search bar to find specific movies
3. View detailed information including ratings, cast, and plot
4. Browse movie posters and trailers

### Discovering Recipes

1. Click on "Discover Recipes" button or navigate to Meals section
2. Search recipes by name or filter by ingredients
3. Watch video tutorials for cooking instructions
4. Explore cuisines from different cultures

## 🔧 API Integration

### OMDB API
```javascript
// Example API call
const API_KEY = 'your_omdb_api_key';
const url = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`;
```

### TheMealDB API
```javascript
// Example API call
const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
```

## 📦 Dependencies

### Bootstrap (v5.3+)
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

### SweetAlert2
```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### Font Awesome (Optional)
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 🎯 Key Features Implementation

### SweetAlert2 Examples

```javascript
// Success message
Swal.fire({
  title: 'Success!',
  text: 'Movie added to favorites',
  icon: 'success',
  confirmButtonColor: '#ff6b9d'
});

// Error handling
Swal.fire({
  title: 'Error!',
  text: 'Movie not found',
  icon: 'error',
  confirmButtonColor: '#ff6b9d'
});
```

### Responsive Grid with Bootstrap

```html
<div class="row">
  <div class="col-md-6 col-lg-4">
    <!-- Card content -->
  </div>
</div>
```

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Favorite movies and recipes saving
- [ ] Social sharing features
- [ ] Advanced filtering options
- [ ] Dark mode toggle
- [ ] Recipe rating system

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for movie data
- [TheMealDB API](https://www.themealdb.com/) for recipe data
- [Bootstrap](https://getbootstrap.com/) for responsive framework
- [SweetAlert2](https://sweetalert2.github.io/) for beautiful alerts
- Icons and images from respective sources

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email
- Check the documentation

---

**Built with ❤️ using OMDB API & TheMealDB API**

© 2025 Movie and Meal Hub. All rights reserved.
