// const wrapper = 













let rootURL = "https://api.musixmatch.com/ws/1.1/";

// Function for JSON conversion
async function convertToJson (response) {
    return await response.json();
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI (artist, track) {
    let requestURL = `${rootURL}artist.search?q_artist=${artist}&q_track=${track}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    console.log(data);
    return data[0];
}

function displayLyrics (lyricObject) {
    let lyrics = lyricObject
    containerWhereLyricsWillGo.textContent = lyrics
}