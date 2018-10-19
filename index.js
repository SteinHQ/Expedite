document.addEventListener('DOMContentLoaded', updateHTML);

function updateHTML() {
  const applicableParents = document.querySelectorAll('[data-restsheet-url]');
  for (let i = 0, element; (element = applicableParents[i]); i++) {
    const search = element.dataset.restsheetSearch,
        limit = element.dataset.restsheetLimit,
        offset = element.dataset.restsheetOffset;

    let URL = element.dataset.restsheetUrl;
    URL = URL.endsWith('/') ? URL : URL + '/'; // Normalize URL to end with slash

    // Just add appropriate event handler if the parent node is a form, no interpolations
    if (element.tagName === 'FORM') {
      return configureForm(element, URL);
    }

    element.style.display = 'none';

    fetchData({URL, search, limit, offset})
        .then((data) => {
          // Get innerHTML, interpolate it for each row in spreadsheet
          const contentUnits = [];
          for (let i = 0; i < data.length; i++) {
            contentUnits.push(element.innerHTML);
          }
          const interpolatedUnits = contentUnits.map((contentUnit, index) => {
            return interpolateString(contentUnit, data[index]);
          });

          // Update the DOM
          element.innerHTML = interpolatedUnits.join('');
          element.style.display = '';
        })
        .catch((error) => {
          throw new Error(error);
        });
  }
}

function fetchData({URL, search, limit, offset}) {
  let URLGetParameters = [
    limit ? `limit=${limit}` : '',
    offset ? `offset=${offset}` : '',
    search ? `search=${search}` : ''
  ];

  const searchURLSegment = search ? 'search/' : '';
  const queryURL = `${URL}${searchURLSegment}?${URLGetParameters.join('&')}`;

  return new Promise((resolve, reject) => {
    fetch(queryURL)
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((error) => reject(error));
  });
}

function interpolateString(string, replacements) {
  return string.replace(/{{([^{}]*)}}/g, (fullCapture, key) => {
    const replacement = replacements[key];
    return typeof replacement === 'string' ? replacement : fullCapture;
  });
}

function configureForm(form, URL) {
  URL = `${URL}append`;
  form.addEventListener('submit', (e) => {
        e.preventDefault();
        let formData = new FormData(form);

        // Convert FormData into JSON
        formData = Array.from(formData.entries()).reduce((memo, pair) => ({
          ...memo,
          [pair[0]]: pair[1],
        }), {});

        const requestData = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify([formData]) // The API expects an array of rows
        };

        fetch(URL, requestData)
            .then((response) => new Promise((resolve) => response.json().then((body) => resolve({
              status: response.status,
              body
            }))))
            .then((response) => {
              const submitEvent = new CustomEvent('ResponseReceived', {detail: response});
              e.target.dispatchEvent(submitEvent);
            })
            .catch((error) => {
              throw new Error(error);
            });
      }
  );
}
