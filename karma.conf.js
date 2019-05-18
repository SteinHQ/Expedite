module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      "tests/**/*.js",
      {
        pattern: "tests/**/*.json",
        watched: true,
        served: true,
        included: false
      },
      "tests/**/*.html",
      "index.js"
    ],
    proxies: {
      "/tests/": "/base/tests/"
    },
    preprocessors: {
      "index.js": ["babel"]
    },
    reporters: ["progress", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      reporters: [{ type: "lcov", subdir: "report-lcov" }]
    }
  });
};
