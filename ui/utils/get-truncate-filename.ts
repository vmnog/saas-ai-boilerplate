export function getTruncatedFilename(filename: string) {
  return filename.length > 15
    ? `${filename.slice(0, 5)}...${filename.slice(-10)}`
    : filename
}
