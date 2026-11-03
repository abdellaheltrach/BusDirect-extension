import { trips } from "./store.js";


export function renderTripDetails(traject) {
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
    console.log(detailsHtml)
    
}












