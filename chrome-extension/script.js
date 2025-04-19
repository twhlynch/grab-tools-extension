const version = '2.0';
const domain = window.location.hostname;
const path = window.location.pathname;
const query = window.location.search;

if (domain === 'grab-tools.live') {
    grabToolsScript();
} else if (domain === 'grabvr.quest') {
    grabVRScript();
}

function checkForUpdates() {
    fetch('https://grab-tools.live/extensionVersion.json')
    .then(response => response.json()).then(data => {
        if (data.version !== /*chrome.runtime.getManifest().*/version) {
            document.getElementById('extension-update').style.display = 'block';
        }
    });
}

function grabToolsScript() {
    if (path === '' || path === '/') {
        checkForUpdates();
    }
}

function grabVRScript() {
    if (path === '/levels' || path === '/levels/') {
        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, {childList: true, subtree: true});
        createColorPicker();

        // if (query.includes('user_id=') || query.includes('tab_my_levels')) {
        //     let userId;
        //     if (query.includes('tab_my_levels')) {
        //         userId = JSON.parse(localStorage.user).user.info.user_id;
        //     } else {
        //         userId = query.split('user_id=')[1];
        //     }

        //     fetch(`https://api.slin.dev/grab/v1/list?max_format_version=100&user_id=${userId}`).then((response) => {
        //         return response.json();
        //     }).then((data) => {

        //         let total_plays = 0;
        //         let total_okplays = 0;
        //         let total_maps = 0;
        //         let total_ok = 0;
        //         let average_likes = 0;
        //         let likes_count = 0;
        //         let average_difficulty = 0;
        //         let difficulty_count = 0;
        //         let average_time = 0;
        //         let time_count = 0;
        //         let total_complexity = 0;

        //         data.forEach(item => {
        //             total_maps += 1;
        //             item?.statistics?.total_played ? total_plays += item?.statistics?.total_played : null;
        //             item?.tags?.includes('ok') ? total_okplays += item?.statistics?.total_played : null;
        //             item?.tags?.includes('ok') ? total_ok += 1 : null;
        //             item?.statistics?.liked ? average_likes += item?.statistics?.liked : null;
        //             item?.statistics?.liked ? likes_count += 1 : null;
        //             item?.statistics?.difficulty ? average_difficulty += item?.statistics?.difficulty : null;
        //             item?.statistics?.difficulty ? difficulty_count += 1 : null;
        //             item?.statistics?.time ? average_time += item?.statistics?.time : null;
        //             item?.statistics?.time ? time_count += 1 : null;
        //             item?.complexity ? total_complexity += item?.complexity : null;
        //         });

        //         const playResults = document.createElement('div');
        //         playResults.classList.add('gtl-stats');
        //         playResults.textContent = `Plays: ${total_plays}`;

        //         const okPlayResults = document.createElement('div');
        //         okPlayResults.classList.add('gtl-stats');
        //         okPlayResults.textContent = `Verified plays: ${total_okplays}`;

        //         const mapResults = document.createElement('div');
        //         mapResults.classList.add('gtl-stats');
        //         mapResults.textContent = `Maps: ${total_maps}`;

        //         const okResults = document.createElement('div');
        //         okResults.classList.add('gtl-stats');
        //         okResults.textContent = `Verified maps: ${total_ok}`;

        //         const likesResults = document.createElement('div');
        //         likesResults.classList.add('gtl-stats');
        //         likesResults.textContent = `Avg likes: ${Math.round((average_likes * 100) / likes_count)}%`;

        //         const difficultyResults = document.createElement('div');
        //         difficultyResults.classList.add('gtl-stats');
        //         difficultyResults.textContent = `Avg difficulty: ${Math.round(100 - ((average_difficulty * 100) / difficulty_count))}%`;

        //         const timeResults = document.createElement('div');
        //         timeResults.classList.add('gtl-stats');
        //         timeResults.textContent = `Avg time: ${Math.round(Math.round(average_time / time_count))}s`;

        //         const complexityResults = document.createElement('div');
        //         complexityResults.classList.add('gtl-stats');
        //         complexityResults.textContent = `Complexity: ${total_complexity}`;

        //         const stats = document.createElement('div');
        //         stats.classList.add('gtl-stats-container');
        //         stats.appendChild(playResults);
        //         stats.appendChild(okPlayResults);
        //         stats.appendChild(mapResults);
        //         stats.appendChild(okResults);
        //         stats.appendChild(likesResults);
        //         stats.appendChild(difficultyResults);
        //         stats.appendChild(timeResults);
        //         stats.appendChild(complexityResults);

        //         const title = document.getElementsByClassName('user-title-wrapper')[0];
        //         title.parentNode.appendChild(stats);
        //     });
        // }
    } else if (path === '/levels/viewer' || path === '/levels/viewer/') {
        const levelId = query.split('?level=')[1].replace('&verify_queue', '');

        const editButton = document.createElement('a');
        editButton.classList.add('gtl-btn');
        editButton.setAttribute('target', '_blank');
        editButton.setAttribute('href', `https://grab-tools.live/editor?level=${levelId}`);
        editButton.textContent = 'Edit JSON';

        const downloadButton = document.createElement('a');
        downloadButton.classList.add('gtl-btn');
        downloadButton.setAttribute('target', '_blank');
        downloadButton.setAttribute('href', `https://grab-tools.live/download?level=${levelId}`);
        downloadButton.textContent = 'Download';

        const buttons = document.createElement('div');
        buttons.classList.add('gtl-buttons');

        [downloadButton, editButton].forEach(btn => {
            btn.style.color = 'rgb(42 63 89)';
            btn.style.width = 'fit-content';
        });

        buttons.appendChild(editButton);
        buttons.appendChild(downloadButton);

        document.getElementById('info').prepend(buttons);
        document.getElementById('download-button').style.display = 'block';
    }
}

function addButtonsToCard(element) {
    element.style.position = 'relative';

    const container = document.createElement('div');
    container.classList.add('gtl-btn-container');

    const card = element.childNodes[0];

    const levelUrl = card.querySelector('a').getAttribute('href');
    const levelId = levelUrl.split('?level=')[1].replace('&verify_queue', '');
    const detailsUrl = `https://api.slin.dev/grab/v1/details/${levelId.split(':').join('/')}`;

    const editButton = document.createElement('a');
    editButton.classList.add('gtl-btn');
    editButton.setAttribute('target', '_blank');
    editButton.setAttribute('href', `https://grab-tools.live/editor?level=${levelId}`);
    editButton.textContent = 'Edit';

    const downloadButton = document.createElement('a');
    downloadButton.classList.add('gtl-btn');
    downloadButton.setAttribute('target', '_blank');
    downloadButton.setAttribute('href', `https://grab-tools.live/download?level=${levelId}`);
    downloadButton.textContent = 'Download';

    container.appendChild(editButton);
    container.appendChild(downloadButton);
    element.appendChild(container);
}

function handleMutations(mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function (node) {
                if (node.classList && node.classList.contains('grid-item')) {
                    addButtonsToCard(node);
                }
            });
        }
    });
}

function createColorPicker() {
    let popupContainer = document.createElement('div');
    popupContainer.className = 'gtl-popup-container';

    let colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.className = 'gtl-color-picker';

    let colorPicker2 = document.createElement('input');
    colorPicker2.type = 'color';
    colorPicker2.className = 'gtl-color-picker';

    [colorPicker, colorPicker2].forEach(picker => {
        picker.value = '#010101';
        picker.addEventListener('change', () => {
            if (parseInt(picker.value.substring(1, 3), 16) < 6 && parseInt(picker.value.substring(3, 5), 16) < 6 && parseInt(picker.value.substring(5, 7), 16) < 6) {
                picker.value = '#010101';
            }
        });
    });

    let sendButton = document.createElement('button');
    sendButton.textContent = 'Send RGB Values';
    sendButton.className = 'gtl-btn';
    sendButton.style.marginInline = 'auto';

    popupContainer.appendChild(colorPicker);
    popupContainer.appendChild(colorPicker2);
    popupContainer.appendChild(document.createElement('br'));
    popupContainer.appendChild(sendButton);

    sendButton.addEventListener('click', function() {
    let color = colorPicker.value;
    let color2 = colorPicker2.value;
    let red = parseInt(color.substring(1, 3), 16) / 255;
    let green = parseInt(color.substring(3, 5), 16) / 255;
    let blue = parseInt(color.substring(5, 7), 16) / 255;

    let red2 = parseInt(color2.substring(1, 3), 16) / 255;
    let green2 = parseInt(color2.substring(3, 5), 16) / 255;
    let blue2 = parseInt(color2.substring(5, 7), 16) / 255;

    const requestBody = JSON.parse(localStorage.user).user.info.active_customizations;
    requestBody.player_color_primary.color = [red, green, blue];
    requestBody.player_color_secondary.color = [red2, green2, blue2];
    fetch(`https://api.slin.dev/grab/v1/set_active_customizations?access_token=${JSON.parse(localStorage.user).user.access_token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(function(response) {
        return response;
    }).then(function(data) {
        console.log(data);
        alert('Success!');
    }).catch(function(error) {
        console.error('Error:', error);
    });
    });
    document.body.appendChild(popupContainer);
}