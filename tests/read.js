describe('Read Sheets', function () {
  const fixturePath = 'tests/fixtures/read.html',
      mockFetchResponse = fetch('tests/mock-data/mockData.json'),
      mockIncorrectFetchResponse = fetch('nonexistent.json'),
      steinURL = 'http://localhost:8080/v1/storages/5bbf8e7e78625c1890294656/Sheet1';

  function mockFetch() {
    // Need this cute line to return a 'clone' of the mock fetch response. This is because a ReadableStream's .json() can only be called once. After all, it's a stream.
    return new Promise(resolve => {
      mockFetchResponse.then(response => resolve(response.clone()))
    });
  }

  beforeAll(function (done) {
    // Initialise DOM workspace
    this.workspaceDiv = document.createElement('div');
    this.workspaceDiv.id = 'workspace';
    document.body.appendChild(this.workspaceDiv);

    fetch(fixturePath)
        .then(response => response.text())
        .then(html => {
          this.fixture = html;
          done();
        });
  });

  afterAll(function () {
    document.body.removeChild(this.workspaceDiv);
  });

  beforeEach(function () {
    // Added spy in beforeEach because the individual specs may alter the spy.
    spyOn(window, 'fetch').and.callFake(mockFetch);
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });

  it('should hide the parent element initially', function (done) {
    this.workspaceDiv.innerHTML = this.fixture;
    const parentElement = document.getElementById('parentElement');
    parentElement.setAttribute('data-stein-url', steinURL);

    updateHTML();

    expect(parentElement.style.display).toBe('none');
    done();
  });

  describe('should make request to correct URL', function () {
    beforeEach(function () {
      this.workspaceDiv.innerHTML = this.fixture;
      this.parentElement = document.getElementById('parentElement');
      this.parentElement.setAttribute('data-stein-url', steinURL);
    });

    it('without any options set', function () {
      updateHTML();

      // Normalize URLs to compare them directly
      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(steinURL);

      expect(requestedURL).toEqual(expectedURL);
    });

    it('even when URL with trailing / is provided', function () {
      this.parentElement.setAttribute('data-stein-url', `${steinURL}/`);
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(steinURL);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with limit parameter', function () {
      const limitValue = 3;
      this.parentElement.setAttribute('data-stein-limit', limitValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?limit=${limitValue}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with offset parameter', function () {
      const offsetValue = 1;
      this.parentElement.setAttribute('data-stein-offset', offsetValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?offset=${offsetValue}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with search parameter', function () {
      const searchConditions = {author: "Zat Rana"};
      this.parentElement.setAttribute('data-stein-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with both limit and offset parameters', function () {
      const limitValue = 3,
          offsetValue = 1;

      this.parentElement.setAttribute('data-stein-limit', limitValue.toString());
      this.parentElement.setAttribute('data-stein-offset', offsetValue.toString());
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?limit=${limitValue}&offset=${offsetValue}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with both limit and search parameters', function () {
      const limitValue = 3,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-stein-limit', limitValue.toString());
      this.parentElement.setAttribute('data-stein-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?limit=${limitValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with both offset and search parameters', function () {
      const offsetValue = 1,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-stein-offset', offsetValue.toString());
      this.parentElement.setAttribute('data-stein-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?offset=${offsetValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toBe(expectedURL);
    });

    it('with all search, limit, and offset parameters', function () {
      const limitValue = 3,
          offsetValue = 1,
          searchConditions = {author: "Zat Rana"};

      this.parentElement.setAttribute('data-stein-limit', limitValue.toString());
      this.parentElement.setAttribute('data-stein-offset', offsetValue.toString());
      this.parentElement.setAttribute('data-stein-search', JSON.stringify(searchConditions));
      updateHTML();

      const requestedURL = normalizeURL(fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL(`${steinURL}/?limit=${limitValue}&offset=${offsetValue}&search=${JSON.stringify(searchConditions)}`);

      expect(requestedURL).toBe(expectedURL);
    });
  });

  it('should make the parent element visible on receiving data', function (done) {
    // Set up an observer for changes in the parent element that would be injected later
    const mutationObserver = new MutationObserver(() => {
      expect(parentElement.style.display).toEqual('');
      done();
    });

    this.workspaceDiv.innerHTML = this.fixture;
    const parentElement = document.getElementById('parentElement');
    parentElement.setAttribute('data-stein-url', steinURL);

    // Activate the observer on parent element
    mutationObserver.observe(parentElement, {
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
    const parentElement = document.getElementById('parentElement');
    parentElement.setAttribute('data-stein-url', steinURL);

    // Activate the observer on parent element
    mutationObserver.observe(parentElement, {
      childList: true,
      subtree: true
    });

    updateHTML();
  });

  // Any changes to make this more elegant are welcome
  it('should throw error on incorrect data received', function (done) {
    this.workspaceDiv.innerHTML = this.fixture;
    const parentElement = document.getElementById('parentElement');
    parentElement.setAttribute('data-stein-url', steinURL);
    spyOn(window, 'fetchData').and.callThrough();

    fetch.and.returnValue(new Promise(resolve => {
      resolve(mockIncorrectFetchResponse);
    }));

    updateHTML();

    fetchData.calls.mostRecent().returnValue
        .then(() => {
          done.fail('does not throw error');
        })
        .catch((e) => {
          expect(e).toBeTruthy();
          done();
        });
  });
});
