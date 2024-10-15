let currInput = document.getElementById("currencyInput");
let proceedBtn = document.getElementsByClassName("processExchange");
let exchangeRate = document.getElementById("exchangeRate");
let msgBox = document.getElementById("msgDisplay");
let dropdown = document.querySelectorAll("select");
let form = document.querySelector("form");
let BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
let fromFlag = document.getElementById("fromFlag");
let toFlag = document.getElementById("toFlag");

let fromCountry;
let toCountry;
let rate;
let finalAmount;
let inputVal;

for (let select of dropdown) {
    for (let currencyCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currencyCode;
        newOption.value = currencyCode;
        if (newOption.value === "USD" && select.name === "fromCountryDrop") {
            newOption.selected = true;
        } else if (newOption.value === "INR" && select.name === "toCountryDrop") {
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }
    select.addEventListener("change", (evt) => {
        checkCountry();
        updateFlag(evt.target);
    });
}


form.addEventListener("submit", async (evt) => {
    inputVal = document.getElementById("currencyInput").value;
    evt.preventDefault();
    checkCountry();
    await apiFetchRates();
    finalAmount = inputVal * rate;
    displayResults();
    
});

const checkCountry = () => {
    fromCountry = document.getElementById("fromCountryDrop").value;
    toCountry = document.getElementById("toCountryDrop").value;
};

const updateFlag = () => {
    let fromcountryCode = countryList[fromCountry];
    let FROM_URL = `https://flagsapi.com/${fromcountryCode}/flat/48.png`;

    let tocountryCode = countryList[toCountry];
    let TO_URL = `https://flagsapi.com/${tocountryCode}/flat/48.png`;

    fromFlag.src = FROM_URL;
    toFlag.src = TO_URL;
};

const apiFetchRates = async () => {
    if (!fromCountry || !toCountry) {
        console.error("From country or to country is not selected.");
        return;
    }

    let URL = `${BASE_URL}/${fromCountry.toLowerCase()}.json`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);
        rate = data[fromCountry.toLowerCase()][toCountry.toLowerCase()];
        if (rate === undefined) {
            console.error(`Rate not found for ${fromCountry} to ${toCountry}`);
            return;
        }
        console.log(rate);
        return rate;
    } catch (error) {
        console.error("Error fetching rates:", error);
    }
};

const displayResults = () => {
    if (inputVal) {
    msgBox.innerText = `${inputVal} ${fromCountry} → ${finalAmount} ${toCountry}`;
    } else {
        msgBox.innerText = `1 ${fromCountry} → ${rate} ${toCountry}`;
    }
    exchangeRate.innerText = `1 ${fromCountry} = ${rate} ${toCountry}`;
};
