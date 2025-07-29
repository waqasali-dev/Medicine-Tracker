const medDetailsContainer = document.getElementById('med-details-container');
const addDoseBtn = document.getElementById('add-dose');

addDoseBtn.addEventListener('click', function (event) {
    event.preventDefault();


    const doseDetails = document.createElement('div');
    doseDetails.classList.add('dose-details');


    const medDose = document.createElement('div');
    medDose.classList.add('med-dose');

    const doseLabel = document.createElement('label');
    doseLabel.setAttribute('for', 'dose');
    doseLabel.textContent = 'Dose:';
    medDose.appendChild(doseLabel);

    const doseInput = document.createElement('input');
    doseInput.setAttribute('type', 'text');
    doseInput.setAttribute('id', 'dose');
    doseInput.setAttribute('class', 'dose');
    doseInput.setAttribute('name', 'dose');
    doseInput.required = true;
    medDose.appendChild(doseInput);

    doseDetails.appendChild(medDose);


    const medAge = document.createElement('div');
    medAge.classList.add('med-age');


    const startAgeDiv = document.createElement('div');
    startAgeDiv.classList.add('start-age');

    const startAgeLabel = document.createElement('label');
    startAgeLabel.setAttribute('for', 'startAge');
    startAgeLabel.textContent = 'Start Age:';
    startAgeDiv.appendChild(startAgeLabel);

    const startAgeInput = document.createElement('input');
    startAgeInput.setAttribute('type', 'number');
    startAgeInput.setAttribute('id', 'startAge');
    startAgeInput.setAttribute('class', 'age');
    startAgeInput.setAttribute('name', 'startAge');
    startAgeInput.required = true;
    startAgeDiv.appendChild(startAgeInput);


    const endAgeDiv = document.createElement('div');
    endAgeDiv.classList.add('end-age');

    const endAgeLabel = document.createElement('label');
    endAgeLabel.setAttribute('for', 'endAge');
    endAgeLabel.textContent = 'End Age:';
    endAgeDiv.appendChild(endAgeLabel);

    const endAgeInput = document.createElement('input');
    endAgeInput.setAttribute('type', 'number');
    endAgeInput.setAttribute('id', 'endAge');
    endAgeInput.setAttribute('class', 'age');
    endAgeInput.setAttribute('name', 'endAge');
    endAgeInput.required = true;
    endAgeDiv.appendChild(endAgeInput);



    const medPrice = document.createElement('div');
    medPrice.classList.add('med-price');


    const priceContainer = document.createElement('div');
    priceContainer.classList.add('price-container');


    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', 'price');
    priceLabel.textContent = 'Price:';
    priceContainer.appendChild(priceLabel);


    const priceInput = document.createElement('input');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('id', 'price');
    priceInput.setAttribute('class', 'price');
    priceInput.setAttribute('name', 'price');
    priceInput.required = true;
    priceContainer.appendChild(priceInput);


    medPrice.appendChild(priceContainer);


    const removeDoseBtn = document.createElement('button');
    removeDoseBtn.setAttribute('type', 'button');
    removeDoseBtn.classList.add('remove-dose');
    removeDoseBtn.setAttribute('id', 'delete-dose');
    removeDoseBtn.textContent = 'X';


    medPrice.appendChild(removeDoseBtn);

    medAge.appendChild(startAgeDiv);
    medAge.appendChild(endAgeDiv);

    medPrice.appendChild(removeDoseBtn);
    doseDetails.appendChild(medAge);
    doseDetails.appendChild(medPrice);

    medDetailsContainer.appendChild(doseDetails);

    const medDetailForm = document.getElementById('med-details-form');

    const currentHeight = parseInt(window.getComputedStyle(medDetailForm).height, 10);

    medDetailForm.style.height = `${currentHeight + 88}px`;

    const viewHeight = document.getElementById('admin-panel');
    const currentViewHeight = parseInt(window.getComputedStyle(viewHeight).height, 10);
    viewHeight.style.height = `${currentViewHeight + 88}px`;
});

medDetailsContainer.addEventListener('click', function (event) {

    if (event.target.classList.contains('remove-dose')) {

        const doseDetails = event.target.closest('.dose-details');
        if (doseDetails) {

            doseDetails.remove();

            const medDetailForm = document.getElementById('med-details-form');
            const currentHeight = parseInt(window.getComputedStyle(medDetailForm).height, 10);
            medDetailForm.style.height = `${currentHeight - 88}px`;

            const viewHeight = document.getElementById('admin-panel');
            const currentViewHeight = parseInt(window.getComputedStyle(viewHeight).height, 10);
            viewHeight.style.height = `${currentViewHeight - 88}px`;

        }

    }

});



document.getElementById('metod-2').addEventListener('change', function() {
    const value = this.value;
    if (value === 'add') window.location.href = '/admin';
    else if (value === 'delete') window.location.href = '/admin-delete';
    else if (value === 'update') window.location.href = '/admin-update';
});


