async function getPlanets() {
    // Hämtar API-nyckel
    let apiKeyResponse = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", {
        method: "POST",
    });

    if (apiKeyResponse.ok) {
        // Extraherar API-nyckeln från svaret
        let apiKeyData = await apiKeyResponse.json();
        let apiKey = apiKeyData.key;

        // Hämtar planetinformation med API-nyckeln
        let planetsResponse = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies", {
            method: "GET",
            headers: { "x-zocom": apiKey }
        });

        if (planetsResponse.ok) {
            // Extraherar planetdata från svaret
            planetsData = await planetsResponse.json();
            return planetsData;
        }
    }
}

// Hämtar planetdata genom att kalla på 'getPlanets()'
async function planetInfo() {
    let planetsData = await getPlanets();

    // Väljer alla element med klassen ".planet" 
    const planetElements = document.querySelectorAll(".planet");

    // När ett element klickas på anropas 'togglePlanetInfo()'
    planetElements.forEach((planetElement, index) => {
        planetElement.addEventListener("click", () => {
            togglePlanetInfo(planetsData.bodies[index]);
        });
    });
}

// Visar eller döljer modalen beroende på om information har anropats
function togglePlanetInfo(planetData) {
    const modalContent = document.querySelector(".modal-content");

    // Modalen byter display till "block"
    modalContent.style.display = "block";
    

    // Modalen fylls med informationen nedan, '.join(", ")' separerar arrayen snyggt 
    modalContent.innerHTML = `
        <span class="close" id="close">&times;</span>
        <section class="planet-info" id="planetInfo">
            <h1>${planetData.name}</h1>
            <h2>${planetData.latinName}</h2>
            <p>${planetData.desc}</p>
            <div class="line"></div>
            <section class="info-box">
                <p class="info-title">OMKRETS</p>
                <p class="info-title">KM FRÅN SOLEN</p>
                <p class="info-text">${formatNumberWithSpaces(planetData.circumference)} km</p>
                <p class="info-text">${formatNumberWithSpaces(planetData.distance)} km</p>
                <p class="info-title">MAX TEMPERATUR</p>
                <p class="info-title">MIN TEMPERATUR</p>
                <p class="info-text">${planetData.temp.day} C</p>
                <p class="info-text">${planetData.temp.night} C</p>
            </section>
            <div class="line"></div>
            <p class="info-title">MÅNAR</p>
            <p>${planetData.moons.join(", ")}</p>
        </section>
    `;

    // Stängknapp för modalen, byter display till "none"
    const closeButton = document.getElementById("close");
    closeButton.addEventListener("click", () => {
        modalContent.style.display = "none";
    });
}

// Konverterar många siffror så de står tre och tre
function formatNumberWithSpaces(number) {
    // Konverterar numret till en sträng
    const numString = number.toString();
    
    // Delar upp strängen i grupper om tre siffror från slutet
    const groups = numString.match(/(\d{1,3})(?=(\d{3})*$)/g);
    
    // Returnerar strängen med mellanslag mellan varje grupp
    return groups ? groups.join(" ") : numString;
}

// Anropar informationen från start
planetInfo();