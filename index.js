document.addEventListener("DOMContentLoaded", updateHTML);

function updateHTML() {
  const applicableParents = document.querySelectorAll("[data-stein-url]");
  for (let i = 0, element; (element = applicableParents[i]); i++) {
    const search = element.dataset.steinSearch,
      limit = element.dataset.steinLimit,
      offset = element.dataset.steinOffset;

    let URL = element.dataset.steinUrl;
    URL = URL.endsWith("/") ? URL : URL + "/"; // Normalize URL to end with slash

    // Just add appropriate event handler if the parent node is a form, no interpolations
    if (element.tagName === "FORM") {
      return configureForm(element, URL);
    }

    element.style.display = "none";

    fetchData({ URL, search, limit, offset })
      .then(data => {
        // Get innerHTML, interpolate it for each row in spreadsheet
        const contentUnits = [];
        for (let i = 0; i < data.length; i++) {
          contentUnits.push(element.innerHTML);
        }
        const interpolatedUnits = contentUnits.map((contentUnit, index) => {
          return interpolateString(contentUnit, data[index]);
        });

        // Update the DOM
        element.innerHTML = interpolatedUnits.join("");
        element.style.display = "";
      })
      .catch(error => {
        console.log(error);
        throw new Error(error);
      });
  }
}

function fetchData({ URL, search, limit, offset }) {
  let URLGetParameters = [
    limit ? `limit=${limit}` : "",
    offset ? `offset=${offset}` : "",
    search ? `search=${search}` : ""
  ];

  const queryURL = `${URL}?${URLGetParameters.join("&")}`;

  return new Promise((resolve, reject) => {
    fetch(queryURL)
      .then(response => response.json())
      .then(response => {
        if (response.ok) resolve(response);
        else reject(response);
      })
      .catch(error => reject(error));
  });
}

function interpolateString(string, replacements) {
  return string.replace(/{{([^{}]*)}}/g, (fullCapture, key) => {
    const replacement = replacements[key];
    return typeof replacement === "string" ? replacement : fullCapture;
  });
}

function configureForm(form, URL) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    let formData = new FormData(form);

    // Convert FormData into JSON
    const parsedFormData = {};
    formData.forEach((value, key) => {parsedFormData[key] = value});

    const requestData = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify([parsedFormData]) // The API expects an array of rows, and we have just one row
    };

    fetch(URL, requestData)
      .then(
        response =>
          new Promise(resolve =>
            response.json().then(body =>
              resolve({
                status: response.status,
                body
              })
            )
          )
      )
      .then(response => {
        const submitEvent = new CustomEvent("ResponseReceived", {
          detail: response
        });
        e.target.dispatchEvent(submitEvent);
      })
      .catch(error => {
        throw new Error(error);
      });
  });
}
