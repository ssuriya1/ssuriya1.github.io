# Portfolio Website

## Overview
A modern, responsive portfolio website built with HTML, CSS, and JavaScript. The entire content is now managed through a JSON configuration file, making it incredibly easy to update without touching any code.

## 🚀 New JSON-Based Configuration System

Your portfolio now uses a centralized `config.json` file to manage all content. This means you can update your information, skills, projects, and more by simply editing one file!

### Quick Start
1. Open `config-manager.html` in your browser for an easy visual editor
2. Or directly edit `config.json` to customize your portfolio
3. Changes are reflected immediately on your website

## 📁 File Structure
```
├── index.html          # Main HTML file (now uses dynamic content)
├── styles.css          # Styling
├── script.js           # JavaScript (now loads from config.json)
├── config.json         # 🆕 All your portfolio content
├── config-manager.html # 🆕 Visual editor for easy updates
├── firebase-config.js  # Firebase configuration
└── README.md          # This file
```

## 🎯 What You Can Customize

### Personal Information
- Name and logo
- Typing animation texts
- Page title

### About Section
- Description/bio
- Skills organized by categories
- Section title

### Experience/Certifications
- Add/remove certifications
- Update URLs and titles

### Projects
- GitHub username for automatic project loading
- Number of projects to show initially
- Section title

### Contact Information
- Social media links
- Contact form configuration
- Form field customization

### Settings
- Typing animation speed
- Theme colors
- Various timing settings

## 🛠️ How to Update Your Portfolio

### Method 1: Visual Editor (Recommended)
1. Open `config-manager.html` in your browser
2. Fill in your information
3. Click "Generate Config"
4. Copy the generated JSON
5. Replace the content in `config.json`

### Method 2: Direct JSON Editing
Edit `config.json` directly. The structure is:

```json
{
  "personal": {
    "name": "Your Name",
    "logo": "YN",
    "typingTexts": ["Developer", "Designer"]
  },
  "about": {
    "title": "About Me",
    "description": "Your bio here...",
    "skills": {
      "Frontend": ["HTML", "CSS", "JavaScript"],
      "Backend": ["Node.js", "Python"]
    }
  }
  // ... more sections
}
```

## 🎨 Features

- **Responsive Design**: Works on all devices
- **Glass Morphism UI**: Modern, elegant design
- **Typing Animation**: Dynamic text effects
- **GitHub Integration**: Automatically loads your repositories
- **Contact Form**: Firebase-powered contact system
- **JSON Configuration**: Easy content management
- **Visual Editor**: No-code content updates

## 🔧 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Backend**: Firebase for contact form
- **APIs**: GitHub API for project loading
- **Configuration**: JSON-based content management

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

This portfolio is designed to work with GitHub Pages, but can be deployed anywhere:

1. Push your changes to GitHub
2. Enable GitHub Pages in repository settings
3. Your portfolio will be live at `https://yourusername.github.io`

## 💡 Tips

- Use the visual editor for quick updates
- Keep skill names concise for better display
- Test your JSON syntax before deploying
- Update your GitHub username in config for automatic project loading

## 🤝 Contributing

Feel free to fork this repository and customize it for your own use!

---

**Built with ❤️ and JSON configuration for easy customization**