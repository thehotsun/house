<template>
  <div class="tabs" :class="location ? 'location' : ''">
    <ul>
      <li v-for="(item,index) in tabs" :key="index" :class="['item', index == choseIndex ? 'selected' : '']" @click="changeIndex(index)"><span ref="item">{{item}}</span></li>
    </ul>
    <em class="bottomBar" ref="bottomBar"></em>
  </div>
</template>
<script>
  export default {
    props: {
      isMain: {
        type: Boolean,
        default () {
          return false
        }
      },
      location: {
        type: Boolean,
        default () {
          return false
        }
      },
      choseIndex: {
        type: Number,
        default: 0
      },
      tabs: {
        type: Array,
        default () {
          return ['沪深A股', '我的自选']
        }
      }
    },
    watch: {
      choseIndex (val) {
        this.slide()
      }
    },
    mounted () {
      this.slide()
    },
    methods: {
      changeIndex (index) {
        this.$emit('changeIndex', index)
      },
      cbHandle () {
        this.$refs.bottomBar.removeEventListener('webkitTransitionEnd', this.cbHandle)
      },
      slide (excute) {
        if (this.isMain) {
          this.$refs.bottomBar.style.width = this.$refs.item[this.choseIndex].offsetWidth + 'px'
          this.$refs.bottomBar.style.left = this.$refs.item[this.choseIndex].offsetLeft + 'px'
        } else {
          this.$refs.bottomBar.style.left = this.$refs.item[this.choseIndex].offsetLeft - 7 + 'px'
          this.$refs.bottomBar.style.width = this.$refs.item[this.choseIndex].offsetWidth + 16 + 'px'
        }
        if (excute) {
          this.$refs.bottomBar.addEventListener('webkitTransitionEnd', this.cbHandle)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .location{
    position:fixed !important;
    width: 100%;
    top: 0;
    left: 0;
  }
  .tabs {
    background-color: #FFF;
    display: flex;
    position: relative;
    justify-content: center;
    height: 40px;
    font-size: 14px;
    color: #555555;
    border-bottom: 1px solid rgb(234,234,234);
    z-index: 999;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
    .selected {
      color: rgb(48,159,234);
    }
    ul {
      width: 90%;
      display: flex;
      height: 38px;
      span {
        display: inline-block;
        line-height: 40px;
      }
    }
    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      &>div {
        height: 100%;
        display: inline-block;
        position: relative;
        line-height: 40px;
      }
    }
    .bottomBar {
      position: absolute;
      height: 2px;
      background: rgb(48,159,234);
      bottom: -1px;
      display: block;
      transition: all ease 0.3s;
    }
  }
</style>
