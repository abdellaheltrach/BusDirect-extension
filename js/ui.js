import { trips } from "./store.js";

export function renderTrips(modifiedTrips, page, size) {
  if (modifiedTrips === undefined || modifiedTrips === null) {
    modifiedTrips = trips;
  }

  if (page === undefined || page === null) {
    page = 1;
  }

  if (size === undefined || size === null) {
    size = 6;
  }

  let tripsContainer = document.getElementById("tripsContainer");

  let startIndex = (page - 1) * size;
  let endEndex = startIndex + size;

  let selectedTrips = modifiedTrips.slice(startIndex, endEndex);

  selectedTrips.forEach((trip) => {
    let card = document.createElement("div");

    card.className = `traject bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4`;

    card.innerHTML = `
      <!-- Card Header with Route and Status Badge -->
      <div class="flex justify-between items-start">
        <div class="flex flex-col gap-1">
          <p class="flex items-center gap-2 text-lg font-bold text-[#0C1E4A] tracking-wide">
            ${trip.departure}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
              <path d="M18 8L22 12L18 16" />
              <path d="M2 12H22" />
            </svg>
            ${trip.destination}
          </p>
          <p class="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            ${trip.departureTime}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8L22 12L18 16" />
              <path d="M2 12H22" />
            </svg>
            ${trip.arrivalTime}
          </p>
        </div>
        <span class="px-3 py-1 rounded-full bg-[#009966]/10 border border-[#009966]/20 text-[#009966] text-[11px] font-bold uppercase tracking-wider">
          ${trip.capacity === trip.reservations.length ? "full" : "Available"}
        </span>
      </div>

      <hr class="border-slate-100" />

      <!-- Card Details / Stats -->
      <div class="grid grid-cols-3 gap-2 pt-1">
        <div class="flex flex-col">
          <span class="text-[11px] uppercase font-semibold text-slate-400">Price</span>
          <p class="text-xl font-extrabold text-[#0C1E4A]">
            ${trip.price} <span class="text-xs font-medium text-slate-500">DH</span>
          </p>
        </div>
        <div class="flex flex-col">
          <span class="text-[11px] uppercase font-semibold text-slate-400">Available</span>
          <p class="text-xl font-extrabold text-[#009966]">
            ${trip.reservations.length}<span class="text-xs font-normal text-slate-400">/${trip.capacity}</span>
          </p>
        </div>
        <div class="flex flex-col">
          <span class="text-[11px] uppercase font-semibold text-slate-400">Waiting List</span>
          <p class="text-xl font-extrabold text-[#FF0000]">${trip.waitingList.length}</p>
        </div>
      </div>`;

    tripsContainer.appendChild(card);
  });

}
