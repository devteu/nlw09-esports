// 1080 -> 18:00
export function convertMinutesToHourString(minutesAmount: number) {
  const hours = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

//padStart -> caso não tenha 2 caracteres, adiciona o 0