export function simpleHash(data) {
  let hash = 0
  const str = JSON.stringify(data)

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash).toString(16)
}