// Data Store

const  store = {
  toppings: []
};

// Functions that update the data store
// just adding toppings as an argument for consistency.
function setToppings(toppings, newToppings) {
  return newToppings;
}

function addTopping(toppings, newTopping) {
  // let's only use functions that are non mutating
  const newToppings = toppings.concat(newTopping);
  return newToppings;
}

function removeTopping(toppings, toppingName) {
  // could also match by id rather than by name, which honestly is better
  const updatedToppings = toppings.filter(topping => topping.name !== toppingName);
  return updatedToppings;
}

// API functions
// Make API request and update data store
async function getToppings() {
  const res = await fetch("/toppings");
  const data = await res.json();
  store.toppings = setToppings(store.toppings, data);
}

async function createTopping(toppingName) {
  const res = await fetch("/toppings",
    {
      method: "POST",
      body: JSON.stringify({ topping: toppingName }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
  const data = await res.json();
  store.toppings = addTopping(store.toppings, data);
}

async function deleteTopping(toppingName) {
  const res = await fetch(`/toppings/${toppingName}`,
    {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });
  const data = await res.json();
  store.toppings = removeTopping(store.toppings, toppingName);
}
  

// Rendering Code
function renderToppingsList() {
  const toppingsList = document.getElementById("toppings-list");
  toppingsList.innerHTML = ToppingsList(store.toppings);
}

function ToppingsList(toppings) {
  return toppings.map((topping) => ToppingsListItem(topping)).join("");
}

function ToppingsListItem(topping) {
  return `<li data-topping="${topping.name}">
  <span>${topping.name}</span>
  <button onclick="handleRemoveClick(event)">Remove</button>
  </li>`;
}

// Event Handlers
window.addEventListener("DOMContentLoaded", async () => {
  await getToppings();
  renderToppingsList();
  
  const toppingForm = document.getElementById("topping-form");
  toppingForm.onsubmit = handleSubmitToppingForm;
});

async function handleSubmitToppingForm(event) {
  event.preventDefault();
  const toppingInput = event.target.elements["topping"];
  const topping = toppingInput.value;
  toppingInput.value = "";

  await createTopping(topping);
  renderToppingsList();
}

async function handleRemoveClick(event) {
  const toppingName = event.target.parentElement.dataset.topping;
  await deleteTopping(toppingName);
  renderToppingsList();
}