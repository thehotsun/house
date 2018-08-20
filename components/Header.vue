<template lang="html">
  <div class="wrap">
    <div class="back">
    </div>
    <div class="title" @click="back">
      持仓股晨间公告
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    back () {
      window.location.href = ''
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.wrap{
  .back{
    position: absolute;
    left: 30px;
    top: 28px;
    width: 15px;
    height: 32px;
    background-image: url('~@/assets/img/back3.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
  .title{
    height: 88px;
    line-height: 88px;
    width: 100%;
    font-family:PingFangSC-Regular;
    font-size:36px;
    color:#000000;
    text-align:center;
  }
}
</style>
