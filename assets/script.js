// const wrapper =

// let rootURL = "https://www.stands4.com/services/v2/lyrics.php";
// let userID = "11122";
// let token = "r4SEH458xioRVEOS";
let geniusURL = "https://api.genius.com";
let geniusToken =
    "zFAOsETRh7xAfSen8ewOe62Du0xx4slEmA1qx4uUNJZDneKLxyXdE958VfEZAtog";

// Function for JSON conversion
async function convertToJson(response) {
    return await response.json();
}



async function addLyricsToHTML(songId) {
    let response = await fetch(`https://genius.com/songs/${songId}/embed.js`)
    let scriptText = await response.text()  
    console.log(scriptText)  
    let lyricsHtml = scriptText.match(/JSON\.parse\((.+)\)\)/)
    lyricsHtml = lyricsHtml[1].replaceAll(/\\n/g, "")    
    lyricsHtml = lyricsHtml.replaceAll(/\\/g, "")    
    lyricsHtml = lyricsHtml.replaceAll(/<iframe.+<\/iframe>/g, "")
    lyricsHtml = lyricsHtml.trim()
    lyricsHtml = lyricsHtml.replace(/\'\s*\"\s+/g, '').replace(/>\"\'/, ">")    
    let lyricsContainer = $('#lyricsContainer')
    lyricsContainer.html(lyricsHtml) 
    console.log(lyricsHtml)    
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI(query="Adele Hello") {
    // let requestURL = `${rootURL}?uid=${userID}&tokenid=${token}&artist=${songObj.artist}&term=${songObj.term}&format=json`;
    let requestURL = `${geniusURL}/search?q=${query}&access_token=${geniusToken}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    console.log(data);
    await addLyricsToHTML(data.response.hits[0].result.id)
    return data;
}
searchSongAPI();

function displayLyrics(lyricObject) {
    let lyrics = lyricObject;
    containerWhereLyricsWillGo.textContent = lyrics;
}

async function displaySoundcloud() {
    console.log("entered display function");
}
