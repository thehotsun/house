<template>
  <transition name="fade">
    <div class="tip" v-if="showTip">
      <div class="text">{{tip.text}}</div>
    </div>
  </transition>
</template>

<script>
  /**
   * 使用方法
   * this.$store.dispatch('setTip', {
   *  text: '',                       // 要显示的内容
   *  time: 2000,                     // 显示多长时间，可选参数，默认2s
   *  callback: null                  // 回调，可选参数，默认为空
   * })
   */
  export default {
    name: 'Tip',
    data () {
      return {
        showTip: false
      }
    },
    computed: {
      tip () {
        return this.$store.getters.getTip
      }
    },
    watch: {
      tip () {
        this.showTip = true
        setTimeout(() => {
          this.showTip = false
          if (this.tip.callback) {
            this.tip.callback()
          }
        }, this.tip.time)
      }
    }
  }
</script>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .tip {
    position: fixed;
    left: 0;
    right: 0;
    top: 45%;
    z-index: 10000;
    padding: 0 30px;
    box-sizing: border-box;
    background: none;
    text-align: center;
    .text {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
    }
  }
</style>
