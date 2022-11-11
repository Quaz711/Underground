const wrapper = document.querySelector(".Wrapper"),
selectBtn = wrapper.querySelector(".select-btn"),

options = wrapper.querySelector(".options");

let genres = ["Popular music", "Pop music", "Rock", "Hip hop music", "Rhythm and blues", "Country music",
    "Jazz", "Blues", "Electronic dance music", "Electronic music", "World music", "Classical music",
    "Music of the United States", "Heavy metal", "Alternative rock", "Soul music", "Dance music",
    "Reggae", "Singing", "Latin music", "Folk music", "Pop rock", "Indie rock", "Punk rock",
    "Hip hop", "Disco", "Music of Latin America", "Funk", "Rapping", "House music", "Easy listening", "K-pop",
    "Musical theatre", "Classic rock", "Contemporary R&B", "Techno", "African-American music", "Folk music",
    "Psychedelic rock", "New-age music", "J-pop", "Gospel music", "Instrumental", "Grunge", "New wave",
    "Latin pop", "Trap music", "Ska", "Bluegrass", "Hard rock", "Salsa music"];

function addGenre() {
   genres.forEach(genre => {

        let li = `<li onclick="updateName(this)">${genre}</li>`;
        options.insertAdjacentHTML("beforeend", li);
        
   });
}

addGenre();

function updateName(selectedLi) {
    console.log(selectedLi.innerText);
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

selectBtn.addEventListener("click", () => {
    wrapper.classList.toggle("active");

});
