/**
 * eCustomers - Complete Dark Mode Manager
 * Enhanced dark mode with system preference, persistence, and accessibility
 */
class CompleteDarkModeManager {
  constructor() {
    this.themeToggle = null;
    this.currentTheme = 'light';
    this.systemPreference = 'light';
    this.init();
  }

  init() {
    this.detectSystemPreference();
    this.createToggleButton();
    this.loadTheme();
    this.setupSystemPreferenceListener();
    this.setupKeyboardShortcuts();
    this.setupAutoDetection();
    this.setupAccessibility();
  }

  detectSystemPreference() {
    this.systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  createToggleButton() {
    // Remove existing toggle if it exists
    const existingToggle = document.getElementById('darkModeToggle');
    if (existingToggle) {
      existingToggle.remove();
    }

    // Create enhanced toggle button
    const toggleHTML = `
      <button class="btn btn-sm dark-mode-toggle" 
              id="darkModeToggle" 
              aria-label="Toggle dark mode"
              title="Toggle dark mode (Ctrl+Shift+D)"
              style="position: fixed; 
                     top: 20px; 
                     right: 20px; 
                     z-index: 1000;
                     background: rgba(0, 0, 0, 0.1);
                     backdrop-filter: blur(10px);
                     border: 1px solid rgba(255, 255, 255, 0.2);
                     color: inherit;
                     border-radius: 50%;
                     width: 48px;
                     height: 48px;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     transition: all 0.3s ease;
                     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        <i class="fas fa-moon" style="font-size: 1.2rem;"></i>
      </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toggleHTML);
    
    this.themeToggle = document.getElementById('darkModeToggle');
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Enhanced hover effects
    this.themeToggle.addEventListener('mouseenter', () => {
      this.themeToggle.style.transform = 'scale(1.1) rotate(180deg)';
      this.themeToggle.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    this.themeToggle.addEventListener('mouseleave', () => {
      this.themeToggle.style.transform = 'scale(1) rotate(0deg)';
      this.themeToggle.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Save preference with timestamp
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('themeTimestamp', Date.now().toString());
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme, timestamp: Date.now() } 
    }));
    
    // Show notification
    this.showThemeNotification(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle icon with animation
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('i');
      icon.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
          this.themeToggle.style.background = 'rgba(255, 255, 255, 0.1)';
          this.themeToggle.style.color = '#fff';
          this.themeToggle.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        } else {
          icon.className = 'fas fa-moon';
          this.themeToggle.style.background = 'rgba(0, 0, 0, 0.1)';
          this.themeToggle.style.color = 'inherit';
          this.themeToggle.style.borderColor = 'rgba(0, 0, 0, 0.2)';
        }
      }, 150);
    }
    
    // Update meta theme color
    this.updateMetaThemeColor(theme);
    
    // Update images for theme
    this.updateImagesForTheme(theme);
    
    // Update form elements
    this.updateFormElements(theme);
  }

  loadTheme() {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved preference, use system preference
    const theme = savedTheme || this.systemPreference;
    
    this.setTheme(theme);
  }

  setupSystemPreferenceListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
      
      // Only apply if user hasn't set preference or it's been more than 24 hours
      const lastSet = localStorage.getItem('themeTimestamp');
      const hoursSinceLastSet = lastSet ? (Date.now() - parseInt(lastSet)) / (1000 * 60 * 60) : 24;
      
      if (!localStorage.getItem('theme') || hoursSinceLastSet > 24) {
        this.setTheme(this.systemPreference);
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  setupAutoDetection() {
    // Auto-detect theme on page load
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme && prefersDark) {
      this.setTheme('dark');
    }
  }

  setupAccessibility() {
    // Add ARIA attributes
    if (this.themeToggle) {
      this.themeToggle.setAttribute('role', 'switch');
      this.themeToggle.setAttribute('aria-checked', this.currentTheme === 'dark');
    }
    
    // Update ARIA on theme change
    window.addEventListener('themeChanged', (e) => {
      if (this.themeToggle) {
        this.themeToggle.setAttribute('aria-checked', e.detail.theme === 'dark');
      }
    });
  }

  updateMetaThemeColor(theme) {
    const themeColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = themeColor;
  }

  updateImagesForTheme(theme) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (theme === 'dark') {
        img.style.filter = 'brightness(0.9) contrast(1.1)';
      } else {
        img.style.filter = 'none';
      }
    });
  }

  updateFormElements(theme) {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    });
  }

  showThemeNotification(newTheme) {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1001;
      font-size: 14px;
      border: 1px
