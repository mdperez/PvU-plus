// ==UserScript==
// @name         PvU Plus
// @version      1.4
// @updateURL    https://github.com/mdperez/PvU-plus/raw/main/PvU%20Ratio.user.js
// @downloadURL  https://github.com/mdperez/PvU-plus/raw/main/PvU%20Ratio.user.js
// @description  Recover the LE per Hour value of the visible plants and days for ROI
// @author       mdperez
// @match        https://marketplace.plantvsundead.com/offering/bundle
// @icon         https://www.google.com/s2/favicons?domain=plantvsundead.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const leToPVU = 150;

    let minROI = Infinity;
    let minROINode = null;

    const clear = () => {
        minROI = Infinity;
        minROINode = null;
        document.querySelectorAll(".ratio").forEach(node => {
            node.remove();
        });
        document.querySelectorAll(".roi").forEach(node => {
            node.remove();
        });
        document.querySelectorAll("a.tw-grid").forEach(node => {
            node.style.cssText = "";
        });
    };

    const init = () => {
        clear();
        document.querySelectorAll(".tw-text-center").forEach( node => {
            const text = node.textContent;
            if (text.indexOf("LE:") > -1) {
                const ratio = text.match(/(\d+)\/(\d+)/);
                const lePerHour = ratio[1]/ratio[2];
                setRatioColors(node, lePerHour);
                setRatioNode(node, lePerHour);
                setROI(node, lePerHour);
            }
        });
        logMinROI();
    };

    const reload = () => {
        window.location.reload();
    };

    const setRatioColors = (node, lePerHour) => {
        switch (true) {
            case (lePerHour < 6):
                node.closest("a").style.border = "1px solid red";
                break;
            case (lePerHour < 8):
                node.closest("a").style.border = "1px solid orange";
                break;
            case (lePerHour < 10):
                node.closest("a").style.border = "1px solid yellow";
                break;
            case (lePerHour >= 10):
                node.closest("a").style.border = "1px solid green";
                break;
        }
    }

    const setRatioNode = (node, lePerHour) => {
        let p = node.parentNode.querySelector(".ratio");
        if (!p) {
            p = document.createElement("p");
            p.classList.add("ratio");
            p.style.color = "white";
            node.after(p);
        }
        p.textContent = "Ratio: " + lePerHour.toFixed(5);
    }

    const setROI = (node, lePerHour) => {
        const container = node.closest("a");
        const priceContainer = container.querySelector(".text__green");
        const price = priceContainer.textContent;
        const pvuPerHour = lePerHour/leToPVU;
        const ROIhours = price/pvuPerHour;
        const ROIdays = ROIhours/24;
        if (ROIdays < minROI) {
            minROI = ROIdays;
            minROINode = container;
        }

        // if (+price < 52) {
        //     container.style.background = "rgba(255,255,0,0.2)";
        // }


        let p = container.querySelector(".roi");
        if (!p) {
            p = document.createElement("p");
            p.classList.add("roi");
            p.style.color = "white";
            container.querySelector(".text-gray").after(p);
        }
        p.textContent = "ROI: " + ROIdays.toFixed(3) + " days";
    }

    const logMinROI = () => {
        minROINode.style.background = "rgba(0,255,0,0.2)";
    }

    const drawMenu = () => {
        let menu = document.createElement("div");
        // menu.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100vw; height: 50px; background: #238636;";
        menu.classList.add("pvuPlus");
        const menuContent = `
	  \<div class='wrapper' style='display: flex; width: 100%; height: 100%; justify-content: center; align-items: center; color: #FFF; flex-direction: column; margin-top: 25px; padding-top: 25px; border-top: 1px solid #11131b;'>
		<div>
            <button id='filterBtn'class="btn-confirm" data-v-32e52768 style='margin: 0 0.2vw;'>Filter</button>
		    <button id='clearBtn' class="btn-close" data-v-32e52768 style='margin: 0 0.2vw;'>Clear</button>
        </div>
		<button id='reloadBtn' class="btn-confirm" data-v-32e52768 style='margin: 1vw'>Reload</button>
        <div>
		    <span id='prevBtn' style='margin: 0 1vw; cursor: pointer;'>< Prev</span>
		    <span id='nextBtn' style='margin: 0 1vw; cursor: pointer;'>Next ></span>
        </div>
	  </div>\
	`;
        menu.innerHTML = menuContent;
        document.querySelector("[data-v-f4881794]") && document.querySelector("[data-v-f4881794]").append(menu);
    }

    document.onkeypress = (e) => {
        e = e || window.event;
        switch (e.key) {
            case ("q"):
                init();
                break;
            case ("w"):
                clear();
                break;
            case ("e"):
                clear();
                document.querySelector("[data-v-4fcc5f08]").children[0].click();
                break;
            case ("r"):
                clear();
                document.querySelector("[data-v-4fcc5f08]").children[4].click();
                break;
            case ("t"):
                reload();
                break;
        }
    };

    setTimeout(() => {
        drawMenu();
        document.querySelector("#filterBtn").addEventListener("click", e => {
            init();
        });

        document.querySelector("#clearBtn").addEventListener("click", e => {
            clear();
        });

        document.querySelector("#prevBtn").addEventListener("click", e => {
            clear();
            document.querySelector("[data-v-4fcc5f08]").children[0].click();
        });

        document.querySelector("#nextBtn").addEventListener("click", e => {
            clear();
            document.querySelector("[data-v-4fcc5f08]").children[4].click();
        });

        document.querySelector("#reloadBtn").addEventListener("click", e => {
            reload();
        });
    }, 1000);

})();
