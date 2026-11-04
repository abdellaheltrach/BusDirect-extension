export function recetteTrajet(traject) {
  let totalRecette = traject.reservations.reduce((somme, r) => {
    if (Number(r.seat) <= 4) {
      return somme + Math.round(Number(traject.price) * 1.1);
    } else {
      return somme + Number(traject.price);
    }
  }, 0);

  return totalRecette;
}
