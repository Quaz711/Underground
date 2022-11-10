// const wrapper = 













let baseURL = "https://developer.musixmatch.com/";

// Function for JSON conversion
async function convertToJson (response) {
    return await response.json();
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI (artist) {
    let requestURL = `${baseURL}artist.search?q_artist=${artist}&q_track=${track}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    console.log(data);
    return data;
}