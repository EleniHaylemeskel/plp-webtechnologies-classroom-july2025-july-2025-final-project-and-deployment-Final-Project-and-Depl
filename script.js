// Show custom flavor input if "Custom Mix" selected
const flavorSelect = document.getElementById('flavor-select');
const customFlavor = document.getElementById('custom-flavor');

if(flavorSelect){
    flavorSelect.addEventListener('change', () => {
        customFlavor.style.display = flavorSelect.value === 'custom' ? 'block' : 'none';
    });
}

// Form submission feedback
const form = document.getElementById('order-form');
const message = document.getElementById('form-message');

if(form){
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent real submission for demo
        message.style.display = 'block';
        form.reset();
        if(customFlavor) customFlavor.style.display = 'none';
    });
}
