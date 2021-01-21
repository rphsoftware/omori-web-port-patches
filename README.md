# Omori patches so that the game works in a browser
### Very good project name, I know

### Usage

You will need: node.js, about 4 GB of free disk space and a terminal (powershell will do)

- Install node.js (At least version 12) on your computer
- Download this repository to a folder somewhere on your computer
- Ensure your copy of Omori is version 1.0.3 and that it's completely vanilla and unmodified (no mod support, for now)
  - you can run steam's re-check thing to ensure that
- Next to these 3 scripts, make a folder called `input`
- Copy the contents of omori's installation folder into `input` (so that the main exe file is in input directly, not in a sub-folder)
- Open a terminal window in the folder with the 3 scripts (On windows, hold shift, right click, open Powershell here)
- Run `node 01_copy_and_decrypt.js`
  - Make sure to first create a file called `keyfile.txt` to include the game's decryption key.
  - You can get that key by looking at OMORI's command arguments in Task Manager and copying the 32 character string after the `--`
  - Once you get the key, open `keyfile.txt` in your favourite text editor and put the key on the first line of the file.
- Run `node 02_apply_patches.js`
- Run `node 03_make_bundles.js`

You should now have a directory called `temp` with a patched version of the game. From here onwards, it should work in any modern browser, on stuff like a raspberry pi.

You can now delete `input` and copy `temp` to some convenient spot. ***Make sure you access the web port from a webserver, since just opening the HTML file in your browser WILL NOT WORK***. I recommend the python built-in web server which you can run with `python3 -m http.server 8083` and then going to `localhost:8083` in your browser.