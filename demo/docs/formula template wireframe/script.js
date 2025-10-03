// State management
let currentView = 'cards';
let filteredFamilies = [...templateFamilies];
let currentSlideIndex = 0;
let cardsPerView = 1;
let maxSlideIndex = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    calculateCardsPerView();
    renderTemplates();
    initializeEventListeners();
    updateSliderNavigation();
    updateCounts();
});

// Event listeners
function initializeEventListeners() {
    // View toggle buttons
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    // Quick search
    document.getElementById('quickSearch').addEventListener('input', function(e) {
        handleSearch(e.target.value);
    });

    // Slider navigation
    document.getElementById('sliderPrev').addEventListener('click', function() {
        previousSlide();
    });

    document.getElementById('sliderNext').addEventListener('click', function() {
        nextSlide();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (currentView === 'cards') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });

    // Window resize
    window.addEventListener('resize', function() {
        calculateCardsPerView();
        updateSliderPosition();
        updateSliderNavigation();
    });
}

// Calculate how many cards fit per view
function calculateCardsPerView() {
    const containerWidth = document.querySelector('.slider-wrapper')?.clientWidth || 1200;
    const cardWidth = 420;
    const gap = 20;
    cardsPerView = Math.floor(containerWidth / (cardWidth + gap)) || 1;
    maxSlideIndex = Math.max(0, filteredFamilies.length - cardsPerView);
}

// Switch between views
function switchView(viewName) {
    currentView = viewName;

    // Update toggle buttons
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Show/hide views
    document.getElementById('cardsView').style.display = viewName === 'cards' ? 'block' : 'none';
    document.getElementById('listView').style.display = viewName === 'list' ? 'block' : 'none';

    renderTemplates();
}

// Handle search
function handleSearch(query) {
    filteredFamilies = searchFamilies(query);
    currentSlideIndex = 0;
    calculateCardsPerView();
    renderTemplates();
    updateSliderNavigation();
    updateCounts();
}

// Render templates based on current view
function renderTemplates() {
    if (currentView === 'cards') {
        renderCardsView();
    } else {
        renderListView();
    }
    updateCounts();
}

// Render cards view (horizontal slider)
function renderCardsView() {
    const container = document.getElementById('sliderTrack');
    container.innerHTML = '';

    filteredFamilies.forEach(family => {
        const card = createFamilyCard(family);
        container.appendChild(card);
    });

    updateSliderPosition();
}

// Render list view
function renderListView() {
    const container = document.getElementById('listContainer');
    container.innerHTML = '';

    filteredFamilies.forEach(family => {
        const card = createListCard(family);
        container.appendChild(card);
    });
}

// Create family card for slider view
function createFamilyCard(family) {
    const template = document.getElementById('familyCardTemplate');
    const card = template.content.cloneNode(true);
    const cardElement = card.querySelector('.family-card');

    // Set data attributes
    cardElement.dataset.familyId = family.id;

    // Set basic info
    card.querySelector('.family-name').textContent = family.name;
    card.querySelector('.contract-type').textContent = family.contractType;
    card.querySelector('.product-location').textContent = `${family.product} • ${family.location}`;

    // Create components list
    const componentsList = card.querySelector('.components-list');
    componentsList.innerHTML = '';

    family.components.forEach(component => {
        const compEl = createComponentCheckbox(component, family.id);
        componentsList.appendChild(compEl);
    });

    // Update selected count
    updateSelectedCount(cardElement, family);

    // Update formula preview
    updateFormulaPreview(cardElement, family);

    // Add event listener for select button
    const selectBtn = card.querySelector('.btn-select');
    selectBtn.addEventListener('click', function() {
        selectTemplate(family);
    });

    return cardElement;
}

// Create list card
function createListCard(family) {
    const template = document.getElementById('listCardTemplate');
    const card = template.content.cloneNode(true);
    const cardElement = card.querySelector('.list-card');

    // Set data attributes
    cardElement.dataset.familyId = family.id;

    // Set basic info
    card.querySelector('.family-name').textContent = family.name;
    card.querySelector('.contract-type').textContent = family.contractType;
    card.querySelector('.product').textContent = family.product;
    card.querySelector('.location').textContent = family.location;

    // Create components grid
    const componentsGrid = card.querySelector('.components-list-grid');
    componentsGrid.innerHTML = '';

    family.components.forEach(component => {
        const compEl = createComponentCheckbox(component, family.id);
        componentsGrid.appendChild(compEl);
    });

    // Update selected count
    updateSelectedCount(cardElement, family);

    // Update formula preview
    updateFormulaPreview(cardElement, family);

    // Add event listener for select button
    const selectBtn = card.querySelector('.btn-select');
    selectBtn.addEventListener('click', function() {
        selectTemplate(family);
    });

    return cardElement;
}

// Create component checkbox
function createComponentCheckbox(component, familyId) {
    const template = document.getElementById('componentTemplate');
    const element = template.content.cloneNode(true);
    const label = element.querySelector('.component-checkbox');

    // Set checkbox
    const checkbox = element.querySelector('.component-check');
    checkbox.dataset.componentId = component.id;
    checkbox.dataset.familyId = familyId;
    checkbox.checked = component.selected;

    // Add change event listener
    checkbox.addEventListener('change', function() {
        handleComponentToggle(familyId, component.id, this.checked);
    });

    // Set component details
    if (component.source === 'Fixed') {
        element.querySelector('.component-percentage').textContent = `$${component.percentage.toFixed(3)}`;
    } else {
        element.querySelector('.component-percentage').textContent = `${component.percentage}%`;
    }

    const operator = element.querySelector('.component-operator');
    operator.textContent = component.operator;
    operator.classList.add(component.operator === '+' ? 'positive' : 'negative');

    element.querySelector('.component-source').textContent = component.source;
    element.querySelector('.component-instrument').textContent = component.instrument;
    element.querySelector('.component-date').textContent = component.dateRule;
    element.querySelector('.component-type').textContent = component.type;

    return label;
}

// Handle component toggle
function handleComponentToggle(familyId, componentId, isChecked) {
    // Update data model
    const family = getFamilyById(familyId);
    if (!family) return;

    const component = family.components.find(c => c.id === componentId);
    if (!component) return;

    component.selected = isChecked;

    // Update UI for all instances of this family
    const cards = document.querySelectorAll(`[data-family-id="${familyId}"]`);
    cards.forEach(card => {
        updateSelectedCount(card, family);
        updateFormulaPreview(card, family);
    });
}

// Update selected count
function updateSelectedCount(cardElement, family) {
    const selectedComponents = getSelectedComponents(family);
    const countElement = cardElement.querySelector('.count-num');
    if (countElement) {
        countElement.textContent = selectedComponents.length;
    }
}

// Update formula preview
function updateFormulaPreview(cardElement, family) {
    const formulaDisplay = cardElement.querySelector('.formula-display');
    if (!formulaDisplay) return;

    const formulaString = buildFormulaString(family);
    formulaDisplay.textContent = formulaString;
}

// Slider navigation functions
function previousSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSliderPosition();
        updateSliderNavigation();
        updateSliderIndicators();
    }
}

function nextSlide() {
    if (currentSlideIndex < maxSlideIndex) {
        currentSlideIndex++;
        updateSliderPosition();
        updateSliderNavigation();
        updateSliderIndicators();
    }
}

function updateSliderPosition() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const cardWidth = 420;
    const gap = 20;
    const offset = currentSlideIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
}

function updateSliderNavigation() {
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex >= maxSlideIndex;
    }
}

function updateSliderIndicators() {
    const currentPos = document.getElementById('currentPosition');
    const totalPos = document.getElementById('totalPosition');

    if (currentPos && totalPos) {
        currentPos.textContent = currentSlideIndex + 1;
        totalPos.textContent = filteredFamilies.length;
    }
}

// Update counts
function updateCounts() {
    const familyCount = document.getElementById('familyCount');
    const totalComponents = document.getElementById('totalComponents');

    if (familyCount) {
        familyCount.textContent = filteredFamilies.length;
    }

    if (totalComponents) {
        const total = filteredFamilies.reduce((sum, family) => sum + family.components.length, 0);
        totalComponents.textContent = total;
    }
}

// Template selection
function selectTemplate(family) {
    const selectedComponents = getSelectedComponents(family);

    if (selectedComponents.length === 0) {
        showNotification('Please select at least one component before continuing', 'warning');
        return;
    }

    const formulaString = buildFormulaString(family);

    // Show notification
    showNotification(`Selected "${family.name}" with ${selectedComponents.length} components`);

    // In a real implementation, this would:
    // 1. Save the selected template and components
    // 2. Navigate to the formula builder with pre-populated data
    // 3. Or apply the template to the current context

    console.log('Selected template:', {
        family: family.name,
        selectedComponents: selectedComponents.length,
        components: selectedComponents,
        formula: formulaString
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'warning' ? '#FF9500' : '#007AFF';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    notification.textContent = message;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Filter functions (called from HTML)
function clearFilters() {
    document.getElementById('quickSearch').value = '';
    filteredFamilies = [...templateFamilies];
    currentSlideIndex = 0;
    calculateCardsPerView();
    renderTemplates();
    updateSliderNavigation();
    updateCounts();
    showNotification('Filters cleared');
}

function adjustFilters() {
    // In a real implementation, this would open a filter modal
    showNotification('Filter adjustment modal would open here');
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    if (currentView === 'cards') {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    if (currentView === 'cards') {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next slide
            nextSlide();
        } else {
            // Swiped right - previous slide
            previousSlide();
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    updateSliderIndicators();
});
