/**
 * eCustomers Dark Mode Manager - Enhanced Version
 * Premium dark mode implementation with system preference detection
 */
class DarkModeManager {
  constructor() {
    this.themeToggle = null;
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    this.createToggleButton();
    this.loadTheme();
    this.setupSystemPreferenceListener();
    this.setupKeyboardShortcut();
    this.setupImageHandling();
  }

  createToggleButton() {
    // Create toggle button HTML
    const toggleHTML = `
      <button class="btn btn-sm dark-mode-toggle" 
              id="darkModeToggle" 
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              style="position: fixed; 
                     top: 20px; 
                     right: 20px; 
                     z-index: 1000;
                     background: rgba(255, 255, 255, 0.1);
                     backdrop-filter: blur(10px);
                     border: 1px solid rgba(255, 255, 255, 0.2);
                     color: inherit;
                     border-radius: 50%;
                     width: 44px;
                     height: 44px;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     transition: all 0.3s ease;
                     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        <i class="fas fa-moon" style="font-size: 1.2rem;"></i>
      </button>
    `;
    
    // Insert at end of body
    document.body.insertAdjacentHTML('beforeend', toggleHTML);
    
    // Get reference and add event listener
    this.themeToggle = document.getElementById('darkModeToggle');
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Add hover effect
    this.themeToggle.addEventListener('mouseenter', () => {
      this.themeToggle.style.transform = 'scale(1.1)';
      this.themeToggle.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    this.themeToggle.addEventListener('mouseleave', () => {
      this.themeToggle.style.transform = 'scale(1)';
      this.themeToggle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Save preference
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle icon
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('i');
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        this.themeToggle.style.background = 'rgba(0, 0, 0, 0.2)';
        this.themeToggle.style.color = '#fff';
        this.themeToggle.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      } else {
        icon.className = 'fas fa-moon';
        this.themeToggle.style.background = 'rgba(255, 255, 255, 0.1)';
        this.themeToggle.style.color = 'inherit';
        this.themeToggle.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    }
    
    // Update meta theme color
    const themeColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
    
    // Update images for dark mode
    this.updateImagesForTheme(theme);
  }

  loadTheme() {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved preference, check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Use saved preference or system preference
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme);
  }

  setupSystemPreferenceListener() {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
      }
    });
  }

  setupKeyboardShortcut() {
    // Add keyboard shortcut: Ctrl/Cmd + Shift + D
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  setupImageHandling() {
    // Handle image loading errors
    document.addEventListener('DOMContentLoaded', () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('error', () => {
          // Fallback to placeholder if image fails to load
          if (!img.src.includes('placeholder.jpg')) {
            img.src = 'assets/images/placeholder.jpg';
          }
        });
        
        // Add loading animation
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
      });
    });
  }

  updateImagesForTheme(theme) {
    // Optional: You can add theme-specific image handling here
    // For example, switching to darker versions of images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (theme === 'dark') {
        img.style.filter = 'brightness(0.9) contrast(1.1)';
      } else {
        img.style.filter = 'none';
      }
    });
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Public method to manually set theme
  setThemeManually(theme) {
    this.setTheme(theme);
    localStorage.setItem('theme', theme);
  }
}

// Initialize dark mode manager
document.addEventListener('DOMContentLoaded', () => {
  window.darkModeManager = new DarkModeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DarkModeManager;
}
