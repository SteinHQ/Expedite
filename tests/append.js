describe("Write Sheets", function() {
  const fixturePath = "tests/fixtures/append.html",
    steinURL =
      "http://localhost:8080/v1/storages/5bbf8e7e78625c1890294656/Sheet1",
    mockAppendSuccessResponse = () => fetch(
      "tests/mock-data/mockAppendSuccessResponse.json"
    );

  function mockFetch() {
    // Parse in the form of legacyFetch format (XHTTP)
    return mockAppendSuccessResponse().
      then(response => response.text()).
      then(response => ({ response }));
  }

  beforeAll(function(done) {
    this.workspaceDiv = document.createElement("div");
    this.workspaceDiv.id = "workspace";
    document.body.appendChild(this.workspaceDiv);

    fetch(fixturePath).then(response => response.text()).then(html => {
      this.fixture = html;
      done();
    });
  });

  afterAll(function() {
    document.body.removeChild(this.workspaceDiv);
  });

  beforeEach(function() {
    // Added spy in beforeEach because the individual specs may alter the spy.
    spyOn(window, "legacyFetch").and.callFake(mockFetch);

    this.workspaceDiv.innerHTML = this.fixture;
    document.getElementById("parentElement").
      setAttribute("data-stein-url", steinURL);

    updateHTML();
  });

  afterEach(function() {
    this.workspaceDiv.innerHTML = "";
  });

  it("should prevent default submit behaviour, i.e., page should not refresh",
    function() {
      document.getElementById("submit-button").click();
      // If the page does not reload, this will be executed
      expect(true).toBe(true);
    });

  describe("should make request", function() {
    it("to correct URL", function() {
      // Simulate form submit
      document.getElementById("submit-button").click();

      const requestedURL = normalizeURL(
        window.legacyFetch.calls.mostRecent().args[0]
        ),
        expectedURL = normalizeURL(steinURL);

      expect(requestedURL).toBe(expectedURL);
    });

    it("with correct method", function() {
      document.getElementById("submit-button").click();

      const requestArgument = window.legacyFetch.calls.mostRecent().args[1];

      expect(requestArgument.toUpperCase()).toBe("POST");
    });

    it("with correct body", function() {
      document.getElementById("title-input").value = "An interesting title";
      document.getElementById("author-input").value = "Shiven Sinha";
      document.getElementById("link-input").value =
        "https://example.com/post/1";
      document.getElementById("content-textarea").value =
        "A short introduction";

      const formData = new FormData(document.getElementById("parentElement"));
      let parsedData = {};
      for (let [key, value] of formData.entries()) {
        parsedData[key] = value;
      }

      document.getElementById("submit-button").click();

      console.log(window.legacyFetch.calls.mostRecent());
      expect(window.legacyFetch.calls.mostRecent().args[2]).toBe(
        JSON.stringify([parsedData])
      );
    });
  });

  describe("dispatch event on receiving response", function() {
    it(
      "should dispatch event ResponseReceived on the form on receiving response",
      function(done) {
        document.getElementById("parentElement").
          addEventListener("ResponseReceived", () => {
            expect(true).toBe(true);
            done();
          });

        document.getElementById("submit-button").click();
      });

    it("should provide details of response", function(done) {
      document.getElementById("parentElement").
        addEventListener("ResponseReceived", event => {
          expect(event.detail).toEqual({
            status: 200,
            body: { updatedRange: "Sheet1!A8:C9" }
          });
          done();
        });

      document.getElementById("submit-button").click();
    });
  });
});
