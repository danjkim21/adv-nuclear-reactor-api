// ======== Query Selectors ========
// Reactor search button
const searchReactorBtn = document.querySelector('#searchReactorBtn');
// Reactor Name input element
const reactorNameInput = document.querySelector('#reactorNameInput');
// Reactor display section
const reactorDisplayArea = document.querySelector('#reactorDisplay');
// Action Button section
const actionButton = document.querySelector('#actionButtonArea');
// Suggestions Field
let ulField = document.querySelector('#suggestions');

// ======== Event Listeners ========
// searchReactorBtn -- 'On Click', run function searchReactor()
searchReactorBtn.addEventListener('click', searchReactor);
// searchreactorBtn -- 'on Click', run function showReactorInfo()
searchReactorBtn.addEventListener('click', showReactorInfo);

// ======== Main Functions ========
// searchReactor() -- fetch's reactor API database
async function searchReactor() {
  const reactorName = reactorNameInput.value;
  try {
    // Fetch Adv. Reactor DB data
    const response = await fetch(
      `https://adv-nuclear-api.herokuapp.com/api/${reactorName}`
    );
    const data = await response.json();
    console.log(data[0]);

    // Displays selected reactor information in the reactorDisplayArea section
    document.querySelector('#displayName').innerText = data[0].name;
    document.querySelector('#displayProducer').innerHTML = '<b>Vendor: </b>' + data[0].producer;
    document.querySelector('#displayCountry').innerHTML = '<b>Country of Origin: </b>' + data[0].country;
    document.querySelector('#displayType').innerHTML = '<b>Reactor Type: </b>' + data[0].type;
    document.querySelector('#displayStatus').innerHTML = '<b>Summary Status: </b>' + data[0].status;
    document.querySelector('#displayGrossPower').innerHTML = '<b>Gross Power: </b>' + data[0].grossPower + ' MWe';
  } catch (error) {
    console.log(error);
  }
}

// ======== Accessory Functions ========
// showReactorInfo() -- Unhides reactorDisplayArea and the Action Button
function showReactorInfo() {
  reactorDisplayArea.classList.toggle('hidden');
  actionButton.classList.toggle('hidden');
  ulField.classList.add('hidden');
}

// INPUT AUTOCOMPLETE ON PAGE LOAD - IIFE ----------------
(function () {
  'use strict';
  reactorNameInput.addEventListener('input', changeAutoComplete);
  reactorNameInput.addEventListener('focusin', removeHidden);
  ulField.addEventListener('click', selectItem);

  // Fetch Adv. Reactor DB data for autocomplete list
  let reactorSearchList = [];
  fetch(`https://adv-nuclear-api.herokuapp.com/api/`)
    .then((response) => response.json())
    .then((dataResults) => {
      dataResults.forEach((elem) => reactorSearchList.push(elem.name));
    });
  // console.log(reactorSearchList)

  function removeHidden() {
    ulField.classList.remove('hidden');
  }
  function changeAutoComplete({ target }) {
    let data = target.value;
    ulField.innerHTML = ``;
    if (data.length) {
      let autoCompleteValues = autoComplete(data);
      autoCompleteValues.forEach((elem) => {
        addItem(elem);
      });
    }
  }
  function autoComplete(inputValue) {
    return reactorSearchList.filter((elem) =>
      elem.toLowerCase().includes(inputValue.toLowerCase())
    );
  }
  function addItem(value) {
    ulField.innerHTML = ulField.innerHTML + `<li>${value}</li>`;
  }
  function selectItem({ target }) {
    if (target.tagName === 'LI') {
      reactorNameInput.value = target.textContent;
      ulField.innerHTML = ``;
    }
  }
})();
