let geniusURL = "https://api.genius.com"; //Genius API URL
let geniusToken = "zFAOsETRh7xAfSen8ewOe62Du0xx4slEmA1qx4uUNJZDneKLxyXdE958VfEZAtog"; //Genius API Token
var choice = document.createElement("option");
var genreName; //Stores the genre list to be utilized in different functions
var songStorageID = 0; //Stores what index a song title is at in the localstorage
var tempToken = ""; //Temporarily holds the Spotify Token to be utilized in different functions
var test_artist = ""; //Stores what the current artist is
var test_song = ""; //Stores what the current song is
var test_genre = ""; //Stores what the current genre is
var test_call = "Blue October Hate Me"; //Stores combined artist and song for utilization with Genuis API search criteria
var songStorage = []; //An array that stores the current songs that are being displayed from the selected genre
const genreList = ["Rock", "Pop", "Country", "Latino", "R&B", "Dance/electronic", "Indie", "Chill", "Gaming"]; //Man made genre list for custom input

// Function for JSON conversion
async function convertToJson(response) {
    return await response.json(); //Returns a response to .json
}
//Private functions that call functionalities from Spotify API
const APIController = (function() { //API Controller that handles getting the Spotify API Token and the genre list
    const clientId = '9d7bc0a016f849bc829d5c74354a69d5'; //Spotify API Client ID
    const clientSecret = '77dfd8970adc4b1582ecea9c9d13a010'; //Spotify API Client Secret
    const _getToken = async () => { //Function that calls Spotify API to grab the Token
        const result = await fetch('https://accounts.spotify.com/api/token', { //Fetches the Spotify API Token and stores it into a constant variable
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },

            body: 'grant_type=client_credentials'
        });

        const data = await result.json(); //Returns a response to .json for the Spotify API Token
        return data.access_token; //Returns a response to .json for the Spotify API Token
    }
    
    const _getGenres = async (token) => { //Function that returns Spotify API generate genre list

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, { //Fetches the Spotify API Client and stores it into a constant variable
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json(); //Returns a response to .json for the Spotify API generated genre list
        genreName = data.categories.items; //Grabs the Spotify API generated genre list and sotres it to be utilized in different functions
        return data.categories.items; //Returns a response to .json for the Spotify API generated genre list
    }

    return {
        getToken() {
            return _getToken(); //Calls the function to grab the Spotify API token
        },

        getGenres(token) {
            return _getGenres(token); //Calls the function to grab the Spotify API generated genre list
        }

    }
})();

const UIController = (function() { //UI Controller that handles getting the inputs for genre select, song select, and lyrics grab
    return {
        inputField() {
            return {
                genre: document.querySelector('#select_genre'), //puts HTML into a variable for quick access
                tracks: document.querySelector('#songContainer'), //puts HTML into a variable for quick access
                lyrics: document.querySelector('#lyricsContainer') //puts HTML into a variable for quick access
                //submit: document.querySelector('#btn_submit')
            }
        },

        createGenre(text, value) { //Function that creates the Spotify API generate genre dropdown list
            const html = `<option value="${value}">${text}</option>`; //Stores the genre choice into a variable
            document.querySelector('#select_genre').insertAdjacentHTML('beforeend', html); //Displays genre choice as a selectable option in dropdown menu
        },

        resetTracks() { //Function that clears the old results to make room for the new results
            this.inputField().tracks.innerHTML = '';
            this.inputField().lyrics.innerHTML = '';
        },

        storeToken(value) { //Function to store the Spotify API Token
            document.querySelector('#hidden_token').value = value;
        },

        getStoredToken() { //Function to retrieve the Spotify API Token
            return {
                token: document.querySelector('#hidden_token').value
            }
            tempToken = token; //Stores Spotify API token into a variable for access from different functions
        }
    }
})();

const APPController = (function(UICtrl, APICtrl) { //APP Controller to control loading the genres, change of genre selection, and track selection
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
        const token = await APICtrl.getToken(); //Grabs Spotify API Token and stores it into a constant variable
        tempToken = token; //Stores local token into a global variable
        UICtrl.storeToken(token); //Stores token to be utilized later on
        const genres = await APICtrl.getGenres(token); //Stores genres to be utilized later on
        genres.forEach(element => UICtrl.createGenre(element.name, element.id)); //Makes elements for each individual genre created

    }

    DOMInputs.genre.addEventListener('change', async () => { //Function is called when user selects a different genre
        UICtrl.resetTracks(); //Calls the clear function
        $("#songContainer").html("<h3 style='font-weight:bold;'>SONGS</h3><br>"); //Restyles songContainer
        $("#lyricsContainer").html("<h3 style='font-weight:bold;'>LYRICS</h3><br>"); //Restyles lyricsContainer
        selectElement = document.querySelector('#select_genre'); //Stores selected genre into a element
        genreSelect = selectElement.options[selectElement.selectedIndex].text; //Stores element into a variable
        grabSongs(); //Calls function to grab songs
    });

    DOMInputs.tracks.addEventListener('click', async (e) => { //Function is called when a track is selected from user
        e.preventDefault(); //Prevents html from reloading
        test_call = localStorage.getItem(e.target.id); //Takes targeted track's Key Id from local storage and pulls artist and song title into a variable
        songStorageID = e.target.id; //Takes targeted track's Key Id from local storage and pulls song title into a variable
        searchSongAPI(); //Calls function to use Genius API
    });    

    return {
        init() {
            loadGenres(); //Calls function to grab genres
        }
    }
})(UIController, APIController);

APPController.init(); //Uses the APP Controller to start the pulling of information from Spotify API

async function addLyricsToHTML(songId) { //Function that adds lyrics to HTML
    let response = await fetch(`https://genius.com/songs/${songId}/embed.js`) //Calls Genius API to access selected song lyrics
    let scriptText = await response.text() //Stores respont into a variable
    let lyricsHtml = scriptText.match(/JSON\.parse\((.+)\)\)/) //Eliminates extra information not needed from Genius API response
    lyricsHtml = lyricsHtml[1].replaceAll(/\\n/g, "") //Eliminates extra information not needed from Genius API response
    lyricsHtml = lyricsHtml.replaceAll(/\\/g, "") //Eliminates extra information not needed from Genius API response
    lyricsHtml = lyricsHtml.replaceAll(/<iframe.+<\/iframe>/g, "") //Eliminates extra information not needed from Genius API response
    lyricsHtml = lyricsHtml.trim() //Eliminates extra information not needed from Genius API response
    lyricsHtml = lyricsHtml.replace(/\'\s*\"\s+/g, '').replace(/>\"\'/, ">") //Eliminates extra information not needed from Genius API response
    $("#lyricsContainer").html("<h3 style='font-weight:bold;'>LYRICS</h3><br>"); //Restyles lyricsContainer
    if (lyricsHtml.match(songStorage[songStorageID])) { //Error checks to see if song title is in Genius API database
        document.querySelector("#lyricsContainer").insertAdjacentHTML('beforeend', lyricsHtml); //Displays lyrics if it passes error checking
    }
        
    else { //Displays that lyrics could not be found if it doesn't pass error checking
        document.querySelector('#lyricsContainer').insertAdjacentHTML('beforeend', "Data Not Currently Available");
    }
}

async function searchSongAPI(query=test_call) { // Function that gets the searched artist query URL
    if (test_call != null) { //Error checking to make sure a track was selected for grabbing lyrics
        let requestURL = `${geniusURL}/search?q=${query}&access_token=${geniusToken}`; //Grabs lyrics from Genius API
        let response = await fetch(requestURL); //Grabs lyrics from Genius API
        let data = await convertToJson(response); //Grabs lyrics from Genius API
        await addLyricsToHTML(data.response.hits[0].result.id )// Returns the data in JSON format
        return data;// Returns the data in JSON format
    }
}

async function grabSongs() { //Function that grabs the song that was selected
    const testurl = "https://api.spotify.com/v1/search?type=track&q=%20genre:" + genreSelect + "&limit=50"; //Pulls the songs from the Spotify API database
    const options = {
        headers: {
            Authorization: "Bearer " + tempToken
        }
    };

    let response = await fetch(testurl, options) //Sotres Spotify API results to a variable
    let data = await convertToJson(response) //Sotres Spotify API results to a variable
    let artistTrue = data.tracks.items.length > 0; //Sotres Spotify API results to a variable
    if (response.status == 200 && artistTrue) { //Error checks to make sure Spotify API was able to return songs for selected genre
        var randomHolder = []; //Array that holds random genreated numbers to prevent from the same songs to be displayed
        songStorage = []; //Array that stores the songs that are being pulled from Spotify API database

        for (var i = 0; i < 10; i++) { //Makes random numbers until all ten songs have been displayed onto the html
            var randomNumber = (Math.floor(Math.random() * 49)); //Random number generator
            if (randomHolder.find(element => element == randomNumber)) { //Error checking to see if the same random number was already generated
                i--; //Subtract so a new random number will be generated
            }

            else { //Error checking was fine and a different random number was picked than what we already have
                randomHolder.push(randomNumber); //Add new random number to stored random number array
                test_artist = data.tracks.items[randomNumber].artists[0].name; //Grab artist from Spotify API
                test_song = data.tracks.items[randomNumber].name; //Grab song from Spotify API
                test_call = test_artist + " " + test_song; //Combined artist and song into a variable
                songStorage.push(test_song); //Store song into stored song array
                var html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${i}">${test_artist} - ${test_song}</a><br>`; //Pull link from Spotify API into a variable
                document.querySelector('#songContainer').insertAdjacentHTML('beforeend', html); //Display pulled song onto the html
                localStorage.setItem(i, test_call); //Store artist and song into localstorage
            }
        }
    }

    else { //Erro checking detected that songs did not appear for selected genre
        document.querySelector('#songContainer').insertAdjacentHTML('beforeend', "Data Not Currently Available"); //Display that the selected genre did not return a result
    }
}