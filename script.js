
// Get all variables from HTML
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.dropdown__date-depart');

// Mock Data
const API_KEY = '231f10a49992ec6c9c3a6a744446528e';
const CITIES_API_URL = 'mock-data/cities.json';
const PROXY = 'https://cors-anywhere.herokuapp.com/';
let cities = [];

function showCity(dropdown, input) {
  dropdown.textContent = '';
  if (input.value.trim().length < 3) {
    return;
  }
  const filteredCities = cities.filter(city => city.name.toLowerCase().includes(input.value.toLowerCase()));
  
  filteredCities.forEach(city => {
    const li = document.createElement('li');

    li.classList.add('dropdown__city');
    li.textContent = city.name;

    dropdown.appendChild(li);
  });
}
function handlerCity(eventTarget, input, dropdown) {
  if (eventTarget.tagName.toLowerCase() !== 'li') {
    return;
  }
  input.value = eventTarget.textContent;
  dropdown.textContent = '';
}
function asd() {

}
function getData(url, callback) {
  const request = new XMLHttpRequest();

  request.open('GET', url);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) {
      return;
    }
    // Get response from the server
    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
    
  });

  request.send();
}

inputCitiesFrom.addEventListener('input', () => {
  
  showCity(dropdownCitiesFrom, inputCitiesFrom);
    
});
inputCitiesTo.addEventListener('input', () => {
  
  showCity(dropdownCitiesTo, inputCitiesTo);
    
});
dropdownCitiesFrom.addEventListener('click', (event) => {

  handlerCity(event.target, inputCitiesFrom, dropdownCitiesFrom);

});
dropdownCitiesTo.addEventListener('click', (event) => {

  handlerCity(event.target, inputCitiesTo, dropdownCitiesTo);
  
});



getData(CITIES_API_URL, (data) => {
  const dataCities = JSON.parse(data);

  cities = dataCities.filter(city => !!city.name);
  
});

