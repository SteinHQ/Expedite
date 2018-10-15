const fixturesPath = 'test/fixtures';

function getFixture(fileName) {
  return fetch(`${fixturesPath}/${fileName}`)
      .then(response => response.text());
}

describe('Read Sheets', function () {
  beforeEach(function () {
    this.workspaceDiv = document.getElementById('workspace');
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });

  it('should hide the parent element initially', function (done) {
    getFixture('onlyParent.html').then(html => {
      this.workspaceDiv.innerHTML = html;
      updateHTML();

      expect(document.getElementById('parentElement').style.display).toBe('none');
      done();
    });
  });

  it('should make the parent element visible on receiving data', function () {
  });

  it('should perform request to correct URL without options', function (done) {
    getFixture('onlyParent.html').then(html => {
      spyOn(window, 'fetch').and.callThrough();
      this.workspaceDiv.innerHTML = html;
      updateHTML();

      // Normalize URLs to compare them directly
      expect(normalizeURL(window.fetch.calls.mostRecent().args[0])).toEqual(normalizeURL('http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1'));
      done();
    });
  });

  describe('should perform request to correct URL with options', function () {
    it('with limit parameter', function () {
    });

    it('with offset parameter', function () {
    });

    it('with search parameter', function () {
    });

    it('with both limit and offset parameters', function () {
    });

    it('with both limit and search parameters', function () {
    });

    it('with both offset and search parameters', function () {
    });

    it('with all search, limit, and offset parameters', function () {
    });
  })
});