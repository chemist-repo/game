export default (styles = '') => {
  const style = document.createElement('style')
  style.innerText = (styles).replace(/\s/g, '')

  return style
}
