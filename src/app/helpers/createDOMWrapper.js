export default (className) => {
  const parent = document.createElement('div')
  parent.className = className

  document.body.prepend(parent)

  return parent
}
