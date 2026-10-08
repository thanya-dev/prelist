export function getBriefNumberChecks(value) {
  return [
    /^[A-Z]{3}/.test(value),
    /^[0-9]{4}$/.test(value.slice(3, 7)),
    /^(0[1-9]|1[0-2])$/.test(value.slice(7, 9)),
    /^[0-9]{3}$/.test(value.slice(9)) && value.length === 12,
  ];
}
