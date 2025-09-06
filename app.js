const baseURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

let dropdown = document.querySelectorAll(".dropdown select");
let amountInput = document.querySelector(".amount input");
let msg = document.querySelector(".msg");
let date = document.querySelector(".date");
// Populate dropdowns
for (let select of dropdown) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", () => {
    updateflag(select);
    convertCurrency(); // auto convert when dropdown changes
  });
}

// Flag updater
const updateflag = (element) => {
  let currCode = element.value;
  let countrycode = countryList[currCode];
  let newSRC = `https://flagsapi.com/${countrycode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSRC;
};

// Auto-convert on amount input change
amountInput.addEventListener("input", convertCurrency);

// Conversion function
async function convertCurrency() {
  let amountval = amountInput.value.trim();

  // If empty, don't block user typing, just return
  if (amountval === "" || isNaN(amountval)) {
    msg.innerText = "Enter a valid amount";
    date.innerText = "";
    return;
  }

  amountval = parseFloat(amountval);
  if (amountval < 1) {
    amountval = 1;
    amountInput.value = "1";
  }

  let fromcurr = document.querySelector(".from select").value.toLowerCase();
  let tocurr = document.querySelector(".to select").value.toLowerCase();

  const URL = `${baseURL}/${fromcurr}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      msg.innerText = "Error fetching rates ❌";
      msg.style.color = "red";
      return;
    }

    let data = await response.json();
    let rate = data[fromcurr][tocurr];

    if (!rate) {
      msg.innerText = "Conversion rate unavailable ❌";
      return;
    }

    let finalAmount = (amountval * rate).toFixed(2);
    msg.innerHTML = `${amountval} ${fromcurr.toUpperCase()} = ${finalAmount} ${tocurr.toUpperCase()}`;
    date.innerHTML = `Last updated on ${data.date}`

  } catch (error) {
    msg.innerText = "Network error ❌";
  }
}
// Run once on page load
convertCurrency();
