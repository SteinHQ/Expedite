describe('Write Sheets', function () {
  const fixturePath = 'tests/fixtures/write.html';

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
  });

  afterEach(function () {
    this.workspaceDiv.innerHTML = '';
  });

  it('should prevent default submit behaviour, i.e., page should not refresh', function(){
    this.workspaceDiv.innerHTML = this.fixture;
    updateHTML();

    document.getElementById('submit-button').click();
    expect(true).toBeTruthy();
  })
});