import { trips, saveTrips } from "./store.js";
import {
  recetteTrajet,
  validatePhoneNumber,
  isPhoneAlreadyUsed,
  findReservationIndexBySeatNumber,
} from "./reservations.js";

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
ModifierBtn.addEventListener("click", modifdyPlace);
cardsContainer.addEventListener("click", clickCard);

//draged place variable
let dragedPlace = null;

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
  moneyHTML.innerText = `Recette: ${recetteTrajet(traject)} DH`;
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
      if (i <= 4) {
        option.textContent = `Seat ${i} — VIP ${Math.round(traject.price * 1.1)} DH `;
      } else {
        option.textContent = `Seat ${i} — ${traject.price} DH `;
      }
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
    let cardId = Number(card.dataset.id);

    let placeStrr = cardId < 10 ? "0" + cardId : cardId;

    //render the first 4 places vip
    if (cardId <= 4) {
      renderVipSeat(traject, card, placeStrr);
      continue;
    }

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
  let PhoneNumber = document.getElementById("phoneNumber").value;

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
    showReserveErorrMessage("Le nom du passager est obligatoire.");

    return;
  }

  if (!validatePhoneNumber(PhoneNumber)) {
    showReserveErorrMessage("incorect phone numbre format");

    return;
  }

  if (isPhoneAlreadyUsed(PhoneNumber, courrantTraject)) {
    showReserveErorrMessage("Ce numéro est déjà utilisé sur ce trajet.");
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
    phone: PhoneNumber,
  };

  courrantTraject.reservations.push(obj);

  const routeIndex = trips.findIndex((trip) => trip.id === routId);
  trips[routeIndex] = courrantTraject;
  saveTrips(trips);
  refleshTheList(courrantTraject);
  renderSeatsDetails(courrantTraject);
  updateStats(courrantTraject);

  //empty them
  document.getElementById("phoneNumber").value = "";
  document.getElementById("slectedPlace").value = "0";
  document.getElementById("newPassagerName").value = "";
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
  updateStats(courrantTraject);
  refleshTheList(courrantTraject);
}

function modifdyPlace() {
  const modifyPassangerSelectorHTML = document.getElementById("modifySelector");
  const modifyNewPlaceHTML = document.getElementById("newPlace");
  const modifedNomHTML = document.getElementById("modifedNom");

  const selectedSeatToModify = Number(modifyPassangerSelectorHTML.value);
  const newSelectedSeat = Number(modifyNewPlaceHTML.value);
  const newName = modifedNomHTML.value.trim();

  // Find the existing reservation in the array
  const reservation = courrantTraject.reservations.find((r) => Number(r.seat) === selectedSeatToModify);

  if (!reservation) {
    return;
  }

  if (newSelectedSeat === 0) {
    // Change ONLY the name in the same seat

    if (newName === "") {
      return;
    }

    reservation.name = newName;
  } else {
    // Change the seat to new seat

    // Check if the target seat is already taken
    const isTargetSeatTaken = courrantTraject.reservations.some((r) => Number(r.seat) === newSelectedSeat);

    if (isTargetSeatTaken) {
      showReserveErorrMessage();
      return;
    }

    // If name field is empty, keep the existing passenger name
    if (newName !== "") {
      reservation.name = newName;
    }

    reservation.seat = newSelectedSeat;
  }

  const routeIndex = trips.findIndex((trip) => trip.id === routId);
  if (routeIndex !== -1) {
    trips[routeIndex] = courrantTraject;
  }

  saveTrips(trips);

  // Reset inputs and dropdowns
  modifedNomHTML.value = "";
  modifyPassangerSelectorHTML.selectedIndex = 0;
  modifyNewPlaceHTML.selectedIndex = 0;

  // Refresh UI elements
  renderSeatsDetails(courrantTraject);
  updateStats(courrantTraject);
  refleshTheList(courrantTraject);
  showUpdateMessage();
}

function clickCard(e) {
  // console.log(e.target.closest(".card"))
  const selectedCardHTML = e.target.closest(".card");
  if (!selectedCardHTML) return;

  const selectedCardId = Number(selectedCardHTML.dataset.id);

  // Check if seat is reserved
  const isReserved = courrantTraject.reservations.some((r) => Number(r.seat) === selectedCardId);

  if (!isReserved) {
    //not reserved need to fill the reseve form
    fillReserveForm(selectedCardId);
  } else {
    //reserved place need to fill the modify and delete form
    fillDeleteAndUpdateForm(selectedCardId);
  }
}

export function addDragableToCards() {
  const cardsHTML = document.querySelectorAll(".card");

  for (let i = 0; i < cardsHTML.length; i++) {
    cardsHTML[i].draggable = true;
    cardsHTML[i].addEventListener("dragstart", () => {
      dragedPlace = cardsHTML[i];
    });

    cardsHTML[i].addEventListener("dragover", (e) => e.preventDefault());
    cardsHTML[i].addEventListener("drop", handleDropInCards);
  }
}

function handleDropInCards(e) {
  e.preventDefault();

  //back if the drop place is the same drag place or null
  let dropPlaceHTML = e.target.closest(".card");
  if (!dropPlaceHTML || dropPlaceHTML === dragedPlace) return;

  let dropSeatId = Number(dropPlaceHTML.dataset.id);
  let dragSeatId = Number(dragedPlace.dataset.id);

  // Find reservations for drag and drop seats
  let dropReservation = courrantTraject.reservations.find((r) => Number(r.seat) === dropSeatId);
  let dragReservation = courrantTraject.reservations.find((r) => Number(r.seat) === dragSeatId);

  // back if drag and drop both free
  if (!dropReservation && !dragReservation) {
    return;
  }

  // swap names if both reserved
  if (dropReservation && dragReservation) {
    let tempName = dragReservation.name;
    let tempPhone = dragReservation.phone;

    dragReservation.name = dropReservation.name;
    dragReservation.phone = dropReservation.phone;

    dropReservation.name = tempName;
    dropReservation.phone = tempPhone;
  }
  // move reservation to other free place
  else {
    if (dragReservation) {
      dragReservation.seat = dropSeatId;
    } else if (dropReservation) {
      dropReservation.seat = dragSeatId;
    }
  }

  // Update trips array and save
  const routeIndex = trips.findIndex((trip) => trip.id === routId);
  if (routeIndex !== -1) {
    trips[routeIndex] = courrantTraject;
  }
  saveTrips(trips);

  // Update UI for both cards involved
  const cardsList = [dragedPlace, dropPlaceHTML];
  for (let card of cardsList) {
    let cardId = Number(card.dataset.id);
    let reservation = courrantTraject.reservations.find((r) => Number(r.seat) === cardId);
    let placeStrr = cardId < 10 ? "0" + cardId : cardId;

    if (reservation) {
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

  // refrresh storage list and stats
  refleshTheList(courrantTraject);
  updateStats(courrantTraject);
}

//healp

function showReserveMessage() {
  const msg = document.getElementById("reserveMessage");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}
function showReserveErorrMessage(message) {
  const msg = document.getElementById("reserveErorrMessage");
  if (message) {
    msg.innerHTML = ` <p>${message}</p>`;
  }

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
    if (i <= 4) {
      continue;
    }
    if (!reservedSeats.includes(i)) {
      return String(i);
    }
  }
  return null;
}

function fillReserveForm(selectedCardId) {
  let slectedPlace = document.getElementById("slectedPlace");
  slectedPlace.value = selectedCardId;

  //empty delete
  let deletePlaceSelector = document.getElementById("supprimerSelector");
  if (deletePlaceSelector) deletePlaceSelector.value = "0";

  //emptyupdate
  let modefyPlaceSelector = document.getElementById("modifySelector");
  let modefyPassangerNom = document.getElementById("modifedNom");
  let modifyPhoneNumber = document.getElementById("modifyPhoneNumber");
  if (modefyPlaceSelector) {
    modefyPlaceSelector.value = "0";
  }
  if (modefyPassangerNom ) {
    modefyPassangerNom.value = "";
  }
  if (modifyPhoneNumber ) {
    modifyPhoneNumber.value = "";
  }
}

function fillDeleteAndUpdateForm(selectedCardId) {
  //empty reserve form
  let slectedPlace = document.getElementById("slectedPlace");
  if (slectedPlace) {
    slectedPlace.value = "0";
  }

  //delete
  let deletePlaceSelector = document.getElementById("supprimerSelector");
  if (deletePlaceSelector) {
    deletePlaceSelector.value = selectedCardId;
  }

  //update
  let selectedResevationIndex = findReservationIndexBySeatNumber(selectedCardId, courrantTraject);
  let modefyPlaceSelector = document.getElementById("modifySelector");
  let modefyPassangerNom = document.getElementById("modifedNom");
  let modifyPhoneNumber = document.getElementById("modifyPhoneNumber");
  if (modefyPlaceSelector) {
    modefyPlaceSelector.value = selectedCardId;
  }
  if (modefyPassangerNom && selectedResevationIndex !== -1) {
    modefyPassangerNom.value = courrantTraject.reservations[selectedResevationIndex].name;
  }
  if (modifyPhoneNumber && selectedResevationIndex !== -1) {
    modifyPhoneNumber.value = courrantTraject.reservations[selectedResevationIndex].phone;
  }
}

function renderVipSeat(traject, card, placeStrr) {
  let cardId = Number(card.dataset.id);
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
    card.classList.add("relative");
    card.innerHTML = `<span class="relative text-xl font-bold text-red-600">${placeStrr}</span>
              <div
                class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
              >
                <span class="truncate max-w-[65px] font-medium">${reservation.name}</span>
                <span class="absolute top-1 right-1 bg-blue-500 rounded-full text-white text-xs px-2 py-1">
    VIP
  </span>
                  `;
  } else {
    card.classList.remove("bg-[#fee2e2]");
    card.classList.add("bg-white");
    card.classList.add("relative");

    card.innerHTML = `<span class="relative text-xl font-bold text-emerald-600">${placeStrr}</span>
              <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>
              <span class="absolute top-1 right-1 bg-blue-500 rounded-full text-white text-xs px-2 py-1">
    VIP
  </span>
              `;
  }
}
