export function getFormatedDates(
  count,
  hrs = 13,
  mins = 0,
  gap = 7,
  freq = "daily"
) {
  const updatedDates = [];

  let baseTime = new Date();
  baseTime.setHours(hrs, mins, 0, 0);

  const today = new Date();
  baseTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());

  for (let i = 0; i < count; i++) {
    const year = baseTime.getFullYear();
    const month = String(baseTime.getMonth() + 1).padStart(2, "0");
    let day = String(baseTime.getDate() - 1).padStart(2, "0");
    const hours = String(baseTime.getHours()).padStart(2, "0");
    const minutes = String(baseTime.getMinutes()).padStart(2, "0");
    const seconds = String(baseTime.getSeconds()).padStart(2, "0");
    if (day === "00") {
      day = "01";
    }
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
    updatedDates.push({ hrs, value: formattedDate });

    baseTime.setMinutes(baseTime.getMinutes() + gap);
  }

  return updatedDates;
}
