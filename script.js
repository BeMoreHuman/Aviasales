
// Get all variables from HTML
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');

// Mock Data
const API_KEY = '231f10a49992ec6c9c3a6a744446528e';
// 'http://api.travelpayouts.com/data/ru/cities.json'
const CITIES_API_URL = 'mock-data/cities.json';
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';
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
function renderCheapestTickets(tickets) {

}
function renderTickets(tickets) {

}
function renderCheap(data, date) {
  const cheapTickets = JSON.parse(data).best_prices;
  const cheapTicketsDay = cheapTickets.filter(ticket => ticket.depart_date === date);

  renderCheapestTickets(cheapTicketsDay);
  renderTickets(cheapTickets);
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

// Events handlers

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
formSearch.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = {
    from: cities.find(item => item.name === inputCitiesFrom.value).code,
    to: cities.find(item => item.name === inputCitiesTo.value).code,
    when: inputDateDepart.value
  };

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;

  getData(CALENDAR + requestData, (response) => {
    renderCheap(response, formData.when);
  });
  
});



getData(CITIES_API_URL, (data) => {
  const dataCities = JSON.parse(data);

  cities = dataCities.filter(city => !!city.name);
});

