const storageKey = "tripsClient";
export let trips;


export async function initialize() {
    trips = localStorage.getItem(storageKey)
    ? JSON.parse(localStorage.getItem(storageKey))
    : await fetch("data/trips.json").then(async (response) => {
        let data = await response.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      });
}
