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

export function validatePhoneNumber(phone) {
  const regex = /^0[67]\d{8}$/;
  return regex.test(phone);
}

export function isPhoneAlreadyUsed(phoneNumber, traject) {
  const inReservations = traject.reservations.some((r) => r.phone === phoneNumber);

  const inWaitingList = traject.waitingList ? traject.waitingList.some((w) => w.phone === phoneNumber) : false;

  return inReservations || inWaitingList;
}

export function findReservationIndexBySeatNumber(SeatNumber, traject) {
  return traject.reservations.findIndex((r) => Number(r.seat) === Number(SeatNumber));
}
