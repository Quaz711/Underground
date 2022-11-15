const wrapper = document.querySelector(".Wrapper"),
selectBtn = wrapper.querySelector(".select-btn"),
searchInp = wrapper.querySelector("input")

options = wrapper.querySelector(".options");
// array of genres
let genres = ["Popular music", "Pop music", "Rock", "Hip hop music", "Rhythm and blues", "Country music",
    "Jazz", "Blues", "Electronic dance music", "Electronic music", "World music", "Classical music",
    "Music of the United States", "Heavy metal", "Alternative rock", "Soul music", "Dance music",
    "Reggae", "Singing", "Latin music", "Folk music", "Pop rock", "Indie rock", "Punk rock",
    "Hip hop", "Disco", "Music of Latin America", "Funk", "Rapping", "House music", "Easy listening", "K-pop",
    "Musical theatre", "Classic rock", "Contemporary R&B", "Techno", "African-American music", "Folk music",
    "Psychedelic rock", "New-age music", "J-pop", "Gospel music", "Instrumental", "Grunge", "New wave",
    "Latin pop", "Trap music", "Ska", "Bluegrass", "Hard rock", "Salsa music"];

function addGenre(selectedGenre) {
    options.innerHTML = "";
   genres.forEach(genre => {
    // if selected genre and genre value is same then added selected class
        let isSelected = genre == selectedGenre ? "selected" : "";
        // adding each genre inside the li  and inserting all li inside the options tag
        let li = `<li onclick="updateName(this)" class="${isSelected}">${genre}</li>`;
        options.insertAdjacentHTML("beforeend", li);
        
   });
}

addGenre();

function updateName(selectedLi) {
    searchInp.value = "";
    addGenre(selectedLi.innerText);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

searchInp.addEventListener("keyup", () => {
    let arr = []; //empty array
    let searchedVal = searchInp.value.toLowerCase();
    //
    arr = genres.filter(data => {
        return data.toLowerCase().startsWith(searchedVal);
    }).map(data => `<li onclick="updateName(this)">${data}</li>`).join("");
    options.innerHTML = arr ? arr : `<p>Oops! Genre not found</p>`;
});

selectBtn.addEventListener("click", () => {
    wrapper.classList.toggle("active");

});
