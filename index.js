document.addEventListener('DOMContentLoaded', updateHTML);

function updateHTML() {
  const applicableParents = document.querySelectorAll('[data-restsheet-url]');
  for (let i = 0, element; element = applicableParents[i]; i++) {
    const URL = element.dataset.restsheetUrl,
        search = element.dataset.restsheetSearch,
        limit = element.dataset.restsheetLimit,
        offset = element.dataset.restsheetOffset;

    element.style.display = 'none';

    fetchData({URL, search, limit, offset})
        .then(data => {
          // Get innerHTML, interpolate it for each row in spreadsheet
          const contentUnits = [];
          for (let i = 0; i < data.length; i++) {
            contentUnits.push(element.innerHTML);
          }
          const interpolatedUnits = contentUnits.map((contentUnit, index) => {
            return interpolateString(contentUnit, data[index]);
          });
          element.innerHTML = interpolatedUnits.join('');
          element.style.display = 'initial';
        })
        .catch(error => console.log(error))
  }
}

function fetchData({URL, search, limit, offset}) {
  URL = URL.endsWith('/') ? URL : URL + '/'; // Normalize URL to end with slash
  let URLGetParameters = [];

  if (limit) {
    URLGetParameters.push(`limit=${limit}`);
  }
  if (offset) {
    URLGetParameters.push(`offset=${offset}`);
  }
  if (search) {
    URLGetParameters.push(`search=${search}`);
  }

  const searchURLSegment = search ? 'search' : '';
  const queryURL = `${URL}${searchURLSegment}?${URLGetParameters.join('&')}`;

  return new Promise((resolve, reject) => {
    fetch(queryURL)
        .then((response) => response.json())
        .then(response => resolve(response))
        .catch(error => reject(error))
  });
}

function interpolateString(string, replacements) {
  return string.replace(/{{([^{}]*)}}/g, (fullCapture, key) => {
    const replacement = replacements[key];
    return (typeof replacement === 'string' || typeof replacement === 'number') ? replacement : fullCapture;
  });
}