export function comparator(a, b, _nodeA, _nodeB, isInverted) {
  const AIsGreater = 1
  const BIsGreater = -1
  const AAndBAreEqual = 0

  if (a == b) return AAndBAreEqual

  const aNumeric = getNumericPart(a)
  const bNumeric = getNumericPart(b)
  const aIsANumber = !Number.isNaN(aNumeric)
  const bIsANumber = !Number.isNaN(bNumeric)
  // if the parsed values of A & B are both not numbers then compare their string values
  if (!aIsANumber && !bIsANumber) {
    const aFormat = a?.toLowerCase()
    const bFormat = b?.toLowerCase()
    if (aFormat === '' && bFormat === '') {
      return AAndBAreEqual
    }
    if (aFormat === '') {
      return isInverted ? BIsGreater : AIsGreater
    }
    if (bFormat === '') {
      return isInverted ? AIsGreater : BIsGreater
    }
    return aFormat?.localeCompare(bFormat)
  }

  // if the parsed values are both numbers then return the number comparison
  if (aIsANumber && bIsANumber) {
    return aNumeric > bNumeric ? AIsGreater : BIsGreater
  }

  // at this point one of the inputs is not a number and the other is
  // if A isn't a number then its greater, if A is a number then B isn't and its greater
  if (!aIsANumber) {
    return isInverted ? BIsGreater : AIsGreater
  }
  if (!bIsANumber) {
    return isInverted ? AIsGreater : BIsGreater
  }
}

function getNumericPart(str) {
  if (!str) return NaN

  const parts = str.split(' ').filter((i) => {
    return i
  })
  if (parts.length === 0) return NaN

  return parseInt(parts[0], 10)
}
