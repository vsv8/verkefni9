// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  const results = document.querySelector('.results');

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');

    fetchData(input.value);
  }

  function emptyResults() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function showLoading() {
    emptyResults()

    const gifDiv = document.createElement('div');
    gifDiv.className = 'loading';
    results.appendChild(gifDiv);

    const gif = document.createElement('img');
    gif.src = 'loading.gif';
    gifDiv.appendChild(gif);

    const gifText = document.createElement('p');
    gifText.appendChild(document.createTextNode('Leita að léni...'));
    gifDiv.appendChild(gifText);
  }

  function el(data) {
    emptyResults()

    const dl = document.createElement('dl');
    results.appendChild(dl);

    const domain = document.createElement('dt');
    dl.appendChild(domain);
    domain.appendChild(document.createTextNode('Lén'));

    const domainValue = document.createElement('dd');
    dl.appendChild(domainValue);
    domainValue.appendChild(document.createTextNode(data.domain));

    const registered = document.createElement('dt');
    dl.appendChild(registered);
    registered.appendChild(document.createTextNode('Skráð'));

    const registeredValue = document.createElement('dd');
    dl.appendChild(registeredValue);
    const registerDate = new Date(data.registered).toISOString().slice(0,10);
    registeredValue.appendChild(document.createTextNode((registerDate)));

    const lastChange = document.createElement('dt');
    dl.appendChild(lastChange);
    lastChange.appendChild(document.createTextNode('Seinast breytt'));

    const lastChangeValue = document.createElement('dd');
    dl.appendChild(lastChangeValue);
    const lastChangeDate = new Date(data.lastChange).toISOString().slice(0,10);
    lastChangeValue.appendChild(document.createTextNode(lastChangeDate));

    const expires = document.createElement('dt');
    dl.appendChild(expires);
    expires.appendChild(document.createTextNode('Rennur út'));

    const expiresValue = document.createElement('dd');
    dl.appendChild(expiresValue);
    const expiresDate = new Date(data.expires).toISOString().slice(0,10);
    expiresValue.appendChild(document.createTextNode(expiresDate));

    if (data.registrantname) {
      const registrantname = document.createElement('dt');
      dl.appendChild(registrantname);
      registrantname.appendChild(document.createTextNode('Skráningaraðili'));

      const registrantnameValue = document.createElement('dd');
      dl.appendChild(registrantnameValue);
      registrantnameValue.appendChild(document.createTextNode(data.registrantname));
    }

    if (data.email) {
      const email = document.createElement('dt');
      dl.appendChild(email);
      email.appendChild(document.createTextNode('Netfang'));

      const emailValue = document.createElement('dd');
      dl.appendChild(emailValue);
      emailValue.appendChild(document.createTextNode(data.email));
    }

    if (data.address) {
      const address = document.createElement('dt');
      dl.appendChild(address);
      address.appendChild(document.createTextNode('Staðsetning'));

      const addressValue = document.createElement('dd');
      dl.appendChild(addressValue);
      addressValue.appendChild(document.createTextNode(data.address));
    }

    if (data.country) {
      const country = document.createElement('dt');
      dl.appendChild(country);
      country.appendChild(document.createTextNode('Land'));

      const countryValue = document.createElement('dd');
      dl.appendChild(countryValue);
      countryValue.appendChild(document.createTextNode(data.country));
    }
  }

  function init(domains) {
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  function displayError(error) {
    emptyResults()

    results.appendChild(document.createTextNode(error));
  }

  function fetchData(webDomain) {
    fetch(`${API_URL}${webDomain}`)
      .then((res) => {
        if(res.ok){
          return res.json();
        }

        throw new Error('Error');
      })
      .then(showLoading())
      .then((data) => el(data.results[0]))
      .catch((error) => {
        if (error.name === 'TypeError') {
          displayError('Lén er ekki skráð');
        } else if (error.number === 431) {
          displayError('Lén verður að vera strengur');
        } else {
          displayError('Villa við að sækja gögn');
        }
      })
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
