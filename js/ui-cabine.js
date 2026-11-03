import { trips, saveTrips } from "./store.js";

let courrantTraject;
let routId = Number(new URLSearchParams(location.search).get("id"));

//buttons
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const ModifierBtn = document.getElementById("Modifier-btn");
const cardsContainer = document.getElementById("cardContainer");

//events
addBtn.addEventListener("click", reservePlace);
deleteBtn.addEventListener("click", deletePlace);
// ModifierBtn.addEventListener("click", modifdyPlace);
// cardsContainer.addEventListener("click", clickCard);

//functions

export function renderTripDetails(traject) {
  courrantTraject = traject;
  const detailsHtml = document.getElementById("details");
  detailsHtml.innerHTML = `
      <div class="flex items-center gap-3">
        <svg
          class="text-[#0C1E4A]"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div class="flex flex-col">
          <p class="font-bold text-[#0C1E4A] flex items-center gap-3 text-lg">
            Line: ${traject.departure}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 8L22 12L18 16" />
              <path d="M2 12H22" />
            </svg>
            ${traject.destination}
          </p>
          <span class="text-xs font-semibold text-[#0C1E4A]/80 mt-0.5">
            Départ : ${traject.departureTime} | Arrivée : ${traject.arrivalTime}
          </span>
        </div>
      </div>
      <span class="text-white font-bold px-4 py-1.5 rounded-full bg-[#0066FF]">${traject.price} DH / place</span>
    `;
  updateStats(traject);
}

function updateStats(traject) {
  const totalHTML = document.getElementById("total");
  const avaibleHTML = document.getElementById("Available");
  const moneyHTML = document.getElementById("recette");

  totalHTML.innerText = `${traject.capacity} Total`;
  avaibleHTML.innerText = `${traject.capacity - traject.reservations.length} Available`;
  moneyHTML.innerText = `Recette: ${traject.price * traject.reservations.length} DH`;
}
export function refleshTheList(traject) {
  const slectedPlaceDropDown = document.getElementById("slectedPlace");
  const supprimerSelector = document.getElementById("supprimerSelector");
  const modifySelector = document.getElementById("modifySelector");
  const modifyNewPlace = document.getElementById("newPlace");

  //default values
  slectedPlaceDropDown.innerHTML = `<option value="0">-- choisir un siège --</option>`;
  supprimerSelector.innerHTML = `<option value="0">-- choisir un passager --</option>`;
  modifySelector.innerHTML = `<option value="0">-- choisir un passager --</option>`;
  modifyNewPlace.innerHTML = `<option value="0">-- choisir le nouveau siège --</option>`;

  //extract reserved seats only and traject capacity
  const reservedSeats = traject.reservations.map((r) => r.seat);
  const capacity = traject.capacity;

  for (let i = 1; i <= capacity; i++) {
    if (!reservedSeats.includes(i)) {
      // Fill dropdown menu for new reservation (available seats)
      const option = document.createElement("option");
      option.textContent = `Seat ${i}`;
      option.value = i;
      slectedPlaceDropDown.appendChild(option);

      // Fill dropdown menu for new place change
      const optionChagnePlace = document.createElement("option");
      optionChagnePlace.textContent = `Seat ${i}`;
      optionChagnePlace.value = i;
      modifyNewPlace.appendChild(optionChagnePlace);
    }
  }

  for (let i = 0; i < traject.reservations.length; i++) {
    const res = traject.reservations[i];

    // Fill delete dropdown
    const deleteOption = document.createElement("option");
    deleteOption.textContent = `Seat ${res.seat} - ${res.name}`;
    deleteOption.value = res.seat;
    supprimerSelector.appendChild(deleteOption);

    // Create new option for the modify dropdown
    const modifyOption = document.createElement("option");
    modifyOption.textContent = `Passager: ${res.name} [Seat ${res.seat}]`;
    modifyOption.value = res.seat;
    modifySelector.appendChild(modifyOption);
  }
}

export function renderSeatsDetails(traject) {
  const cardsHTML = document.getElementsByClassName("card");
  for (let card of cardsHTML) {
    let cardId = card.dataset.id;

    let placeStrr = cardId < 10 ? "0" + cardId : cardId;

    if (
      traject.reservations.some((r) => {
        return r.seat === Number(cardId);
      })
    ) {
      let reservation = traject.reservations.find((r) => {
        return r.seat === Number(cardId);
      });
      card.classList.remove("bg-white");
      card.classList.add("bg-[#fee2e2]");
      card.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
              <div
                class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
              >
                <span class="truncate max-w-[65px] font-medium">${reservation.name}</span>
              </div>`;
    } else {
      card.classList.remove("bg-[#fee2e2]");
      card.classList.add("bg-white");
      card.innerHTML = `<span class="text-xl font-bold text-emerald-600">${placeStrr}</span>
              <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>`;
    }
  }
}

function reservePlace() {
  const PassagerName = document.getElementById("newPassagerName").value;
  let slectedPlace = document.getElementById("slectedPlace").value;

  if (slectedPlace === "0") {
    slectedPlace = findFirstEmptyPlace();
  }

  let foundClient = courrantTraject.reservations.find((r) => {
    return r.name === PassagerName;
  });

  if (foundClient) {
    showReserveErorrMessage();
    return;
  }

  if (PassagerName === "") {
    return;
  }

  const cardsHTML = document.querySelectorAll(".card");

  const card = document.querySelector(`.card[data-id="${slectedPlace}"]`);
  if (!card) {
    return;
  }

  let obj = {
    seat: Number(slectedPlace),
    name: PassagerName,
    phone: "0769788093",
  };

  courrantTraject.reservations.push(obj);

  const routeIndex = trips.findIndex((trip) => trip.id === routId);
  trips[routeIndex] = courrantTraject;
  saveTrips(trips);

  renderSeatsDetails(courrantTraject);
}

function deletePlace() {
  const supprimerSelector = document.getElementById("supprimerSelector");
  const supprimerSiege = document.getElementById("supprimerSelector").value;

  const card = document.querySelector(`.card[data-id="${supprimerSiege}"]`);
  if (!card) {
    return;
  }

  // courrantTraject.splice(,)
  const reservationIndex = courrantTraject.reservations.findIndex((r) => Number(r.seat) === Number(supprimerSiege));

  courrantTraject.reservations.splice(reservationIndex, 1);

  const routeIndex = trips.findIndex((trip) => trip.id === routId);
    trips[routeIndex] = courrantTraject;
    saveTrips(trips);

    renderSeatsDetails(courrantTraject);
}



//healp

function showReserveMessage() {
  const msg = document.getElementById("reserveMessage");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}
function showReserveErorrMessage() {
  const msg = document.getElementById("reserveErorrMessage");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}

function showUpdateMessage() {
  const msg = document.getElementById("updateMessage");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}

function findFirstEmptyPlace() {
  const reservedSeats = courrantTraject.reservations.map((r) => Number(r.seat));

  for (let i = 1; i <= courrantTraject.capacity; i++) {
    if (!reservedSeats.includes(i)) {
      return String(i);
    }
  }
  return null;
}
