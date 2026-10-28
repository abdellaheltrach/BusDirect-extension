const STORAGE_KEY = "arrPLaces";

const cardsHTML = document.getElementsByClassName("card");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const ModifierBtn = document.getElementById("Modifier-btn");
const cardsContainer = document.getElementById("cardContainer");

const placePrix = 80;
const totalPlaces = 20;
let dragedPlace = null;

const arrPLaces = [
  { id: 1, nom: "" },
  { id: 2, nom: "" },
  { id: 3, nom: "" },
  { id: 4, nom: "" },
  { id: 5, nom: "" },
  { id: 6, nom: "" },
  { id: 7, nom: "" },
  { id: 8, nom: "" },
  { id: 9, nom: "" },
  { id: 10, nom: "" },
  { id: 11, nom: "" },
  { id: 12, nom: "" },
  { id: 13, nom: "" },
  { id: 14, nom: "" },
  { id: 15, nom: "" },
  { id: 16, nom: "" },
  { id: 17, nom: "" },
  { id: 18, nom: "" },
  { id: 19, nom: "" },
  { id: 20, nom: "" },
];

loadFromLocalStorage();
addDragableToCards();

function refleshTheList() {
  const slectedPlaceDropDown = document.getElementById("slectedPlace");
  const supprimerSelector = document.getElementById("supprimerSelector");
  const modifySelector = document.getElementById("modifySelector");
  const modifyNewPlace = document.getElementById("newPlace");

  //clear the previous list
  slectedPlaceDropDown.innerHTML = `<option  value="0">-- choisir un passagger --</option>`;
  supprimerSelector.innerHTML = `<option  value="0">-- choisir un passagger --</option>`;
  modifySelector.innerHTML = `<option  value="0">-- choisir un passagger --</option>`;
  modifyNewPlace.innerHTML = `<option  value="0">-- choisir un passagger --</option>`;

  for (let i = 0; i < arrPLaces.length; i++) {
    if (arrPLaces[i].nom === "") {
      //fill dropdown menu for the reservation
      const option = document.createElement("option");
      option.textContent = `Seat ${arrPLaces[i].id}`;
      option.value = arrPLaces[i].id;
      slectedPlaceDropDown.appendChild(option);

      //fill dropdown menu for the reservation
      const optionChagnePlace = document.createElement("option");
      optionChagnePlace.textContent = `Seat ${arrPLaces[i].id}`;
      optionChagnePlace.value = arrPLaces[i].id;
      modifyNewPlace.appendChild(optionChagnePlace);
    } else {
      //fill delete dropdown
      const deleteOption = document.createElement("option");
      deleteOption.textContent = `Seat ${arrPLaces[i].id}`;
      deleteOption.value = arrPLaces[i].id;
      supprimerSelector.appendChild(deleteOption);
      //create new option for the delete
      const modifyOption = document.createElement("option");
      modifyOption.textContent = `Passager: ${arrPLaces[i].nom} [Seat ${arrPLaces[i].id}]`;
      modifyOption.value = arrPLaces[i].id;
      modifySelector.appendChild(modifyOption);
    }
  }
}

//events
addBtn.addEventListener("click", reservePlace);
deleteBtn.addEventListener("click", deletePlace);
ModifierBtn.addEventListener("click", modifdyPlace);
cardsContainer.addEventListener("click", clickCard);

function reservePlace(e) {
  //id slectedPlace
  // id newPassagerName

  const PassagerName = document.getElementById("newPassagerName").value;
  let slectedPlace = document.getElementById("slectedPlace").value;

  if (slectedPlace==="0") {
    slectedPlace=findFirstEmptyPlace();
  }

  if (isNameDuplicate(PassagerName)) {
    showReserveErorrMessage(); 
    return;
  }
    if (PassagerName === "") {
      //empty out
      return;
    }

  // console.log(PassagerName);
  // console.log(slectedPlace);

  const card = findPlaceById(slectedPlace);
  // console.log(card);

  if (card !== null) {
    // target card

    card.classList.remove("bg-white");
    card.classList.add("bg-[#fee2e2]");

    //format numbers under 10 to look like th 01..
    let placeStrr = "";
    slectedPlace = parseInt(slectedPlace);
    if (slectedPlace < 10) {
      placeStrr = "0" + slectedPlace;
    } else {
      placeStrr = slectedPlace;
    }

    card.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
                  <div
                  class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
                  >
                  <span class="truncate max-w-[65px] font-medium">${PassagerName}</span>
                  </div>
                  `;

    //add the user to the list and and reset the select dropdown
    arrPLaces[parseInt(card.dataset.id - 1)].nom = PassagerName;
    document.getElementById("newPassagerName").value = "";

    saveToLocalStorage();
    refleshTheList();

    //calculat reserved places
    let count = 0;
    for (let i = 0; i < arrPLaces.length; i++) {
      if (arrPLaces[i].nom !== "") {
        count++;
      }
    }

    updateStats(totalPlaces, count, count * placePrix);
    showReserveMessage();
  }
}

function deletePlace(e) {
  const supprimerSelector = document.getElementById("supprimerSelector");

  const cardHTML = findPlaceById(supprimerSelector.value);
  if (!cardHTML) {
    return;
  }

  cardHTML.classList.remove("bg-[#fee2e2]");
  cardHTML.classList.add("bg-white");

  //format selected place

  let formatNumber = parseInt(cardHTML.dataset.id);
  const placeStrr = formatNumber < 10 ? "0" + formatNumber : formatNumber;

  cardHTML.innerHTML = `                  <span class="text-xl font-bold text-emerald-600">${placeStrr}</span>
  <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>`;

  //add the user to the list and and reset the select dropdown
  arrPLaces[parseInt(cardHTML.dataset.id - 1)].nom = "";

  saveToLocalStorage();
  refleshTheList();
  // console.log(arrPLaces);

  //calculat reserved places
  let count = 0;
  for (let i = 0; i < arrPLaces.length; i++) {
    if (arrPLaces[i].nom !== "") {
      count++;
    }
  }

  updateStats(totalPlaces, count, count * placePrix);
  showdeleteMessage();
}

function modifdyPlace() {
  const modifyPassangerSelectorHTML = document.getElementById("modifySelector");
  const modifyNewPlaceHTML = document.getElementById("newPlace");
  const modifedNomHTML = document.getElementById("modifedNom");
  // console.log(modifyPassangerSelectorHTML);
  // console.log(modifyNewPlaceHTML);
  // console.log(modifedNomHTML);

  if (modifyNewPlaceHTML.value === "0") {
    //need to change only the name in the same card
    if (modifedNomHTML.value === "") {
      return;
    } else {
      let SelectedPLaceForModifying = modifyPassangerSelectorHTML.value;

      const reserveCardHTML = findPlaceById(SelectedPLaceForModifying);

      //format numbers under 10 to look like th 01..
      let placeStrr = "";
      SelectedPLaceForModifying = parseInt(SelectedPLaceForModifying);
      if (SelectedPLaceForModifying < 10) {
        placeStrr = "0" + SelectedPLaceForModifying;
      } else {
        placeStrr = SelectedPLaceForModifying;
      }

      reserveCardHTML.classList.remove("bg-white");
      reserveCardHTML.classList.add("bg-[#fee2e2]");
      reserveCardHTML.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
      <div
      class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
      >
      <span class="truncate max-w-[65px] font-medium">${modifedNomHTML.value}</span>
      </div>
      `;

      //modefy name in arr
      arrPLaces[parseInt(reserveCardHTML.dataset.id) - 1].nom = modifedNomHTML.value;
      modifedNomHTML.value = "";
      modifyPassangerSelectorHTML.selectedIndex = 0;
      showUpdateMessage();
      saveToLocalStorage();
      refleshTheList();
    }
  } else {
    //need to change the full place to avaible place

    if (modifedNomHTML.value === "") {
      modifedNomHTML.value = arrPLaces[parseInt(modifyPassangerSelectorHTML.value) - 1].nom;
    }

    //reserve the new place
    let SelectedNewPLaceForMoving = modifyNewPlaceHTML.value;

    const cardHTML = findPlaceById(SelectedNewPLaceForMoving);
    const freeCardHTML = findPlaceById(modifyPassangerSelectorHTML.value);

    //format numbers under 10 to look like th 01..
    let placeStrr = "";
    SelectedNewPLaceForMoving = parseInt(SelectedNewPLaceForMoving);
    if (SelectedNewPLaceForMoving < 10) {
      placeStrr = "0" + SelectedNewPLaceForMoving;
    } else {
      placeStrr = SelectedNewPLaceForMoving;
    }

    cardHTML.classList.remove("bg-white");
    cardHTML.classList.add("bg-[#fee2e2]");

    cardHTML.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
    <div
    class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
    >
    <span class="truncate max-w-[65px] font-medium">${modifedNomHTML.value}</span>
    </div>
    `;

    //reformat

    let oldPlaceToFree = modifyPassangerSelectorHTML.value;
    placeStrr = "";
    oldPlaceToFree = parseInt(oldPlaceToFree);
    if (oldPlaceToFree < 10) {
      placeStrr = "0" + oldPlaceToFree;
    } else {
      placeStrr = oldPlaceToFree;
    }

    freeCardHTML.classList.remove("bg-[#fee2e2]");
    freeCardHTML.classList.add("bg-white");

    freeCardHTML.innerHTML = `<span class="text-xl font-bold text-emerald-600">${placeStrr}</span>
    <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>`;

    arrPLaces[parseInt(cardHTML.dataset.id) - 1].nom = modifedNomHTML.value; //new place reserve it
    arrPLaces[parseInt(modifyPassangerSelectorHTML.value) - 1].nom = ""; //old place free it

    modifedNomHTML.value = "";
    modifyPassangerSelectorHTML.selectedIndex = 0;
    modifyNewPlaceHTML.selectedIndex = 0;

    saveToLocalStorage();
    refleshTheList();
    showUpdateMessage();
  }
}

function clickCard(e) {
  // console.log(e.target.closest(".card"))
  const selectedCardHTML = e.target.closest(".card");
  const selectedCardId = selectedCardHTML.dataset.id;
  // console.log(arrPLaces[selectedCardId - 1]);
  if (arrPLaces[selectedCardId - 1].nom === "") {
    //not reserved need to fill the reseve form
    fillReserveForm(selectedCardId);
  } else {
    //reserved place need to fill the modify and delete form
    fillDeleteAndUpdateForm(selectedCardId);
  }
}
//healper;

function findPlaceById(id) {
  for (let i = 0; i < cardsHTML.length; i++) {
    if (cardsHTML[i].dataset.id === id) {
      return cardsHTML[i];
    }
  }

  return null;
}

function updateStats(total, avaible, totalMoney) {
  const totalHTML = document.getElementById("total");
  const avaibleHTML = document.getElementById("Available");
  const moneyHTML = document.getElementById("recette");

  totalHTML.innerText = `${total} Total`;
  avaibleHTML.innerText = `${avaible} Available`;
  moneyHTML.innerText = `Recette: ${totalMoney} DH`;
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arrPLaces));
}

function loadFromLocalStorage() {
  const storedPlacesString = localStorage.getItem(STORAGE_KEY);

  if (storedPlacesString) {
    const storedPlacesArr = JSON.parse(storedPlacesString);

    for (let i = 0; i < arrPLaces.length; i++) {
      arrPLaces[i].nom = storedPlacesArr[i].nom;
      const card = findPlaceById(String(arrPLaces[i].id));

      if (card) {
        let placeStrr = arrPLaces[i].id < 10 ? "0" + arrPLaces[i].id : arrPLaces[i].id;

        if (arrPLaces[i].nom !== "") {
          card.classList.remove("bg-white");
          card.classList.add("bg-[#fee2e2]");
          card.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
                  <div
                    class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
                  >
                    <span class="truncate max-w-[65px] font-medium">${arrPLaces[i].nom}</span>
                  </div>`;
        } else {
          card.classList.remove("bg-[#fee2e2]");
          card.classList.add("bg-white");
          card.innerHTML = `<span class="text-xl font-bold text-emerald-600">${placeStrr}</span>
                  <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>`;
        }
      }
    }
  }

  refleshTheList();

  let count = 0;
  for (let i = 0; i < arrPLaces.length; i++) {
    if (arrPLaces[i].nom !== "") {
      count++;
    }
  }
  updateStats(totalPlaces, count, count * placePrix);
}

function fillReserveForm(selectedCardId) {
  let slectedPlace = document.getElementById("slectedPlace");
  slectedPlace.value = selectedCardId;

  //empty delete

  let deletePlaceSelector = document.getElementById("modifySelector");
  deletePlaceSelector.value = 0;

  //emptyupdate

  let modefyPlaceSelector = document.getElementById("supprimerSelector");
  modefyPlaceSelector.value = 0;
}

function fillDeleteAndUpdateForm(selectedCardId) {
  //empty reserve form
  let slectedPlace = document.getElementById("slectedPlace");
  slectedPlace.value = 0;
  //delete

  let deletePlaceSelector = document.getElementById("modifySelector");
  deletePlaceSelector.value = selectedCardId;

  //update

  let modefyPlaceSelector = document.getElementById("supprimerSelector");
  modefyPlaceSelector.value = selectedCardId;
}

function addDragableToCards() {
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

  let dropIndex = parseInt(dropPlaceHTML.dataset.id) - 1;
  let dragIndex = parseInt(dragedPlace.dataset.id) - 1;

  let dropNom = arrPLaces[dropIndex].nom;
  let dragNom = arrPLaces[dragIndex].nom;

  // back if drag and drop both free
  if (dropNom === "" && dragNom === "") {
    return;
  }

  // swap names if both reserved
  if (dropNom !== "" && dragNom !== "") {
    let temp = arrPLaces[dragIndex].nom;
    arrPLaces[dragIndex].nom = arrPLaces[dropIndex].nom;
    arrPLaces[dropIndex].nom = temp;
  }
  // move reservation to other free place
  else {
    if (dragNom !== "") {
      arrPLaces[dropIndex].nom = dragNom;
      arrPLaces[dragIndex].nom = "";
    } else {
      arrPLaces[dragIndex].nom = dropNom;
      arrPLaces[dropIndex].nom = "";
    }
  }

  // Update UI for both cards involved
  const cardsList = [dragedPlace, dropPlaceHTML];
  for (let card of cardsList) {
    let cardId = parseInt(card.dataset.id);
    let placeNom = arrPLaces[cardId - 1].nom;
    let placeStrr = cardId < 10 ? "0" + cardId : cardId;

    if (placeNom !== "") {
      card.classList.remove("bg-white");
      card.classList.add("bg-[#fee2e2]");
      card.innerHTML = `<span class="text-xl font-bold text-red-600">${placeStrr}</span>
              <div
                class="mt-1 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px] text-slate-700  border border-red-100"
              >
                <span class="truncate max-w-[65px] font-medium">${placeNom}</span>
              </div>`;
    } else {
      card.classList.remove("bg-[#fee2e2]");
      card.classList.add("bg-white");
      card.innerHTML = `<span class="text-xl font-bold text-emerald-600">${placeStrr}</span>
              <span class="text-[11px] text-slate-400 font-normal mt-0.5">Libre</span>`;
    }
  }

  // refrresh storage list and stats
  saveToLocalStorage();
  refleshTheList();

  let count = 0;
  for (let i = 0; i < arrPLaces.length; i++) {
    if (arrPLaces[i].nom !== "") {
      count++;
    }
  }
  updateStats(totalPlaces, count, count * placePrix);
}

function showReserveMessage()
{
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

function showdeleteMessage() {
  const msg = document.getElementById("deleteMessage");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
}
function isNameDuplicate(name) {
  if (!name || name.trim() === "") return false;

  const formattedName = name.trim().toLowerCase();

  for (let i = 0; i < arrPLaces.length; i++) {
    if (arrPLaces[i].nom.trim().toLowerCase() === formattedName) {
      return true;
    }
  }

  return false;
}

function findFirstEmptyPlace()
{
  for (const place of arrPLaces) {
    if (place.nom==="") {
      return String(place.id);
    }
    
  }
  
}