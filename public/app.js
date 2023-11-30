function onChangeOrderByTrack() {
    const inputSelect = document.getElementById("orderBySelectTrack").value;
    if (inputSelect == "none") {
        document.getElementsByName("isDescTrack").forEach(x => x.disabled = true);
    } else {
        document.getElementsByName("isDescTrack").forEach(x => x.disabled = false);
    }
}

function onChangeOrderBy() {
    const inputSelect = document.getElementById("orderBySelect").value;
    if (inputSelect == "none") {
        document.getElementsByName("isDesc").forEach(x => x.disabled = true);
    } else {
        document.getElementsByName("isDesc").forEach(x => x.disabled = false);
    }
}

async function renderResponse(response) {
    const json = await response.json();
    const tableDiv = document.getElementById('tableContent');
    tableDiv.replaceChildren(buildHtmlTable(json));
}

async function getGenres() {
    const response = await fetch('api/genres');
    renderResponse(response);
}

async function getArtist() {
    let input = document.getElementById("artistId").value;
    const response = await fetch(`api/artists/${input}`);
    renderResponse(response);
}

async function searchArtists() {
    let input = document.getElementById("artistName").value;
    const response = await fetch('api/artists?' + new URLSearchParams({
        name: input
    }));
    renderResponse(response);
}

async function getTrack() {
    let input = document.getElementById("trackId").value;
    const response = await fetch(`api/tracks/${input}`);
    renderResponse(response);
}

async function searchTracks() {
    let input = document.getElementById("trackAlbumTitle").value;
    let inputNum = document.getElementById("trackNum").value;
    const response = await fetch('api/tracks?' + new URLSearchParams({
        title: input,
        limit: inputNum
    }));
    renderResponse(response);
}

async function searchTracksData() {
    let searchBy = document.getElementById("searchTrackBy").value;
    let searchContent = document.getElementById("searchTrackData").value;
    let orderBy = document.getElementById("orderBySelectTrack").value;
    let isDesc = document.querySelector('input[name="isDescTrack"]:checked').value;
    if (orderBy == "none") {
        orderBy = "";
        isDesc = "";
    }

    const response = await fetch('api/tracks/search?', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            searchBy: searchBy,
            searchContent: searchContent,
            orderBy: orderBy,
            isDesc: isDesc
        }),
    });
    renderResponse(response);
}

async function createFavourite() {
    let input = document.getElementById("favNameCreate").value;
    if (input.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
        alert('Invalid favourite list name!');
        return;
    }
    let inputFavTrackids = document.getElementById("favTrackids").value;

    const response = await fetch('api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: input,
            list: inputFavTrackids.split(',')
        }),
    });
    renderResponse(response);
}

async function updateFavourite() {
    let input = document.getElementById("favNameCreate").value;
    let inputFavTrackids = document.getElementById("favTrackids").value;

    const response = await fetch(`api/favourites/name/${input}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            list: inputFavTrackids.split(',')
        }),
    });
    renderResponse(response);
}

async function getAllFavourites() {
    const response = await fetch('api/favourites');
    renderResponse(response);
}

async function getFavourite() {
    let input = document.getElementById("favNameGet").value;
    const response = await fetch(`api/favourites/name/${input}`);
    renderResponse(response);
}

async function getFavouriteDetail() {
    let orderBy = document.getElementById("orderBySelect").value;
    let isDesc = document.querySelector('input[name="isDesc"]:checked').value;
    if (orderBy == "none") {
        orderBy = "";
        isDesc = "";
    }
    let input = document.getElementById("favNameGetDetail").value;
    const response = await fetch(`api/favourites/name/${input}/detail?` + new URLSearchParams({
        orderBy: orderBy,
        isDesc: isDesc
    }));
    renderResponse(response);
}

async function deleteFavourite() {
    let input = document.getElementById("favNameGet").value;
    const response = await fetch(`api/favourites/name/${input}`, {
        method: 'DELETE'
    });
    renderResponse(response);
}