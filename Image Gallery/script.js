const gallery = document.querySelector('.gallery');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let currentIndex = 0;
let currentImages = [];

// Demo images with reliable sources (from actual free photo sites)
const demoImages = [
    { title: "Mountain Lake", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", category: "nature" },
    { title: "New York Skyline", url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", category: "city" },
    { title: "Lion", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80", category: "animals" },
    { title: "Forest", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", category: "nature" },
    { title: "London", url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", category: "city" },
    { title: "Puppy", url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80", category: "animals" },
    { title: "Ocean Sunset", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", category: "nature" },
    { title: "Tokyo Nights", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", category: "city" },
    { title: "Cat", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80", category: "animals" }
];

// Initialize gallery
function initGallery() {
    renderImages(demoImages);
}

// Render images to the gallery
function renderImages(images) {
    currentImages = images;
    gallery.innerHTML = '';
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', image.category || 'all');
        
        item.innerHTML = `
            <img src="${image.url}" alt="${image.title}" loading="lazy">
            <div class="overlay">
                <h3>${image.title}</h3>
                <i class="fas fa-expand"></i>
            </div>
        `;
        
        const img = item.querySelector('img');
        img.onerror = function() {
            this.src = 'https://picsum.photos/600/400';
            this.alt = 'Image unavailable';
        };
        
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(image);
        });
        
        gallery.appendChild(item);
    });
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        if (filter === 'all') {
            renderImages(demoImages);
        } else {
            const filtered = demoImages.filter(img => img.category === filter);
            renderImages(filtered);
        }
    });
});

// Search functionality
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Search demo images first
    const searchResults = demoImages.filter(img => 
        img.title.toLowerCase().includes(query) || 
        img.category.toLowerCase().includes(query)
    );
    
    if (searchResults.length > 0) {
        renderImages(searchResults);
    } else {
        // If no matches, show a message and use Picsum as fallback
        const fallbackImages = [];
        for (let i = 0; i < 9; i++) {
            fallbackImages.push({
                title: `${query} Image ${i + 1}`,
                url: `https://picsum.photos/seed/${query}${i}/600/400`,
                category: 'search'
            });
        }
        renderImages(fallbackImages);
    }
}

// Lightbox functions
function openLightbox(image) {
    lightboxImg.src = image.url;
    caption.textContent = image.title;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Next/Prev navigation
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    openLightbox(currentImages[currentIndex]);
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    openLightbox(currentImages[currentIndex]);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    }
});

// Initialize the gallery when page loads
initGallery();
