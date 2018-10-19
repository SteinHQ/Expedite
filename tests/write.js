describe('Write Sheets', function () {
  const fixturePath = 'tests/fixtures/write.html';

  function mockFetch() {

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
    spyOn(window, 'fetch').and.callFake(mockFetch);
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });
});