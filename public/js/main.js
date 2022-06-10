// ======== Query Selectors ========
// Reactor search button
const searchReactorBtn = document.querySelector('#searchReactorBtn');
// Reactor Name input element
const reactorNameInput = document.querySelector('#reactorNameInput');
// Reactor display section
const reactorDisplayArea = document.querySelector('#reactorDisplay');
// Action Button section
const actionButton = document.querySelector('#actionButtonArea');

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
    document.querySelector('#displayProducer').innerText = data[0].producer;
    document.querySelector('#displayCountry').innerText = data[0].country;
    document.querySelector('#displayType').innerText = data[0].type;
    document.querySelector('#displayStatus').innerText = data[0].status;
    document.querySelector('#displayGrossPower').innerText = data[0].grossPower;
  } catch (error) {
    console.log(error);
  }
}

// ======== Accessory Functions ========
// showReactorInfo() -- Unhides reactorDisplayArea and the Action Button
function showReactorInfo() {
  reactorDisplayArea.classList.toggle('hidden');
  actionButton.classList.toggle('hidden');
}
