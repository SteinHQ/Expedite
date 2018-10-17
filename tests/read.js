const fixturePath = 'tests/fixtures/read.html',
    mockFetchResponse = fetch('tests/mockData.json');

function mockFetch() {
  // Need this cute line to return a 'clone' of the mock fetch response. This is because a ReadableStream's .json() can only be called once. After all, it's a stream.
  return new Promise(resolve => {
    mockFetchResponse.then(response => resolve(response.clone()))
  });
}

describe('Read Sheets', function () {
  beforeAll(function (done) {
    fetch(fixturePath)
        .then(response => response.text())
        .then(html => {
          this.fixture = html;
          done();
        });
  });

  beforeEach(function () {
    spyOn(window, 'fetch').and.callFake(mockFetch);

    this.workspaceDiv = document.getElementById('workspace');
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });

  it('should hide the parent element initially', function (done) {
    this.workspaceDiv.innerHTML = this.fixture;
    updateHTML();

    expect(document.getElementById('parentElement').style.display).toBe('none');
    done();
  });

  describe('should perform request to correct URL', function () {
    beforeEach(function () {
      this.workspaceDiv.innerHTML = this.fixture;
      this.parentElement = document.getElementById('parentElement');
    });

    it('without any options set', function (done) {
      updateHTML();

      // Normalize URLs to compare them directly
      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL('http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1');

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with limit parameter', function (done) {
      const limitValue = 3;
      this.parentElement.setAttribute('data-restsheet-limit', limitValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/?limit=${limitValue}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with offset parameter', function (done) {
      const offsetValue = 1;
      this.parentElement.setAttribute('data-restsheet-offset', offsetValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/?offset=${offsetValue}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with search parameter', function (done) {
      const searchConditions = {author: "Zat Rana"};
      this.parentElement.setAttribute('data-restsheet-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/search/?search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with both limit and offset parameters', function (done) {
      const limitValue = 3,
          offsetValue = 1;

      this.parentElement.setAttribute('data-restsheet-limit', limitValue.toString());
      this.parentElement.setAttribute('data-restsheet-offset', offsetValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/?limit=${limitValue}&offset=${offsetValue}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with both limit and search parameters', function (done) {
      const limitValue = 3,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-restsheet-limit', limitValue.toString());
      this.parentElement.setAttribute('data-restsheet-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/search/?limit=${limitValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with both offset and search parameters', function (done) {
      const offsetValue = 1,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-restsheet-offset', offsetValue.toString());
      this.parentElement.setAttribute('data-restsheet-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/search/?offset=${offsetValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });

    it('with all search, limit, and offset parameters', function (done) {
      const limitValue = 3,
          offsetValue = 1,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-restsheet-limit', limitValue.toString());
      this.parentElement.setAttribute('data-restsheet-offset', offsetValue.toString());
      this.parentElement.setAttribute('data-restsheet-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/search/?limit=${limitValue}&offset=${offsetValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toEqual(expectedURL);
      done();
    });
  });

  it('should make the parent element visible on receiving data', function (done) {
    // Set up an observer for changes in the parent element that would be injected later
    const mutationObserver = new MutationObserver(() => {
      expect(document.getElementById('parentElement').style.display).toEqual('');
      done();
    });

    this.workspaceDiv.innerHTML = this.fixture;

    // Activate the observer on parent element
    mutationObserver.observe(document.getElementById('parentElement'), {
      childList: true,
      subtree: true
    });

    updateHTML();
  });

  it('should interpolate correctly on receiving data', function (done) {
    // Set up an observer for changes in the parent element that would be injected later
    const mutationObserver = new MutationObserver(() => {
      const titleElements = document.querySelectorAll('.title'),
          authorElements = document.querySelectorAll('.author'),
          contentElements = document.querySelectorAll('.content'),
          linkElements = document.querySelectorAll('.link');

      mockFetch()
          .then(response => response.json())
          .then(data => {
            // Comparing an objected generated from reversing the interpolations to the mock data for each 'row'
            data.forEach((currentRecord, index) => {
              const interpolationResults = {
                title: titleElements[index].innerHTML,
                author: authorElements[index].innerHTML,
                content: contentElements[index].innerHTML,
                link: linkElements[index].href
              };

              expect(currentRecord).toEqual(interpolationResults);
            });

            done();
          });
    });

    this.workspaceDiv.innerHTML = this.fixture;

    // Activate the observer on parent element
    mutationObserver.observe(document.getElementById('parentElement'), {
      childList: true,
      subtree: true
    });

    updateHTML();
  });
});