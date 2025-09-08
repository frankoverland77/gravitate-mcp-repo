export function getYesNoFromBoolean(value?: boolean) {
  if (value === false) {
    return 'No'
  }
  if (value === true) {
    return 'Yes'
  }
  return ''
}
