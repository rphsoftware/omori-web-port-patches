const fs = require('fs').promises;
console.log("Making bundles... (This may take a bit of time!)");

let jsonOptimize = [".KEL", ".AUBREY"];

///// PATH, IDENTIFIER ON WINDOW, BUNDLE NAME, RM FILES, RM DIR
let setup = [
    ["/data/", "gamefiles/data", "/data.bundle.js", true, true],
    ["/js/plugins/","data/js/plugins", "/js/plugins/aaa___BUNDLE.js", true, false],
    ["/maps/", "gamedata/maps", "/maps.js", true, true],
    ["/languages/en/", "languages/en", "/languages.en.bundle.js", true, true]
];

let base = "temp";
let debug = false; // disable rmdirs always
async function run() {
    for (let bundleConfig of setup) {
        let [scanPath, identifier, target, rmFiles, rmDir] = bundleConfig;
        let bundleCache = `window[${JSON.stringify(identifier)}] = {};\n`;
        let bytesSaved = 0;

        let files = await fs.readdir(base + scanPath);
        console.log("Bundling " + bundleConfig[2] + ".");

        for (let i = 0; i < files.length; i++) {

            let f = await fs.readFile(base + scanPath + files[i], "utf-8");
            let optimJson = false;

            jsonOptimize.map(a => {
                if (files[i].endsWith(a)) {
                    optimJson = true;
                }
            });

            if (optimJson) {
                let ol = f.length;
                f = JSON.stringify(JSON.parse(f));
                bytesSaved += (ol - f.length);
            }

            let pluginFull = files[i];
            pluginFull = pluginFull.replace(".OMORI", ".js");

            if (identifier === "gamedata/maps") {
                pluginFull = pluginFull.toLowerCase();
            }
            bundleCache = `${bundleCache}window[${JSON.stringify(identifier)}][${JSON.stringify(pluginFull)}] = ${JSON.stringify(f)};\n`;

            if (rmFiles) {
                if (!debug && !files[i].includes("vorbis"))
                    await fs.unlink(base + scanPath + files[i]);
            }
        }

        if (rmDir) {
            if (!debug)
                await fs.rmdir(base + scanPath);
        }

        await fs.writeFile(base + target, bundleCache);

        console.log("Done. Bytes saved in this bundle over the regular game: " + bytesSaved);
    }
}

run();