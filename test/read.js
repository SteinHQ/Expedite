const fixturePath = 'test/fixtures/onlyParent.html';
const mockFetchResponse = fetch('test/mockData.json');

function mockFetch() {
  // Need this cute line to return a 'clone' of the mock fetch response. This is because a ReadableStream's .json() can only be called once. After all, it's a stream.
  return mockFetchResponse.then();
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

  it('should make the parent element visible on receiving data', function (done) {
    // Set up an observer for changes in the parent element that would be injected later
    const mutationObserver = new MutationObserver(() => {
      expect(document.getElementById('parentElement').style.display).toEqual('');
      done();
    });

    spyOn(window, 'fetch').and.callFake(mockFetch);

    this.workspaceDiv.innerHTML = this.fixture;

    // Activate the observer on parent element
    mutationObserver.observe(document.getElementById('parentElement'), {
      childList: true,
      subtree: true
    });

    updateHTML();
  });

  describe('should perform request to correct URL', function () {
    beforeEach(function () {
      spyOn(window, 'fetch').and.callFake(mockFetch);

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
  })
});