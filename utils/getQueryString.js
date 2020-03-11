export function queryString (item, name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = item.match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}
