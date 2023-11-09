const domain = window.location.hostname;
const path = window.location.pathname;
const query = window.location.search;
console.log(`Domain: ${domain}\nPath: ${path}\nQuery: ${query}`);

if (domain === "grab-tools.live") {
    grabToolsScript();
} else if (domain === "grabvr.quest") {
    grabVRScript();
}

function checkForUpdates() {
    fetch('https://grab-tools.live/extensionVersion.json')
    .then(response => response.json()).then(data => {
        if (data.version !== chrome.runtime.getManifest().version) {
            document.getElementById("extension-update").style.display = "block";
        }
    });
}

function grabToolsScript() {
    if (path === "" || path === "/") {
        checkForUpdates();
    }
}

function grabVRScript() {
    if (path === "/levels" || path === "/levels/") {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, {childList: true, subtree: true});
    } else if (path === "/levels/viewer" || path === "/levels/viewer/") {
        const levelId = query.split("?level=")[1];

        const editButton = document.createElement("a");
        editButton.classList.add("gtl-btn");
        editButton.setAttribute("target", "_blank");
        editButton.setAttribute("href", `https://grab-tools.live/editor?level=${levelId}`);
        editButton.textContent = "Edit";

        const downloadButton = document.createElement("a");
        downloadButton.classList.add("gtl-btn");
        downloadButton.setAttribute("target", "_blank");
        downloadButton.setAttribute("href", `https://grab-tools.live/download?level=${levelId}`);
        downloadButton.textContent = "Download";

        const buttons = document.createElement("div");
        buttons.classList.add("gtl-buttons");
        buttons.appendChild(editButton);
        buttons.appendChild(downloadButton);

        document.body.appendChild(buttons);
    }
}

function addButtonsToCard(element) {
    const card = element.childNodes[0];
    const playButton = card.childNodes[13];
    const levelUrl = playButton.getAttribute("href");
    const levelId = levelUrl.split("?level=")[1];

    const editButton = document.createElement("a");
    editButton.classList.add("gtl-btn");
    editButton.setAttribute("target", "_blank");
    editButton.setAttribute("href", `https://grab-tools.live/editor?level=${levelId}`);
    editButton.textContent = "Edit";

    const downloadButton = document.createElement("a");
    downloadButton.classList.add("gtl-btn");
    downloadButton.setAttribute("target", "_blank");
    downloadButton.setAttribute("href", `https://grab-tools.live/download?level=${levelId}`);
    downloadButton.textContent = "Download";

    card.appendChild(editButton);
    card.appendChild(downloadButton);
}

function handleMutations(mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach(function (node) {
                if (node.classList && node.classList.contains("grid-item")) {
                    addButtonsToCard(node);
                }
            });
        }
    });
}
