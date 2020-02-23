import fs from "fs";
import path from "path";
import glob from "glob";
import plugin from "../src/";
import pluginTester from "babel-plugin-tester";

pluginTester({
  plugin,
  filename: __filename,
  tests: glob.sync(path.join(__dirname, "fixtures/*")).map(fixturePath => {
    return {
      title: path.basename(fixturePath),
      fixture: path.join(fixturePath, 'input.js'),
      outputFixture: path.join(fixturePath, 'output.js'),
      pluginOptions: fs.existsSync(path.join(fixturePath, "options.json"))
        ? require(path.join(fixturePath, "options.json"))
        : {}
    };
  })
});
