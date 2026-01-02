export function getNameInitials(fullName: string) {
  const names = fullName.trim().split(' ')

  if (names.length === 1) {
    const word = names[0]
    return word[0].toUpperCase() + word[word.length - 1].toUpperCase()
  }

  return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
}
