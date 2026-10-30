const storageKey = "tripsClient";
export let trips;

initialize();

export async function initialize() {
  let trips = localStorage.getItem(storageKey)
    ? JSON.parse(localStorage.getItem(storageKey))
    : await fetch("data/trips.json").then(async (response) => {
        let data = await response.json();
        localStorage.setItem(storageKey, JSON.stringify(data));
        return data;
      });
  console.log(trips);
  console.log("hello");
}
