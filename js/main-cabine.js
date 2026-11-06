import { initialize, trips } from "./store.js";
import {
  renderTripDetails,
  refleshTheList,
  renderSeatsDetails,
  addDragableToCards,
} from "./ui-cabine.js";


initialize();
let routId = new URLSearchParams(location.search).get("id");

let traject = trips.find((trip) => {
  return trip.id === Number(routId);
});

if (!traject) {
  let pageContainer = document.getElementById("pageContainer");
  pageContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-[#7eb1ff] rounded-2xl border border-slate-200 shadow-sm gap-4">
      <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div class="text-center">
        <h2 class="text-xl font-bold text-[#0C1E4A]">Trajet introuvable</h2>
      </div>
      <a href="/index.html" class="mt-2 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors">
        Retour à l'accueil
      </a>
    </div>
  `;
} else {
  renderTripDetails(traject);
  refleshTheList(traject);
  renderSeatsDetails(traject);
  addDragableToCards();

}
