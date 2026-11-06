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
  const regex = /^0[675]\d{8}$/;
  return regex.test(phone);
}

export function isPhoneAlreadyUsed(phoneNumber, traject) {
  const inReservations = traject.reservations.some((r) => r.phone === phoneNumber);

  const inWaitingList = traject.waitingList ? traject.waitingList.some((w) => w.phone === phoneNumber) : false;

  return inReservations || inWaitingList;
}

export function isPhoneRepeated(phoneNumber, traject) {
  const inReservations = traject.reservations.filter((r) => r.phone === phoneNumber).length;
  const countRepeatInWaitingList =traject.waitingList.filter((w) => w.phone === phoneNumber).length;

  return inReservations + countRepeatInWaitingList;
}

export function findReservationIndexBySeatNumber(SeatNumber, traject) {
  return traject.reservations.findIndex((r) => Number(r.seat) === Number(SeatNumber));
}


export function isPassengerNameAlreadyUsed(name, traject) {
  if (!name) return false;
  const targetName = name.trim().toLowerCase();

  const inReservations = traject.reservations.some((r) => r.name.trim().toLowerCase() === targetName);

  const inWaitingList = traject.waitingList.some((w) => w.name.trim().toLowerCase() === targetName);

  return inReservations || inWaitingList;
}