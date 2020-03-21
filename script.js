
// Get all variables from HTML
const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart'),
      cheapestDayTickets = document.getElementById('cheapest-ticket'),
      cheapestTickets = document.getElementById('other-cheap-tickets');

// Mock Data
const API_KEY = '231f10a49992ec6c9c3a6a744446528e';
const CITIES_API_URL = 'mock-data/cities.json'; // 'http://api.travelpayouts.com/data/ru/cities.json'
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';
const MAX_COUNT = 5;
let cities = [];
 
function showCity(dropdown, input) {
  dropdown.textContent = '';
  if (input.value.trim().length < 3) {
    return;
  }
  const filteredCities = cities.filter(city => city.name.toLowerCase().startsWith(input.value.toLowerCase()));
  
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
function getChanges(numberOfChanges) {
  if (numberOfChanges) {
    return numberOfChanges === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
}
function getCityName(code) {
  return cities.find(city => city.code === code).name;
}
function getDate(date) {
  return new Date(date).toLocaleString('ru', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
}
function getAviasalesLink(data) {
  let link = 'https://www.aviasales.ru/search/';

  link += 'data.origin';
  const dateDay = new Date(data.depart_date).getDate();
  const dateMonth = new Date(data.depart_date).getMonth() + 1;
  link += (dateDay < 10) ? '0' + dateDay : dateDay;
  link += (dateMonth < 10) ? '0' + dateMonth : dateMonth;
  link += data.destination;
  link += '1'; // add 1 person for fly

  return link;
}
function createCard(data) {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `<h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
              <div class="left-side">
                <a href="${getAviasalesLink(data)}" class="button button__buy" target="blank">Купить за ${data.value}₽</a>
              </div>
              <div class="right-side">
                <div class="block-left">
                  <div class="city__from">Вылет из города
                    <span class="city__name">${getCityName(data.origin)}</span>
                  </div>
                  <div class="date">${getDate(data.depart_date)}</div>
                </div>
                <div class="block-right">
                  <div class="changes">${getChanges(data.number_of_changes)}</div>
                  <div class="city__to">Город назначения:
                    <span class="city__name">${getCityName(data.destination)}</span>
                  </div>
                </div>
              </div>
            </div>`;
  } else {
    deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>';
  }

  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
}
function renderDayTickets(tickets) {
  cheapestDayTickets.style.display = 'block';
  cheapestDayTickets.innerHTML = '<h2>Самые дешевые билеты на выбранную дату</h2>';

  const card = createCard(tickets[0]);
  
  cheapestDayTickets.append(card);
}
function renderTickets(tickets) {
  cheapestTickets.style.display = 'block';
  cheapestTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
  tickets.sort((a, b) => a.value - b.value);

  for (let index = 0; index < tickets.length && index < MAX_COUNT; index++) {
    const card = createCard(tickets[index]);
  
    cheapestTickets.append(card); 
  }
}
function renderCheap(data, date) {
  const cheapTickets = JSON.parse(data).best_prices;
  const cheapTicketsDay = cheapTickets.filter(ticket => ticket.depart_date === date);

  renderDayTickets(cheapTicketsDay);
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
    from: cities.find(item => item.name === inputCitiesFrom.value),
    to: cities.find(item => item.name === inputCitiesTo.value),
    when: inputDateDepart.value
  };

  if (!formData.from || !formData.to) {
    alert('Введите корректно название города');
    return;
  }

  const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;

  getData(CALENDAR + requestData, (response) => {
    renderCheap(response, formData.when);
  });
  
});



getData(CITIES_API_URL, (data) => {
  const dataCities = JSON.parse(data);

  cities = dataCities.filter(city => !!city.name).sort((a, b) => a.name.localeCompare(b.name));
});

