// const wrapper = 












let genre = "rock";
let baseURL = "https://developer.musixmatch.com/";

// Function for JSON conversion
async function convertToJson (response) {
    return await response.json();
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI (artist, track) {
    let requestURL = `${baseURL}artist.search?q_artist=${artist}&q_track=${track}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    console.log(data);
    return data;
}

async function displaySoundcloud () {
    console.log("entered display function");
}
        


function displayLyrics () {

}

function previewSong () {
    
}

var http = require('http');

/* Create an HTTP server to handle responses */

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello World');
    response.end();
  })
  .listen(8888);