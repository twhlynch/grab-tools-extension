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

        if (query.includes("user_id=")) {
            const userId = query.split("user_id=")[1];

            fetch(`https://api.slin.dev/grab/v1/list?max_format_version=100&user_id=${userId}`).then((response) => {
                return response.json();
            }).then((data) => {

                let total_plays = 0;
                let total_okplays = 0;
                let total_maps = 0;
                let total_ok = 0;
                let average_likes = 0;
                let likes_count = 0;
                let average_difficulty = 0;
                let difficulty_count = 0;
                let average_time = 0;
                let time_count = 0;
                let total_complexity = 0;

                data.forEach(item => {
                    total_maps += 1;
                    item?.statistics?.total_played ? total_plays += item?.statistics?.total_played : null;
                    item?.tags?.includes("ok") ? total_okplays += item?.statistics?.total_played : null;
                    item?.tags?.includes("ok") ? total_ok += 1 : null;
                    item?.statistics?.liked ? average_likes += item?.statistics?.liked : null;
                    item?.statistics?.liked ? likes_count += 1 : null;
                    item?.statistics?.difficulty ? average_difficulty += item?.statistics?.difficulty : null;
                    item?.statistics?.difficulty ? difficulty_count += 1 : null;
                    item?.statistics?.time ? average_time += item?.statistics?.time : null;
                    item?.statistics?.time ? time_count += 1 : null;
                    item?.complexity ? total_complexity += item?.complexity : null;
                });

                const playResults = document.createElement("div");
                playResults.classList.add("gtl-stats");
                playResults.textContent = `Plays: ${total_plays}`;

                const okPlayResults = document.createElement("div");
                okPlayResults.classList.add("gtl-stats");
                okPlayResults.textContent = `Verified plays: ${total_okplays}`;

                const mapResults = document.createElement("div");
                mapResults.classList.add("gtl-stats");
                mapResults.textContent = `Maps: ${total_maps}`;

                const okResults = document.createElement("div");
                okResults.classList.add("gtl-stats");
                okResults.textContent = `Verified maps: ${total_ok}`;

                const likesResults = document.createElement("div");
                likesResults.classList.add("gtl-stats");
                likesResults.textContent = `Avg likes: ${Math.round((average_likes * 100) / likes_count)}%`;

                const difficultyResults = document.createElement("div");
                difficultyResults.classList.add("gtl-stats");
                difficultyResults.textContent = `Avg difficulty: ${Math.round(100 - ((average_difficulty * 100) / difficulty_count))}%`;

                const timeResults = document.createElement("div");
                timeResults.classList.add("gtl-stats");
                timeResults.textContent = `Avg time: ${Math.round(Math.round(average_time / time_count))}s`;

                const complexityResults = document.createElement("div");
                complexityResults.classList.add("gtl-stats");
                complexityResults.textContent = `Complexity: ${total_complexity}`;

                const stats = document.createElement("div");
                stats.classList.add("gtl-stats-container");
                stats.appendChild(playResults);
                stats.appendChild(okPlayResults);
                stats.appendChild(mapResults);
                stats.appendChild(okResults);
                stats.appendChild(likesResults);
                stats.appendChild(difficultyResults);
                stats.appendChild(timeResults);
                stats.appendChild(complexityResults);

                const title = document.getElementsByClassName("user-tab-title-container")[0];
                title.appendChild(stats);
            });
        }
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
