import { initialize,trips } from "./store.js";
import { renderTrips, handleFilter } from "./ui.js";


initialize(); 

renderTrips(trips,1,6);


const serchCity = document.getElementById("ville");
const statusSelector = document.getElementById("filter");



serchCity.addEventListener("input", handleFilter);
statusSelector.addEventListener("change", handleFilter);
