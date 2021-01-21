console.log("Waiting for the game to finish loading before injecting...");

(function() {
let i = setInterval(function() {
    if (window.fullSetupComplete) {
        console.log("Injecting mod menu button");
        let modmenu = document.createElement("div");
        modmenu.style = "position: fixed; top: 0; left: 0; background: #8888; color: white; padding: 32px; z-index: 99999;";
        modmenu.innerText = "Mod menu";
        let isMenuOpen = false;
        let nextCanvasMode = 0;
        let isGamepad = false;
        let canvasModeTexts = ["1x scale", "2x scale", "Fill screen (non-integer scaling)"];
        let mme = [];

        function applycanvasmode() {
            let w = 640;
            let h = 480;
            if (nextCanvasMode === 1) {
                w = 1280;
                h = 960;
            }

            if (nextCanvasMode === 2) {
                let maxW = window.innerWidth;
                let maxH = window.innerHeight;

                if ((maxW * 0.75) > maxH) {
                    // limit to height
                    h = maxH;
                    w = Math.floor((maxH / 3) * 4);
                } else {
                    // limit to width
                    w = maxW;
                    h = Math.floor((maxW / 4) * 3);
                }
            }

            document.querySelector("#GameCanvas").style.width = w + "px";
            document.querySelector("#GameCanvas").style.height = h + "px";

            document.querySelector("#GameVideo").style.width = w + "px";
            document.querySelector("#GameVideo").style.height = h + "px";

            document.querySelector("#UpperCanvas").style.width = w + "px";
            document.querySelector("#UpperCanvas").style.height = h + "px";
        }

        setInterval(applycanvasmode, 100);

        modmenu.addEventListener("click", function() {
            isMenuOpen = !isMenuOpen;
            modmenu.innerText = isMenuOpen ? "Close mod menu" : "Mod menu";
            if (isMenuOpen) {
                let canvasModeButton = document.createElement("div");
                canvasModeButton.style = "position: fixed; top: 70px; left: 0; background: #f008; color: white; padding: 32px; z-index: 199999;";
                canvasModeButton.innerText = `Canvas mode: ${canvasModeTexts[nextCanvasMode]}`;
                document.body.appendChild(canvasModeButton);

                canvasModeButton.addEventListener("click", function() {
                    nextCanvasMode++;
                    if (nextCanvasMode > 2) nextCanvasMode = 0;
                    canvasModeButton.innerText = `Canvas mode: ${canvasModeTexts[nextCanvasMode]}`;
                    applycanvasmode();
                });

                mme.push(canvasModeButton);

                let killmm = document.createElement("div");
                killmm.style = "position: fixed; top: 0px; right: 0; background: #f008; color: white; padding: 32px; z-index: 199999;";
                killmm.innerText = `Kill mod menu`;
                killmm.addEventListener("click", function() {
                    for (let el of mme) {
                        el.remove();
                    }
                    mme = [];
                    modmenu.remove();
                })
                document.body.appendChild(killmm);

                mme.push(killmm);

                let nukeconfig = document.createElement("div");
                nukeconfig.style = "position: fixed; top: 70px; right: 0; background: #f008; color: white; padding: 32px; z-index: 199999;";
                nukeconfig.innerText = `Nuke config\n(Can fix on screen gamepad)`;
                nukeconfig.addEventListener("click", function() {
                    if (confirm("Are you sure you want to nuke the config? (Your save should be fine)")) {
                        localStorage.removeItem("RPG Config");
                        setTimeout(function() {
                            window.location.reload();
                        }, 500);
                    }
                })
                document.body.appendChild(nukeconfig);

                mme.push(nukeconfig);

                if (!isGamepad) {
                    let injTouch = document.createElement("div");
                    injTouch.style = "position: fixed; top: 140px; left: 0; background: #f008; color: white; padding: 32px; z-index: 299999;";
                    injTouch.innerText = `Inject touch gamepad`;
                    document.body.appendChild(injTouch);
                    injTouch.addEventListener("click", function() {
                        injTouch.remove();
                        let zoneStatic = document.createElement("div");
                        zoneStatic.style = "position: fixed; bottom: 0; left: 0; z-index: 9999; width: 500px; height: 500px;";
                        let internal = document.createElement("div");
                        internal.style = "position: relative; width: 100%; height: 100%;"
                        zoneStatic.appendChild(internal);
                        let joystick = nipplejs.create({
                            mode: 'semi',
                            zone: internal,
                              color: 'red',
                              catchDistance: 30
                        });
                        setTimeout(function() {
                            joystick.on("dir", function(e, data) {
                                let dirs = [
                                    "up",
                                    "down",
                                    "left",
                                    "right"
                                ]
                                for (let o of dirs) {
                                    if (o !== data.direction.angle) {
                                        fakeInput.up(o);
                                    } else {
                                        fakeInput.down(o);
                                    }
                                }
                            });
                            joystick.on("end", function(e, data) {
                                let dirs = [
                                    "up",
                                    "down",
                                    "left",
                                    "right"
                                ]
                                for (let o of dirs) {
                                    fakeInput.up(o);
                                }
                            })
                        }, 100);
                        window.$$$$joy = joystick;
                        document.body.appendChild(zoneStatic);

                        // Inject touch buttons
                        let confirmButton = document.createElement("div");
                        confirmButton.style = "position: fixed; bottom: 5vw; right: 5vw; width: 10vw; height: 10vw; background: #0f08; color: white; touch-action: none; z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 3vw;";
                        confirmButton.innerText = "OK";

                        confirmButton.addEventListener("touchstart", function(e) {
                            e.preventDefault();
                            fakeInput.down("ok");
                        });

                        confirmButton.addEventListener("touchend", function(e) {
                            e.preventDefault();
                            fakeInput.up("ok");
                        });

                        document.body.appendChild(confirmButton);

                        let cancelButton = document.createElement("div");
                        cancelButton.style = "position: fixed; bottom: 5vw; right: 15vw; width: 10vw; height: 10vw; background: #f008; color: white; touch-action: none; z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 3vw;";
                        cancelButton.innerText = "ESC";

                        cancelButton.addEventListener("touchstart", function(e) {
                            e.preventDefault();
                            fakeInput.down("escape");
                        });

                        cancelButton.addEventListener("touchend", function(e) {
                            e.preventDefault();
                            fakeInput.up("escape");
                        });

                        document.body.appendChild(cancelButton);

                        let tagButton = document.createElement("div");
                        tagButton.style = "position: fixed; bottom: 15vw; right: 15vw; width: 10vw; height: 10vw; background: #00f8; color: white; touch-action: none; z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 3vw;";
                        tagButton.innerText = "TAG";

                        tagButton.addEventListener("touchstart", function(e) {
                            e.preventDefault();
                            fakeInput.down("tag");
                        });

                        tagButton.addEventListener("touchend", function(e) {
                            e.preventDefault();
                            fakeInput.up("tag");
                        });

                        document.body.appendChild(tagButton);

                        let runButton = document.createElement("div");
                        runButton.style = "position: fixed; bottom: 15vw; right: 5vw; width: 10vw; height: 10vw; background: #f0f8; color: white; touch-action: none; z-index: 999999; display: flex; align-items: center; justify-content: center; font-family: sans-serif; font-size: 3vw;";
                        runButton.innerText = "RUN";

                        runButton.addEventListener("touchstart", function(e) {
                            e.preventDefault();
                            fakeInput.down("shift");
                        });

                        runButton.addEventListener("touchend", function(e) {
                            e.preventDefault();
                            fakeInput.up("shift");
                        });

                        document.body.appendChild(runButton);
                    });
                    mme.push(injTouch);
                }
            } else {
                for (let el of mme) {
                    el.remove();
                }
                mme = [];
            }
        });
        document.body.appendChild(modmenu);
        clearInterval(i);
    }
}, 100);
})();