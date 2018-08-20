
<template>
  <div class="gj-loadmore">
    <div class="gj-loadmore-content" :class="{ 'is-dropped': topDropped }"
         :style="{ 'transform': 'translate3d(0, ' + translate + 'px, 0)' }">
      <slot name="top">
        <div class="gj-loadmore-top" v-if="topMethod" ref="content">
          <div v-show="topStatus == 'pull' || topStatus == 'drop'">
            <div class="imgBox">
              <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="34px" height="34px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
              <circle cx='20.8' cy='19.5' r='13.5' stroke='#f6f6f6' stroke-width='1.4' fill='none'></circle>
              <circle cx='20.8' cy='19.5' r='13.5' stroke='#BCCAD9' stroke-width='1.4' fill='none' transform='matrix(0,-1,1,0,1,40)' :stroke-dasharray='strokeDash'></circle>
            </svg>
              <img src="../assets/images/loading.png" alt="">
            </div>
            <div class="w-loadmore-text pushDownText">{{ topText }}</div>
          </div>

          <div v-show="topStatus === 'loading'" class="loadingText">
            <div class="imgBox">
              <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="34px" height="34px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
              <circle cx='20.8' cy='19.5' r='13.5' stroke='#BCCAD9' stroke-width='1.4' fill='none'></circle>
              <path fill="#f6f6f6" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                C22.32,8.481,24.301,9.057,26.013,10.047z">
                <animateTransform attributeType="xml"
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="0.8s"
                  repeatCount="indefinite"/>
                </path>
            </svg>
              <img src="../assets/images/done.png" alt="">
            </div>

            <div class="w-loadmore-text pushDownText">{{ topText }}</div>
          </div>
        </div>
      </slot>
      <slot>
        <div class="defaultImg">
          <div></div>
        </div>
        <div class="defaultText">{{defaultText}}</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gj-loadmore',
  props: {
    defaultText: {
      type: String,
      default: '暂无数据'
    },
    maxDistance: {
      type: Number,
      default: 0
    },
    distanceIndex: {
      type: Number,
      default: 2
    },
    topPullText: {
      type: String,
      default: '下拉即可刷新'
    },
    topDropText: {
      type: String,
      default: '释放即可刷新'
    },
    topLoadingText: {
      type: String,
      default: '加载中...'
    },
    topAllLoadedText: {
      type: String,
      default: '加载完成'
    },
    topDistance: {
      type: Number,
      default: 30
    },
    topMethod: {
      type: Function
    },
    isFullPage: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      translate: 0,
      scrollEventTarget: null,
      topText: '',
      topDropped: false,
      direction: '',
      startY: 0,
      startScrollTop: 0,
      currentY: 0,
      topStatus: '',
      strokeDash: '0 100'
    }
  },
  watch: {
    topStatus (val) {
      this.$emit('top-status-change', val)
      switch (val) {
        case 'pull':
          this.topText = this.topPullText
          break
        case 'drop':
          this.topText = this.topDropText
          break
        case 'loading':
          this.topText = this.topLoadingText
          break
      }
    }
  },
  methods: {
    onTopLoaded () {
      // let time = String(new Date()).split(' ');
      // console.log(time);
      setTimeout(() => {
        this.topStatus = 'loadingDone'
        this.translate = 0
        this.strokeDash = '0 100'
      }, 800)
    },
    getScrollTop (element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 2, document.getElementsByTagName('body')[0].scrollTop)
      } else {
        return element.scrollTop
      }
    },
    bindTouchEvents () {
      this.scrollEventTarget.addEventListener('touchstart', this.handleTouchStart)
      this.scrollEventTarget.addEventListener('touchmove', this.handleTouchMove, {passive: false})
      this.scrollEventTarget.addEventListener('touchend', this.handleTouchEnd)
      this.scrollEventTarget.addEventListener('scroll', this.handleScroll)
    },
    init () {
      this.topText = this.topPullText
      this.scrollEventTarget = document.querySelector('.gj-loadmore')
      if (typeof this.topMethod === 'function') {
        this.bindTouchEvents()
      }
    },
    handleTouchStart (event) {
      this.startY = event.touches[0].clientY
      this.startScrollTop = this.getScrollTop(window)
      if (this.topStatus !== 'loading') {
        this.topStatus = 'pull'
        this.topDropped = false
      }
    },
    handleTouchMove (event) {
      let ele
      if (event.target.className !== 'calendar-box') {
        ele = event.target.parentNode
        while (ele.parentNode) {
          if (ele.parentNode.className === 'calendar-box') {
            return
          }
          ele = ele.parentNode
        }
      }
      if (this.startY < this.$el.getBoundingClientRect().top && this.startY > this.$el.getBoundingClientRect().bottom) {
        return
      }

      this.currentY = event.touches[0].clientY
      let distance = (this.currentY - this.startY) / this.distanceIndex

      let perimeter = Math.PI * 2 * 14
      let percent = event.touches[0].clientY / 380
      this.strokeDash = perimeter * percent + ' ' + perimeter * (1 - percent)
      this.direction = distance > 0 ? 'down' : 'up'
      if (typeof this.topMethod === 'function' && this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 && this.topStatus !== 'loading') {
        event.preventDefault()
        event.stopPropagation()
        if (this.maxDistance > 0) {
          this.translate = distance <= this.maxDistance ? distance - this.startScrollTop : this.translate
        } else {
          this.translate = distance - this.startScrollTop
        }
        if (this.translate < 0) {
          this.translate = 0
        }
        this.topStatus = this.translate >= this.topDistance + 55 ? 'drop' : 'pull'
        if (this.translate < this.topDistance) {
          this.topStatus = ''
        }
        this.$emit('translate-change', this.translate)
      }
    },
    handleTouchEnd () {
      if (this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.translate > 0 && this.flag) {
        this.topDropped = true
        this.strokeDash = '0 100'
        if (this.topStatus === 'drop') {
          this.translate = '70'
          this.topStatus = 'loading'
          console.log('函数执行')
          this.topMethod()
        } else {
          this.translate = '0'
          this.topStatus = 'pull'
        }
      }
      this.$emit('translate-change', this.translate)
      this.direction = ''
    },
    handleScroll (event) {
      var vm = this
      if (!vm.allowLoad) return

      this.$nextTick(function () {
        var bottomReached = vm.checkBottomReached()
        if (typeof this.bottomMethod === 'function' && this.bottomStatus !== 'loading' && !this.bottomAllLoaded && bottomReached) {
          event.preventDefault()
          event.stopPropagation()

          this.bottomStatus = 'loading'
          this.bottomMethod()
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy () {
    this.scrollEventTarget.removeEventListener('touchstart', this.handleTouchStart)
    this.scrollEventTarget.removeEventListener('touchmove', this.handleTouchMove)
    this.scrollEventTarget.removeEventListener('touchend', this.handleTouchEnd)
    this.scrollEventTarget.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
  .defaultImg{
    padding: 70px 100px 0px;
    height:90px;
    background-color: #f6f6f6;
  }
  .defaultImg div{
    width: 100%;
    height:100%;
    background-image:url('~assets/images/nodata_2x.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    background-position: center;
  }
  .defaultText{
    padding-top:5px;
    font-size:16px;
    color:#555;
    text-align: center;
     background-color: #f6f6f6;
  }
  .gj-loadmore {
    font-size: 12px;
    height:500px;
    overflow-y: auto;
  }

  .gj-loadmore-content.is-dropped {
    -webkit-transition: .2s;
    transition: .2s;
  }

  .gj-loadmore-top {
    text-align: center;
    height: 40px;
    /*height: 700px;*/
    /*line-height: 50px;*/
  }

  .gj-loadmore-top {
    margin-top: -45px;
  }





  .gj-loadmore-text {
    vertical-align: middle;
  }

  .w-loadmore-text {
    color: #999;
  }

  .loading-icon {
    height: 30px;
    width: 30px;
  }

  .loadingImg {
    display: inline-block;
    width: 35px;
  }

  .img {
    display: inline-block;
    width: 25px;
    vertical-align: middle;
  }

  .imgBox {
    display: inline-block;
    position: relative;
  }

  .imgBox svg {
    display: inline-block;
    vertical-align: middle;
  }

  /*.imgBox img {
    display: inline-block;
    width: 36px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }*/

  .imgBox img {
    display: inline-block;
    width: 21px;
    vertical-align: middle;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .pushDownText {
    display: inline-block;
    width: 100px;
    text-align: left;
    font-size: 14px;
    margin-left: 10px;
    font-family: '微软雅黑';
  }

  circle {
    transition: stroke-dasharray .25s;
  }
</style>
