/**
 * eCustomers Image Loader & Error Handler
 * Ensures all images load properly with fallbacks
 */
class ImageLoader {
  constructor() {
    this.placeholderImage = 'assets/images/placeholder.jpg';
    this.init();
  }

  init() {
    this.setupImageLoading();
    this.setupLazyLoading();
    this.setupErrorHandling();
  }

  setupImageLoading() {
    // Preload critical images
    const criticalImages = [
      'assets/images/pashmina.jpg',
      'assets/images/ciput.jpg',
      'assets/images/bros.jpg',
      'assets/images/scrunchie.jpg',
      'assets/images/innerninja.jpg',
      'assets/images/headband.jpg',
      'assets/images/handsock.jpg',
      'assets/images/kaoskaki.jpg',
      'assets/images/manset.jpg',
      'assets/images/jarumpentul.jpg'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  setupLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports lazy loading
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('lazy-loaded');
      });
    } else {
      // Fallback for older browsers
      this.setupIntersectionObserver();
    }
  }

  setupIntersectionObserver() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.src;
          
          // Create new image to load
          const newImg = new Image();
          newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.style.opacity = '1';
          };
          newImg.onerror = () => {
            this.handleImageError(img);
          };
          newImg.src = src;
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) {
        imageObserver.observe(img);
      }
    });
  }

  setupErrorHandling() {
    // Global error handler for images
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        this.handleImageError(e.target);
      }
    }, true);

    // Handle images that fail to load
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalHeight === 0) {
        this.handleImageError(img);
      }
    });
  }

  handleImageError(img) {
    // Only replace with placeholder if not already using it
    if (!img.src.includes('placeholder.jpg')) {
      img.src = this.placeholderImage;
    }
    
    // Add error class for styling
    img.classList.add('image-error');
    img.alt = 'Gambar tidak tersedia';
  }

  // Utility method to check if image exists
  async checkImageExists(src) {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Method to preload images
  preloadImages(imageArray) {
    return Promise.all(
      imageArray.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => reject(src);
          img.src = src;
        });
      })
    );
  }
}

// Initialize image loader
document.addEventListener('DOMContentLoaded', () => {
  window.imageLoader = new ImageLoader();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageLoader;
}
