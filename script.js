
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.dropdown__date-depart');

const cities = [
  'Moskow',
  'Kyiv',
  'Dnipro',
  'Odessa',
  'Kharkiv',
  'Lviv',
  'New-York',
  'London',
  'Rome',
  'Paris',
];

function showCity(dropdown, input) {
  dropdown.textContent = '';
  if (input.value.trim().length < 3) {
    return;
  }
  const filteredCities = cities.filter((city) => {
    return city.toLowerCase().includes(input.value.toLowerCase());
  });
  
  filteredCities.forEach(city => {
    const li = document.createElement('li');

    li.classList.add('dropdown__city');
    li.textContent = city;

    dropdown.appendChild(li);
  });
}

inputCitiesFrom.addEventListener('input', () => {
  
  showCity(dropdownCitiesFrom, inputCitiesFrom);
    
});

dropdownCitiesFrom.addEventListener('click', (event) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    inputCitiesFrom.value = target.textContent;
    dropdownCitiesFrom.textContent = '';
  }
});

inputCitiesTo.addEventListener('input', () => {
  
  showCity(dropdownCitiesTo, inputCitiesTo);
    
});

dropdownCitiesTo.addEventListener('click', (event) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    inputCitiesTo.value = target.textContent;
    dropdownCitiesTo.textContent = '';
  }
});

