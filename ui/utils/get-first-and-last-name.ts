export function getFirstAndLastName(fullName: string) {
  const names = fullName.trim().split(" ");

  if (names.length === 1) {
    return names[0];
  }

  return `${names[0]} ${names[names.length - 1]}`;
}
