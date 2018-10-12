jasmine.getFixtures().fixturesPath = 'fixtures/';

describe('Read Sheets', function () {
  it('should hide the parent element initially', function () {
    loadFixtures('onlyParent.html');

    expect(document.getElementById('parentElement').style.display).toBe('none');
  });

  it('should make the parent element visible on receiving data', function () {
  });

  it('should perform request to correct URL', function () {
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