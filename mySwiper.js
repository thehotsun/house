let ele = null
let width = document.body.offsetWidth
const initSwiper = function (dom, _this) {
  ele = dom
  ele._i = _this.choseIndex
  ele.style.webkitTransform = `translate(-${(_this.choseIndex / 2) * 100}%,0)`
  ele.addEventListener('touchstart', e => {
    ele._i = ele._i || 0
    ele._clientX = e.changedTouches[0].clientX
    ele._clientY = e.changedTouches[0].clientY
  })
  ele.addEventListener('touchmove', e => {
    e.stopPropagation()
    // e.preventDefault()
    if (
      (ele._i === 0 && e.changedTouches[0].clientX - ele._clientX < -30) ||
      (ele._i === 1 && e.changedTouches[0].clientX - ele._clientX > 30)
    ) {
      if (
        Math.abs(e.changedTouches[0].clientX - ele._clientX) >
        Math.abs(e.changedTouches[0].clientY - ele._clientY)
      ) {
        ele.style.webkitTransform = `translate(-${ele._i * width +
          ele._clientX -
          e.changedTouches[0].clientX}px,0)`
        ele.style.overflowY = 'hidden'
      }
    }
  })
  ele.addEventListener('touchend', e => {
    ele.style.overflowY = 'auto'
    let distance = e.changedTouches[0].clientX - ele._clientX
    if (distance <= -100) {
      if (ele._i === 1) return
      ele._i = ele._i + 1
      _this.choseIndex = ele._i
      ele.style.webkitTransform = `translate(-${(ele._i / 2) * 100}%,0)`
    } else if (distance >= 100) {
      if (ele._i === 0) return
      ele._i = ele._i - 1
      _this.choseIndex = ele._i
      ele.style.webkitTransform = `translate(-${(ele._i / 2) * 100}%,0)`
    } else if (distance > -100 && distance < 100) {
      ele.style.webkitTransform = `translate(-${(ele._i / 2) * 100}%,0)`
    }
    // upData()
  })
  _this.$nextTick(() => {
    ele.style.webkitTransition = '-webkit-transform 0.3s linear'
  })
  return true
}
const slideTo = function (index) {
  console.log('slideTo')
  ele._i = index
  // upData()
  ele.style.webkitTransform = `translate(-${(index / 2) * 100}%,0)`
}

const upData = function () {
  console.log(ele._i, 777)
  ele.style.height =
    document.querySelectorAll('.listWrapper')[ele._i].offsetHeight + 'px'
}
export { initSwiper, slideTo, upData }
