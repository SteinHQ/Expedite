describe('Write Sheets', function () {
  const fixturePath = 'tests/fixtures/append.html',
      restsheetURL = 'http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1',
      mockAppendSuccessResponse = fetch('tests/mock-data/mockAppendSuccessResponse.json');

  function mockFetch() {
    // Need this cute line to return a 'clone' of the mock fetch response. This is because a ReadableStream's .json() can only be called once. After all, it's a stream.
    return new Promise(resolve => {
      mockAppendSuccessResponse.then(response => resolve(response.clone()))
    });
  }

  beforeAll(function (done) {
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
    spyOn(window, 'fetch').and.callThrough();

    this.workspaceDiv.innerHTML = this.fixture;
    document.getElementById('parentElement').setAttribute('data-restsheet-url', restsheetURL);

    updateHTML();
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });

  it('should prevent default submit behaviour, i.e., page should not refresh', function () {
    document.getElementById('submit-button').click();
    // If the page does not reload, this will be executed
    expect(true).toBe(true);
  });

  describe('should make request', function () {
    it('to correct URL', function () {
      // Simulate form submit
      document.getElementById('submit-button').click();

      const requestedURL = normalizeURL(window.fetch.calls.mostRecent().args[0]),
          expectedURL = normalizeURL('http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1/append');

      expect(requestedURL).toBe(expectedURL);
    });

    it('with correct method and headers', function () {
      document.getElementById('submit-button').click();

      const requestArgument = window.fetch.calls.mostRecent().args[1];

      expect(requestArgument.method.toUpperCase()).toBe('POST');
      expect(requestArgument.mode.toUpperCase()).toBe('CORS');
      expect(requestArgument.headers).toEqual({
        'Content-Type': 'application/json; charset=utf-8'
      });
    });

    it('with correct body', function () {
      document.getElementById('title-input').value = 'An interesting title';
      document.getElementById('author-input').value = 'Shiven Sinha';
      document.getElementById('link-input').value = 'https://example.com/post/1';
      document.getElementById('content-textarea').value = 'A short introduction';

      const formData = new FormData(document.getElementById('parentElement'));
      let parsedData = {};
      for (let [key, value] of formData.entries()) {
        parsedData[key] = value;
      }

      document.getElementById('submit-button').click();

      expect(window.fetch.calls.mostRecent().args[1].body).toBe(JSON.stringify([parsedData]));
    });
  });

  describe('dispatch event on receiving response', function () {
    it('should dispatch event ResponseReceived on the form on receiving response', function (done) {
      document.getElementById('parentElement').addEventListener('ResponseReceived', () => {
        expect(true).toBe(true);
        done();
      });

      fetch.and.callFake(mockFetch);

      document.getElementById('submit-button').click();
    });

    it('should provide details of response', function (done) {
      document.getElementById('parentElement').addEventListener('ResponseReceived', (event) => {
        expect(event.detail).toEqual({
          status: 200,
          body: {updatedRange: 'Sheet1!A8:C9'}
        });
        done();
      });

      fetch.and.callFake(mockFetch);

      document.getElementById('submit-button').click();
    });
  });

});