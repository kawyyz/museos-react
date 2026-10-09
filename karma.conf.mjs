import fs from "node:fs";
import { createInstrumenter } from "istanbul-lib-instrument";

// Plugin de esbuild que instrumenta los .jsx de src/ para medir cobertura
const instrumenter = createInstrumenter({ esModules: true, parserPlugins: ["jsx"] });

const coveragePlugin = {
  name: "istanbul-jsx",
  setup(build) {
    build.onLoad({ filter: /[\\/]src[\\/].*\.jsx$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, "utf8");
      const contents = instrumenter.instrumentSync(source, args.path);
      return { contents, loader: "jsx" };
    });
  },
};

export default function (config) {
  config.set({
    frameworks: ["jasmine"],
    plugins: [
      "karma-jasmine",
      "karma-esbuild",
      "karma-coverage",
      "karma-spec-reporter",
      "karma-firefox-launcher",
    ],
    files: [{ pattern: "src/**/*.spec.js", watched: false }],
    preprocessors: { "src/**/*.spec.js": ["esbuild"] },
    esbuild: {
      jsx: "automatic",
      loader: { ".js": "jsx" },
      define: { "process.env.NODE_ENV": '"test"' },
      plugins: [coveragePlugin],
    },
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      subdir: ".",
      reporters: [{ type: "html" }, { type: "text-summary" }, { type: "text" }],
    },
    browsers: ["FirefoxHeadless"],
    singleRun: true,
  });
}