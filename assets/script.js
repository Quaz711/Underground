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
const DOMElements = {
    selectGenre: '#select_genre',
    buttonSubmit: '#btn_submit',
    hfToken: '#hidden_token',
    divSonglist: '#songContainer'
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
        return data.categories.items;
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
    }
})();

const UIController = (function() {
    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
            }
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
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
    const DOMInputs = UICtrl.inputField();
    const loadGenres = async () => {
        const token = await APICtrl.getToken();
        tempToken = token;
        UICtrl.storeToken(token);
        const genres = await APICtrl.getGenres(token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    DOMInputs.genre.addEventListener('change', async () => {
        //e.preventDefault();
        UICtrl.resetTracks();
        const genreSelect = UICtrl.inputField().genre;
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        if(genreId == "0JQ5DAqbMKFQ00XGBls6ym") {
            test_genre = "Hiphop";
        }

        else if (genreId == "0JQ5DAqbMKFEC4WFtoNRpw") {
            test_genre = "Pop";
        }

        else if (genreId == "0JQ5DAqbMKFKLfwjuJMoNC") {
            test_genre = "Country";
        }

        else if (genreId == "0JQ5DAqbMKFxXaXKP7zcDp") {
            test_genre = "Latino";
        }

        else if (genreId == "0JQ5DAqbMKFDXXwE9BDJAr") {
            test_genre = "Rock";
        }

        else if (genreId == "0JQ5DAqbMKFLVaM30PMBm4") {
            test_genre = "Sommar";
        }

        else if (genreId == "0JQ5DAqbMKFAXlCG6QvYQ4") {
            test_genre = "Träning";
        }

        else if (genreId == "0JQ5DAqbMKFEZPnFQSFB1T") {
            test_genre = "R&B";
        }

        else if (genreId == "0JQ5DAqbMKFHOzuVTgTizF") {
            test_genre = "Dance/electronic";
        }

        else if (genreId == "0JQ5DAqbMKFEOEBCABAxo9") {
            test_genre = "Netflix";
        }

        else if (genreId == "0JQ5DAqbMKFCWjUTdzaG0e") {
            test_genre = "Indie";
        }

        else if (genreId == "0JQ5DAqbMKFzHmL4tf05da") {
            test_genre = "Humör";
        }

        else if (genreId == "0JQ5DAqbMKFCuoRTxhYWow") {
            test_genre = "Sova";
        }

        else if (genreId == "0JQ5DAqbMKFy0OenPG51Av") {
            test_genre = "Kristet och gospel";
        }

        else if (genreId == "0JQ5DAqbMKFDTEtSaS4R92") {
            test_genre = "Regionalmusik från Mexiko";
        }

        else if (genreId == "0JQ5DAqbMKFLb2EqgLtpjC") {
            test_genre = "Välmående";
        }

        else if (genreId == "0JQ5DAqbMKFFzDl7qN9Apr") {
            test_genre = "Chill";
        }

        else if (genreId == "0JQ5DAqbMKFPw634sFwguI") {
            test_genre = "EQUAL";
        }

        else if (genreId == "0JQ5DAqbMKFCfObibaOZbv") {
            test_genre = "Gaming";
        }

        else {
            test_genre = genreId;
        }

        grabGenre();
    });
     
    //DOMInputs.submit.addEventListener('click', async (e) => {
    //    e.preventDefault();
     //   UICtrl.resetTracks();
    //});

    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault();
//***************MAKE PULL FROM LOCAL STORAGE************************/
        //test_artist = artist;
        //test_song = title;
        //test_call = test_artist + " " + test_song;
        console.log(test_artist);
        console.log(test_song);
        console.log(test_id);
        console.log(test_call);
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
    let lyricsContainer = $('#lyricsContainer')
    lyricsContainer.html(lyricsHtml);
}

// Function that gets the searched artist query URL
// Returns the data in JSON format
async function searchSongAPI(query=test_call) {
    let requestURL = `${geniusURL}/search?q=${query}&access_token=${geniusToken}`;
    let response = await fetch(requestURL);
    let data = await convertToJson(response);
    await addLyricsToHTML(data.response.hits[0].result.id)
    return data;
}

async function grabGenre() {
    const testurl = "https://api.spotify.com/v1/search?type=track&q=%20genre:" + test_genre + "&limit=50";
    const options = {
        headers: {
            Authorization: "Bearer " + tempToken
        }
    };

    let response = await fetch(testurl, options)
    let data = await convertToJson(response)
    console.log(data.tracks.items[0].artists[0].name);
    console.log(data.tracks.items[0].name);
    console.log(data.tracks);

    for (var i = 0; i < 10; i++) {
        var randomNumber = (Math.floor(Math.random() * 49));
//***************CHECK TO SEE IF SAME RANDOM NUMBER WAS ALREADY USED************************/
        test_artist = data.tracks.items[randomNumber].artists[0].name;
        test_song = data.tracks.items[randomNumber].name;
        test_id = data.tracks.items[randomNumber].id;
        var html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${test_id}">${test_artist} - ${test_song}</a><br>`;
        document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
//***************MAKE SAVE TO LOCAL STORAGE************************/
    }
}