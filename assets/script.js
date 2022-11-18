let geniusURL = "https://api.genius.com";
let geniusToken = "zFAOsETRh7xAfSen8ewOe62Du0xx4slEmA1qx4uUNJZDneKLxyXdE958VfEZAtog";
var choice = document.createElement("option");
var genreName;
var songStorageID = 0;
var tempToken = "";
var test_artist = "";
var test_song = "";
var test_genre = "";
var test_id = "";
var test_call = "Blue October Hate Me";
var songStorage = [];
const genreList = ["Rock", "Pop", "Country", "Latino", "R&B", "Dance/electronic", "Indie", "Chill", "Gaming"];

// Function for JSON conversion
async function convertToJson(response) {
    return await response.json();
}

const APIController = (function() {
    const clientId = '9d7bc0a016f849bc829d5c74354a69d5';
    const clientSecret = '77dfd8970adc4b1582ecea9c9d13a010';
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
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        genreName = data.categories.items;
        return data.categories.items;
    }

    return {
        getToken() {
            return _getToken();
        },

        getGenres(token) {
            return _getGenres(token);
        }

    }
})();

const UIController = (function() {
    return {
        inputField() {
            return {
                genre: document.querySelector('#select_genre'),
                tracks: document.querySelector('#songContainer'),
                lyrics: document.querySelector('#lyricsContainer'),
                //submit: document.querySelector('#btn_submit'),
            }
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector('#select_genre').insertAdjacentHTML('beforeend', html);
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.inputField().lyrics.innerHTML = '';
        },

        storeToken(value) {
            document.querySelector('#hidden_token').value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector('#hidden_token').value
            }
            tempToken = token;
        }
    }
})();

const APPController = (function(UICtrl, APICtrl) {
    const DOMInputs = UICtrl.inputField();
    const loadGenres = async () => {
/*        var choices = [];

        for (var i = 0; i < genreList.length; ++i)
        {
            choice.value = i;
            choice.text = genreList[i];0000
            choices.push(choice.outerHTML);
        }

        document.getElementById("select_genre").insertAdjacentHTML('beforeEnd', choices.join('\n'));
*/
        const token = await APICtrl.getToken();
        tempToken = token;
        UICtrl.storeToken(token);
        const genres = await APICtrl.getGenres(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));

    }

    DOMInputs.genre.addEventListener('change', async () => {
        UICtrl.resetTracks();
        $("#songContainer").html("<h3>SONGS</h3><br>");
        $("#lyricsContainer").html("<h3>LYRICS</h3><br>");
        selectElement = document.querySelector('#select_genre');
        genreSelect = selectElement.options[selectElement.selectedIndex].text;
        grabSongs();
    });

    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault();
        test_call = localStorage.getItem(e.target.id);
        songStorageID = e.target.id;
        searchSongAPI();
    });    

    return {
        init() {
            loadGenres();
        }
    }
})(UIController, APIController);

APPController.init();

// A function that adds lyrics to HTML
async function addLyricsToHTML(songId) {
    let response = await fetch(`https://genius.com/songs/${songId}/embed.js`)
    let scriptText = await response.text()
    let lyricsHtml = scriptText.match(/JSON\.parse\((.+)\)\)/)
    lyricsHtml = lyricsHtml[1].replaceAll(/\\n/g, "")
    lyricsHtml = lyricsHtml.replaceAll(/\\/g, "")
    lyricsHtml = lyricsHtml.replaceAll(/<iframe.+<\/iframe>/g, "")
    lyricsHtml = lyricsHtml.trim()
    lyricsHtml = lyricsHtml.replace(/\'\s*\"\s+/g, '').replace(/>\"\'/, ">")
    $("#lyricsContainer").html("<h3>LYRICS</h3><br>");
    if (lyricsHtml.match(songStorage[songStorageID])) {
        document.querySelector("#lyricsContainer").insertAdjacentHTML('beforeend', lyricsHtml);
    }
        
    else {
        document.querySelector('#lyricsContainer').insertAdjacentHTML('beforeend', "Data Not Currently Available");
    }
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI(query=test_call) {
    if (test_call != null) {
        let requestURL = `${geniusURL}/search?q=${query}&access_token=${geniusToken}`;
        let response = await fetch(requestURL);
        let data = await convertToJson(response);
        await addLyricsToHTML(data.response.hits[0].result.id)
         return data;
    }
}

async function grabSongs() {
    const testurl = "https://api.spotify.com/v1/search?type=track&q=%20genre:" + genreSelect + "&limit=50";
    const options = {
        headers: {
            Authorization: "Bearer " + tempToken
        }
    };

    let response = await fetch(testurl, options)
    let data = await convertToJson(response)
    let artistTrue = data.tracks.items.length > 0;
    if (response.status == 200 && artistTrue) {
        var randomHolder = [];
        songStorage = [];

        for (var i = 0; i < 10; i++) {
            var randomNumber = (Math.floor(Math.random() * 49));
            if (randomHolder.find(element => element == randomNumber)) {
                i--;
            }

            else {
                randomHolder.push(randomNumber);
                test_artist = data.tracks.items[randomNumber].artists[0].name;
                test_song = data.tracks.items[randomNumber].name;
                test_call = test_artist + " " + test_song;
                songStorage.push(test_song);
                var html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${i}">${test_artist} - ${test_song}</a><br>`;
                document.querySelector('#songContainer').insertAdjacentHTML('beforeend', html);
                localStorage.setItem(i, test_call);
            }
        }
    }

    else {
        document.querySelector('#songContainer').insertAdjacentHTML('beforeend', "Data Not Currently Available");
    }
}