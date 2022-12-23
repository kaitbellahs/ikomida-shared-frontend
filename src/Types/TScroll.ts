export default class TScroll {
  top?: number
  scrollHeight?: number
  offsetHeight?: number
  constructor(top?: number, scrollHeight?: number, offsetHeight?: number) {
    this.top = top
    this.scrollHeight = scrollHeight
    this.offsetHeight = offsetHeight
  }
}
