const key = require('fs').readFileSync("keyfile.txt", "utf-8").split("\n")[0]; 
//
// everyone probably knows it already, but I can't include it in the code for legal reasons.
// sorry :(
//
if (key.length === 0) {
    console.error("You didn't specify the AES decryption key! This patcher won't work without it. Edit this file and set the key to the game's decryption key.");
    process.exit(1);
}

const fs = require('fs').promises;
const crypto = require('crypto');

console.log("Will copy all required files from input/ and data/ to temp and fix file names for assets.");
console.log("!! Make sure this file has the correct decryption key from the game !!");

let ommit = [
    "steam_appid.txt",
    "languages/jp",
    "js/libs/greenworks",
    "js/libs/libsdkencrypted",
    "js/libs/libsteam",
    "js/libs/sdkencrypted",
    "js/libs/steam_api",
    "js/libs/js-yaml-master",
    "donottouch.xlsx" // this thing kept breaking the bundles -_-
];

let lowerCase = [
    "/img/",
    "/audio/"
];

let base = "input/www";
let target = "temp";

let decryptExtensions = [".OMORI", ".HERO", ".KEL", ".PLUTO", ".AUBREY"];

function decrypter(data) {
    let alghoritm = "aes-256-ctr";

    const iv = data.slice(0, 16);
    data = data.slice(16);
    const d = crypto.createDecipheriv(alghoritm, key, iv);
    const r = Buffer.concat([d.update(data), d.final()]);
    return r;
}

let res = {
    "\\$": "_",
    "\\[": "_",
    "\\]": "_",
    "\\(": "_",
    "\\)": "_",
    "\\!": "_",
    "\\'": "_",
    "\\%": "_"
}

function sanitizePart(a) {
    a = a.replace(/\%[A-F0-9]{2}/g, "_");
    for (let k in res) {
        let re = new RegExp(k, "g");
        a = a.replace(re, res[k]);
    }

    return a;
}



async function recursiveCopy(path) {
    try { await fs.mkdir(target); } catch(e) {}
    let files = await fs.readdir(base + path);
    for (let file of files) {
        let tpath = path + file;
        let fullyQualifyingPath = base + path + file;
        let targetPath = target + path + file;

        if (path.includes("img")) {
            targetPath = target + path + sanitizePart(file);
        }

        let found = false;
        ommit.map(a => {
            if (tpath.includes(a)) {
                found = true;
            }
        });

        if (!found) {
            let stats = await fs.lstat(fullyQualifyingPath);
            let tolower = false;

            lowerCase.map(a => {
                if (targetPath.includes(a)) {
                    tolower = true;
                }
            });

            if (tolower)
                targetPath = targetPath.toLowerCase();

            if (stats.isDirectory()) {
                console.log(fullyQualifyingPath);
                await fs.mkdir(targetPath);
                await recursiveCopy(path + file + "/");
            } else {
                let input = await fs.readFile(fullyQualifyingPath);
                let decrypt = false;
                decryptExtensions.map(a => {
                    if (fullyQualifyingPath.endsWith(a)) {
                        decrypt = true;
                    }
                });

                if (decrypt) {
                    input = decrypter(input);
                }

                await fs.writeFile(targetPath, input);
            }
        }
    }
}


console.log("Reading input/www");


recursiveCopy("/").then(() => {
    console.log("Special case: Writing the js-yaml library from data/jsyaml.js to temp/js/libs/js-yaml-master/jsyaml.js");
    (async function() {
        let a = await fs.readFile("data/jsyaml.js");
        await fs.mkdir(target + "/js/libs/js-yaml-master");
        await fs.writeFile(target + "/js/libs/js-yaml-master/jsyaml.js", a);

        console.log("Step 1 complete!");
    })();
});

