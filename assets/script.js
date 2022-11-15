// let rootURL = "https://www.stands4.com/services/v2/lyrics.php";
// let userID = "11122";
// let token = "r4SEH458xioRVEOS";
let geniusURL = "https://api.genius.com";
let geniusToken = "zFAOsETRh7xAfSen8ewOe62Du0xx4slEmA1qx4uUNJZDneKLxyXdE958VfEZAtog";

// Function for JSON conversion
async function convertToJson(response) {
    return await response.json();
}




var tempToken = "";
var test_artist = "";
var test_song = "";
var test_genre = "";
var test_id = "";
var test_name = "";
var test_call = "Blue October Hate Me";


const APIController = (function() {
    
    const clientId = '9d7bc0a016f849bc829d5c74354a69d5';
    const clientSecret = '77dfd8970adc4b1582ecea9c9d13a010';

    // private methods
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
        console.log(data);
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) { 
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            console.log("Genre: " + html);
            console.log("Text: " + text);
            console.log("Value: " + value);
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            console.log("Playlist: " + html);
            console.log("Text: " + text);
            console.log("Value: " + value);
            test_genre = text;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        /*createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            console.log("Track: " + html);
            console.log("Id: " + id);
            console.log("Name: " + name);
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },*/

        createTrack(test_id, test_name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${test_id}">${test_name}</a>`;
            console.log("Track: " + html);
            console.log("Id: " + test_id);
            console.log("Name: " + test_name);
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {
            console.log("Img: " + img);
            console.log("Title: " + title);
            console.log("Artist: " + artist);

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)

            test_artist = artist;
            test_song = title;
            test_call = test_artist + test_song;
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
            tempToken = token;
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        tempToken = token;
        console.log("This is the token: " + tempToken);
        //test_function();
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        //populate our genres select element
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    // create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;        
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;       
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
        test_function();
    });
     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        //const tracksEndPoint = 10;
        console.log(tracksEndPoint);
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);

        console.log(test_artist);
        console.log(test_song);
        console.log(test_call);
        console.log(token);
        searchSongAPI();
    });    

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

APPController.init();

async function addLyricsToHTML(songId) {
    let response = await fetch(`https://genius.com/songs/${songId}/embed.js`)
    let scriptText = await response.text()  
    console.log(scriptText);
    console.log("entered addLyricsToHTML");
    let lyricsHtml = scriptText.match(/JSON\.parse\((.+)\)\)/)
    lyricsHtml = lyricsHtml[1].replaceAll(/\\n/g, "")    
    lyricsHtml = lyricsHtml.replaceAll(/\\/g, "")    
    lyricsHtml = lyricsHtml.replaceAll(/<iframe.+<\/iframe>/g, "")
    lyricsHtml = lyricsHtml.trim()
    lyricsHtml = lyricsHtml.replace(/\'\s*\"\s+/g, '').replace(/>\"\'/, ">")    
    let lyricsContainer = $('#lyricsContainer')
    lyricsContainer.html(lyricsHtml);
    console.log(lyricsHtml);
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI(query=test_call) {
    // let requestURL = `${rootURL}?uid=${userID}&tokenid=${token}&artist=${songObj.artist}&term=${songObj.term}&format=json`;
    let requestURL = `${geniusURL}/search?q=${query}&access_token=${geniusToken}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    console.log("entered searchSongAPI");
    console.log(data);
    await addLyricsToHTML(data.response.hits[0].result.id)
    return data;
}

async function test_function() {
    var alpha = "b";
    var offset = 990;
    //const originalurl = "https://api.spotify.com/v1/search?type=track&q=year:1958%20genre:classical&limit=50";
    //const url = "https://api.spotify.com/v1/search?q=%2525" + alpha +"%2525&type=track%2Cartist&market=ES&limit=10&offset=" + offset;
    //const workingtesturl = "https://api.spotify.com/v1/search?q=%25" + alpha +"%25&type=track&q=%20genre:rock&limit=50";
    const testurl = "https://api.spotify.com/v1/search?type=track&q=%20genre:" + test_genre + "&limit=500";
    const options = {
    headers: {
        Authorization: "Bearer " + tempToken
    }
    };

    let response = await fetch(testurl, options)
    let data = await convertToJson(response)
    console.log(data)
    // let artist0 = data.tracks.items[0].artists[0].name
    // let song0 = data.tacks.items[0].name
    // console.log(artist0)
    // console.log(song0)
    return data;

}



/*const MusicBrainzApi = require('musicbrainz-api').MusicBrainzApi;

const mbApi = new MusicBrainzApi({
  appName: 'my-app',
  appVersion: '0.1.0',
  appContactInfo: 'user@mail.org'
});

async function test_function() {
    const artist = await mbApi.lookupEntity('artist', 'ab2528d9-719f-4261-8098-21849222a0f2');
    console.log(artist);
}

*/


/*
//make a variable with some search queries and put it in an array. (you can create more search queries.
$getRandomSongsArray = array('%25a%25', 'a%25', '%25e%25', 'e%25', '%25i%25', 'i%25', '%25o%25', 'o%25');

//This will get a random result out of the array above
$getRandomSongs = $getRandomSongsArray[array_rand($getRandomSongsArray)];

//This will get a random offset number between 1 and 1000. So you get a random track. (you can change the numbers btw)
$getRandomOffset = rand(1, 1000);

//This is the url that gets the results out of the Spotify API. You have to put in the variables you created above.
$url = "https://api.spotify.com/v1/search?query=$getRandomSongs&offset=$getRandomOffset&limit=1&type=track&market=NL";
*/