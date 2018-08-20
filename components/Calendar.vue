<template>
  <div class="wrap" @touchstart="startEnd" @scroll.prevent @touchend="endStart">
    <div class="simpleCalendar" v-show="unfold">
      <div class="month"> <span class="Helvetica">{{month}}</span> 月</div>
      <div class="nowdate" @scroll.stop="onScrollLeft" ref="nowdate" >
        <div class="linear"></div>
        <div class="shell" ref="content1" :style="{'width': width + 'px'}">
          <div class="content" ref="child" :style="{color: value == '日' || value == '六' ||  strNowMonth > strMowadays[0] ||((strNowMonth == strMowadays[0]) && key > strMowadays[1])  ? '#999' : ''}" v-for="(value, key) in (strNowMonth == undefined ?  '' :nowMonth[strNowMonth] )" :class="{active: parseInt(today[0]) == key && (((today[0] <= nowadays[0]) && strNowMonth == strMowadays[0] )||  strNowMonth < strMowadays[0])}" @click.stop="onClick(key, value)">
            <div class="frist Helvetica">
              <span>{{ key}}</span>
            </div>
            <div class="last">
              <span>周{{value}}</span>
            </div>
          </div>
        </div>
        <div class="gradient"></div>
      </div>
      <div class="more" @click.stop="onMore">
        <div class="bottom"></div>
      </div>
    </div>
    <div class="calendar-box" @click.stop v-show="!unfold">
      <div class="header-week">
        <span v-for="item in week" :style="{ color: (item=='六' || item=='日') ? 'rgb(126,201,224)' :'rgb(153,153,153)'}">{{item}}</span>
      </div>
      <div class="cal-template" ref='calTemplate' @touchleave='touchend' @scroll.stop="scrollend">
        <div class='inner-box' ref="innerBox">
          <div class="cal-item" v-for="(item, index) in calArray">
            <transition name="fade-in">
              <div class="drop">
                <div :style="{height:'47.5px'}" class="year-month">
                  <div class="bordertop"></div>
                  <p>{{item.yearMonth}}</p>
                  <div class="triangle"></div>
                </div>
                <div class="date">
                  <div class="date-item Helvetica"  :style="{height:'47.5px', color: indexs % 7 == 5 || indexs % 7 == 6  || index > nowadays[1] || (index == nowadays[1] && items > nowadays[0])? '#999' :  ''}" v-for='(items, indexs) in item.dateArr'><span :class="{active: items == today[0] && index == today[1]}" @click.stop="choseDate(items, index, indexs)">{{items}}</span></div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="viewToday" >
        <span @click.stop="returnNowadays">查看今天</span>
        <div :style='{transform: "rotateZ(180deg)"}' class="hidden" @click.stop="returnToday"></div>
      </div>
    </div>
    <div class="fill-box" @click.stop="returnToday($event)"  v-show="!unfold">

    </div>
  </div>
</template>

<script>
  import {bus} from '@/bus'
  export default {
    name: 'calendar',
    data () {
      return {
        rollBack: false, // 判断是否为回滚触发的改变时间的事件
        flatWidth: '', // 不展开时的单个日期的宽度
        width: '', // 获取当月日历的宽度
        week: ['一', '二', '三', '四', '五', '六', '日'],
        calArray: [], // 日历展开时的当月日期存储
        today: ['', '', ''], // 用户点击的日期
        nowadays: [], // 当前日期
        present: [],
        presentTop: '',
        offsetHeight: '',
        fadeIn: false,
        history: [],
        preScroll: '',
        month: '', // 显示的月份
        nowMonth: {}, // 日历收起时的当月日期存储
        unfold: true // 当前日历是否为展开状态
      }
    },
    props: {
      yesterday: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      today (val) {
        if (this.rollBack) return
        if (this.yesterday) {
          this.$emit('getData', val, false)
        } else {
          this.$emit('getData', val, true)
        }
        this.history.push([...val])
        console.log(val, 'bbbb')
      },
      unfold (val) {
        this.$emit('unfold', val)
      },
      yesterday (val) { // 父组件传来的标志位，如果为true意味着加载当前日期的下一天的数据
        if (val) {
          this.rollBack = false
          this.today.splice(0, 1, (parseInt(this.today[0]) - 1))
          let date = new Date(this.today[2], this.today[1] - 48, this.today[0])
          console.info('date1', this.today, date.getDay())
          if (this.today[0] < 1) {
            this.today.splice(1, 1, this.today[1] - 1)
            var nowMonth = new Date(this.today[2], this.today[1], 1)
            var nextMonth = new Date(this.today[2], this.today[1] + 1, 1)
            var num = (nextMonth.getTime() - nowMonth.getTime()) / (24 * 60 * 60 * 1000)
            this.getNowMonth(this.today[0], (this.today[1] - 48))
            this.today.splice(0, 1, num)
            console.info('date2', num, this.today, date.getDay())
          }
          switch (date.getDay()) {
            case 0:
              console.info('date3', this.today, date.getDay())
              this.today.splice(0, 1, (parseInt(this.today[0]) - 2) >= 10 ? (parseInt(this.today[0]) - 2) + '' : '0' + (parseInt(this.today[0]) - 2))
              console.info('date4', this.today, date.getDay())
              break
          }
        }
      }
    },
    computed: {
      strNowMonth () {
        return Object.keys(this.nowMonth)[0]
      },
      strMowadays () {
        if ((this.nowadays[1] - 48) < 10) {
          return ['' + this.nowadays[2] + '0' + (this.nowadays[1] - 48), this.nowadays[0]]
        }
        return ['' + this.nowadays[2] + (this.nowadays[1] - 48), this.nowadays[0]]
      }
    },
    methods: {
      changeDate (date) { // 滚动时通过此方法改变日历的日期
        this.rollBack = true
        if (!date) return
        let year = date.slice(0, 4)
        let month = date.slice(4, 6)
        let day = date.slice(6, 8)
        let dates = new Date()
        let difference = (parseInt(dates.getFullYear() - year)) * 12 + parseInt(dates.getMonth() + 1) - parseInt(month)
        // console.warn(difference, this.today, dates.getMonth() + 1, month)
        this.today.splice(0, 1, day)
        this.today.splice(1, 1, parseInt(dates.getMonth() + 48) - difference)
        this.autoScrollLeft(day)
        // console.warn(difference, this.today)
        if (this.month - 1 === this.today[1] - 48) return
        this.getNowMonth(this.today[0], (this.today[1] - 48))
        // console.log('changeDate=', date, this.today, difference)
      },
      clearData () {
        this.$emit('clearData')
      },
      startEnd () {
        // 日历开始滑动loadmore取消滑动事件
        this.$emit('remove')
      },
      endStart () {
        // 日历结束滑动loadmore添加滑动事件
        this.$emit('add')
      },
      getToday () { // 此方法父组件刷新时会用到
        this.rollBack = false
        if (this.today === this.history[0]) {
          // console.info(this.today, this.history, 'tn')
          this.$emit('getData', this.today, true)
        } else {
          console.info('history', this.history)
          this.today = this.history[0]
          this.getNowMonth(this.today[0], (this.today[1] - 48))
        }
      },
      onMore () {
        this.unfold = false
        this.$emit('unfold', true)
        this.$nextTick(() => {
          this.autoScrollTop()
        })
      },
      onClick (key, value) { // 未展开日历的点击事件
        if (value !== '六' && value !== '日' && !((this.strNowMonth === this.strMowadays[0]) && key > this.strMowadays[1])) {
          this.rollBack = false
          this.history = []
          console.log(this.today, key, value, '000')
          this.today.splice(0, 1, key)
          console.log(this.today, key, value, '000')
          document.body.scrollTop = 0
          this.clearData()
        }
      },
      onScrollLeft () {
        // var scrollWidth = this.$refs.content1.scrollWidth
        // var scrollLeft = this.$refs.nowdate.scrollLeft
        // if (scrollLeft > scrollWidth) this.$refs.nowdate.scrollLeft = 0
      },
      returnToday (event) { // 返回当前日历指示的未展开的日历
        this.unfold = true
        this.getNowMonth(this.today[0], (this.today[1] - 48))
        this.autoScrollLeft(this.today[0])
      },
      returnNowadays () { // 返回今天的未展开日历
        // var str = '' + this.present[2] + ((this.present[1] - 47) < 10 ? '0' + (this.present[1] - 47) : (this.present[1] - 47)) + (this.present[0] < 10 ? '0' + this.present[0] : this.present[0])
        // this.closeMethod(str)
        this.rollBack = false
        this.unfold = true
        var thisDate = new Date()
        var date = thisDate.getDate()
        this.today = this.nowadays.slice()
        this.getNowMonth(this.today[0], (this.today[1] - 48))
        this.autoScrollLeft(date)
      },
      autoScrollLeft (date) { // 当前的日历处于视口中
        this.$nextTick(() => {
          if (this.flatWidth === '' && document.getElementsByClassName('content')[0]) this.flatWidth = document.getElementsByClassName('content')[0].offsetWidth
          if (date === 1 || date === 2 || date === 3) {
            this.$refs.nowdate.scrollLeft = 0
            // console.warn(121212)
          } else {
            var num = date - 3
            // console.warn(121213)
            this.$refs.nowdate.scrollLeft = this.flatWidth * num + 15
            // console.log('autoleft', document.getElementsByClassName('content')[0].offsetWidth, num, this.$refs.nowdate.scrollLeft)
          }
        })
      },
      autoScrollTop () {
        this.$refs.calTemplate.scrollTop = this.today[1] * 6 * (document.getElementsByClassName('date-item')[0].offsetHeight - 2)
      },
      scrollend () {
        this.fadeIn = (Math.ceil(this.$refs.calTemplate.scrollTop / this.offsetHeight))
      },
      touchend () {
        var topValue = 0
        var vm = this
        topValue = vm.$refs.calTemplate.scrollTop
        if (topValue < Math.ceil(topValue / vm.offsetHeight) * vm.offsetHeight - vm.offsetHeight / 2) {
          vm.$refs.calTemplate.scrollTop = (Math.ceil(topValue / vm.offsetHeight) - 1) * vm.offsetHeight
        } else {
          vm.$refs.calTemplate.scrollTop = Math.ceil(topValue / vm.offsetHeight) * vm.offsetHeight
        }
      },
      calculated (item) {
        return (this.offsetHeight / (item.rows + 1)) + 'px'
      },
      choseDate (items, index, indexs) { // 日历展开的点击事件
        // console.warn(items, index, indexs, this.today, '7878')
        this.rollBack = false
        if (indexs % 7 !== 6 && indexs % 7 !== 5 && this.nowadays[1] > index) {
          this.history = []
          this.today.splice(0, 1, items)
          this.today.splice(1, 1, index)
          this.today.splice(2, 1, (new Date()).getFullYear())
          this.unfold = true
          this.clearData()
          this.getNowMonth(this.today[0], (this.today[1] - 48))
        } else if (indexs % 7 !== 6 && indexs % 7 !== 5 && this.nowadays[1] === index) {
          if (this.nowadays[0] >= items) {
            this.history = []
            this.today.splice(0, 1, items)
            this.today.splice(1, 1, index)
            this.today.splice(2, 1, (new Date()).getFullYear())
            this.unfold = true
            this.getNowMonth(this.today[0], (this.today[1] - 48))
            this.clearData()
          }
        }
        // let str = this.calArray[index].yearMonth + (items < 10 ? '0' + items : items)
        // this.closeMethod(str.replace('年', '').replace('月', ''), false)
      },
      getNowMonth (d, m, y = (new Date().getFullYear())) { // 获取未展开日历的数组的函数
        // 不写参数自动调取当前日期
        if (!m && m !== 0) {
          var thisDate = new Date()
          y = thisDate.getFullYear()
          m = thisDate.getMonth()
          d = thisDate.getDate()
        }
        this.nowMonth = {}
        if (m >= 0) {
          this.month = m + 1
        } else {
          this.month = 12 - Math.abs((m + 1) % 12)
        }
        var nowMonth = new Date(y, m, 1)
        var NowDay = nowMonth.getDay()
        var nextMonth = new Date(y, (m + 1), 1)
        var num = (nextMonth.getTime() - nowMonth.getTime()) / (24 * 60 * 60 * 1000)
        if ((m + '').length === 1) m = '0' + m
        let ym = '' + y + m
        this.nowMonth[ym] = {}
        for (let i = 1; i <= num; i++) {
          switch (i % 7) {
            case 1:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay) % 7 || 7) - 1])
              break
            case 2:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 1) % 7 || 7) - 1])
              break
            case 3:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 2) % 7 || 7) - 1])
              break
            case 4:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 3) % 7 || 7) - 1])
              break
            case 5:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 4) % 7 || 7) - 1])
              break
            case 6:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 5) % 7 || 7) - 1])
              break
            case 0:
              this.$set(this.nowMonth[ym], i, this.week[((NowDay + 6) % 7 || 7) - 1])
              break
          }
        }
        this.$nextTick(() => {
          this.getWidth()
          this.autoScrollLeft(this.today[0])
        })
      },
      getWidth () {
        if (!document.getElementsByClassName('content')[0]) return
        this.width = document.getElementsByClassName('content')[0].offsetWidth * (Object.keys(this.nowMonth[Object.keys(this.nowMonth)[0]]).length) + 8
      },
      dateFomatter () { // 获取展开日历的数组的函数
        var vm = this
        vm.offsetHeight = vm.$refs.calTemplate.clientHeight   // 获取日历视口的高度
        var thisDate = new Date()
        var NowYear = thisDate.getFullYear()
        var NowDate = thisDate.getDate()
        var NowMonth = thisDate.getMonth()
        var NowDay = thisDate.getDay()
        if (NowDay === 6) {
          NowDate = NowDate - 1
        } else if (NowDay === 0) {
          NowDate = NowDate - 2
        }
        vm.today = [NowDate, NowMonth + 48, NowYear]//  ['今日XX号'，'今月在日历列表中的位置']
        vm.nowadays = [NowDate, NowMonth + 48, NowYear]
        vm.present = [NowDate, NowMonth + 48, NowYear]
        vm.$refs.calTemplate.scrollTop = (48 + parseInt(thisDate.getMonth())) * vm.offsetHeight
        vm.presentTop = (48 + parseInt(thisDate.getMonth())) * vm.offsetHeight
        for (let i = NowYear - 4; i < NowYear + 1; i++) {   //  多少年
          for (let k = 1; k < 13; k++) {     // 每年12个月
            if (i === NowYear && k > NowMonth + 1) break
            var thisMonth = new Date(i, k - 1, 1)  //  获取每个月的第一天
            var thisWeek = thisMonth.getDay()   // 获取每个月的第一天是周几
            var nextMonth     // 获取下一个月的第一天
            if (k === 12) {
              nextMonth = new Date(i + 1, 0, 1)
            } else {
              nextMonth = new Date(i, k, 1)
            }
            let num = (nextMonth.getTime() - thisMonth.getTime()) / (24 * 60 * 60 * 1000)   // 计算每个月的天数
            let start = (thisWeek === 0 ? 6 : thisWeek - 1)   // 计算每个月开始的空白格
            let dateArr = []   // 得到每个月的日期数组  ['','','',1,2,3,4,5......]
            for (let m = 0; m < num; m++) {
              dateArr.push(m + 1)
            }
            for (let h = 0; h < start; h++) {
              dateArr.unshift('')
            }
            for (let x = 0; x < (Math.ceil((start + num) / 7) * 7 - start - num); x++) {
              dateArr.push('')
            }
            vm.calArray.push({
              yearMonth: i + (k < 10 ? '年0' : '年') + k + '月',
              dayNumber: num,
              dateArr: dateArr,
              start: start,
              rows: Math.ceil((start + num) / 7)
            })
          }
          this.$nextTick(() => {
            this.$refs.calTemplate.scrollTop = 20000
          })
        }
        console.log(121212, this.calArray)
      }
    },
    mounted () {
      bus.$on('searchClick', () => { this.unfold = true })
      this.dateFomatter()
      console.log('query', this.$route.query, this.today)
      let today = this.today[2] + '' + (this.today[1] - 47) + this.today[0] >= 10 ? this.today[0] + '' : '0' + this.today[0]
      if (this.$route.query.date) {
        if (this.$route.query.date <= today) { // 穿的参数小于today的大小，将其赋值给today
          this.today.splice(0, 1, this.$route.query.date.slice(6))
          this.today.splice(2, 1, this.$route.query.date.slice(0, 4))
          this.today.splice(1, 1, parseInt(this.$route.query.date.slice(4, 6)) + (47 - (this.nowadays[2] - this.today[2]) * 12) + '')
          this.getNowMonth(this.$route.query.date.slice(6), this.$route.query.date.slice(4, 6) - 1, this.$route.query.date.slice(0, 4))
          this.autoScrollLeft(this.$route.query.date.slice(6))
        } else { // 穿的参数大于today大小， 将今天赋值today
          this.returnNowadays()
          var thisDate = new Date()
          switch (thisDate.getDay()) {
            case 0:
              this.today.splice(0, 1, (parseInt(this.today[0]) - 2) >= 10 ? (parseInt(this.today[0]) - 2) + '' : '0' + (parseInt(this.today[0]) - 2))
              break
            case 6:
              this.today.splice(0, 1, (parseInt(this.today[0]) - 1) >= 10 ? (parseInt(this.today[0]) - 1) + '' : '0' + (parseInt(this.today[0]) - 1))
              break
          }
          this.autoScrollLeft(this.today[0])
        }
      } else {
        this.returnNowadays()
      }
    }
  }
</script>
<style scoped lang="less">
  ::-webkit-scrollbar {
    display: none;
  }
  .Helvetica {
    font-family: Helvetica !important;
  }
  .fade-in-enter, .fade-in-leave-to{
    opacity: 0;
  }
  .wrap{
    width:100%;
    z-index:999;
    background-color:#fff;
    position: fixed;
    font-family: SingFangSC;
    // top: 125px;
    .simpleCalendar{
      // position: absolute;
      box-shadow: 0px 6px 6px rgba(0,0,0, 0.05);
      height:61px;
      display:flex;
      font-size:18px;
      width:100%;
      position:relative;
      .month{
        width:54px;
        height:61px;
        line-height:61px;
        font-size:15px;
        color:rgb(153,153,153);
        padding-left:15px;
      }
      .nowdate{
        overflow-y:auto;
        width:265px;
        /*display:flex;*/
        position:relative;
        padding-left: 15px;
        .linear{
          background: -webkit-linear-gradient(left, rgba(255,255,255,1), rgba(255,255,255,0));
          width:40px;
          left:50px;
          position:fixed;
          height:61px;
        }
        .gradient{
          position:fixed;
          height:61px;
          right:54px;
          background: -webkit-linear-gradient(right, rgba(255,255,255,1), rgba(255,255,255,0));
          width:35px;
        }
        .shell{
          padding-top:7px;
          padding-bottom:6px;
          /*display:flex;*/
          /*width:1600px;*/
          float:left;
          overflow-x:  auto;
          .content{
            float:left;
            width:48px;
            height:48px;
            color:#343434;
            div{
              height:30px;
              text-align:center;
              justify-content:center;
            }
            span{
            }
            .frist{
              height:22px;
              line-height:33px;
            }
            .last{
              line-height:21px;
              justify-content:top;
              span{
                font-size:10px;
                color:rgb(153,153,153)
              }
            }
          }
          .active {
            height: 48px;
            width: 48px;
            align-items: center;
            justify-content: center;
            border-radius: 24px;
            background-color: rgb(48, 159, 234);
            color: white;
            span{
              color: white !important;
            }
          }
        }
      }
      .more{
        width:60px;
        .bottom{
          width:15px;/*no*/
          height:9px;/*no*/
          float:right;
          margin-right:15px;
          margin-top:27px;
          top: 20px;
          background-image:url('~assets/images/unfold.png');
          background-repeat:no-repeat;
          background-size:100% 100%;
          background-position: center;
        }
      }
    }
  }
  .calendar-box {
    z-index: 100;
    margin-top:-90px;
    height: 370px;
    width: 100%;
    position: absolute;
    background-color: white;
    // box-shadow: 0px 10px 10px rgb(240,240,240);
    transition: all .2s linear;
    transform-origin: right top;
    top:88px;
    left: 0;
    .header-week {
      height: 30px;
      font-size: 12px;
      background-color: rgb(240,240,240);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 13.5%;
        text-align: center;
      }
    }
    .cal-template {
      height: 285px;
      width: 100%;
      margin: 0 auto;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .inner-box {
        .cal-item {
          width: 100%;
          .drop {
            display: flex;
            flex-wrap: wrap;
            transition: all 1s ease;
            .year-month {
              width: 100%;
              height:30px !important;
              display: flex;
              font-size: 12px;
              position:relative;
              background-color:rgb(243,244,250);
              color: rgb(153, 153, 153);
              align-items: center;
              justify-content: flex-start;
              p{
                width:100%;
                text-align:center;
              }
              .triangle{
                position:absolute;
                width:0px;
                height:0px;
                bottom:-9px;
                left:47.8%;
                border-left: 10px solid transparent;
                border-top: 10px solid #f3f4fa;
                border-right: 10px solid transparent;
                border-bottom: none;
              }
              .bordertop{
                position:absolute;
                height:2px;
                width:100%;
                background-color:rgb(243,244,250);
                top:-2px;
              }
            }
            .date{
              width:95%;
              margin:0 auto;
              display:flex;
              flex-wrap:wrap;
              .date-item {
                display:flex;
                width: 14.2857%;
                font-size: 18px;
                color: rgb(34, 34, 34);
                align-items: center;
                justify-content: center;
                border-bottom: 1px solid #F0F0F0;
                .active {
                  height: 30px;
                  width: 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 16px;
                  background-color: rgb(48, 159, 234);
                  color: white;
                }
              }
            }
          }
        }
      }
    }
    .viewToday {
      height:55px;
      padding-left: 2.5%;
      padding-right: 2.5%;
      font-size: 14px;
      position:relative;
      color: rgb(48, 159, 234);
      text-align: left;
      line-height: 55px;
      background-color:#fff;
      .hidden{
        // transform: rotateZ(180deg);
        position:absolute;
        right:15px;
        top: 19px;
        width:15px;/*no*/
        height:9px;/*no*/
        background-image:url('~assets/images/unfold.png');
        background-repeat:no-repeat;
        background-size:100% 100%;
        background-position: center;
      }
    }
  }
  .opacity {
    opacity: 1 !important;
  }
  .openCalendar{
    opacity: 1;
    transform: scale(1);
  }
  .closeCalendar{
    opacity: 0;
    transform: scale(0);
  }
  .fill-box{
    position: absolute;
    margin-top:200px;
    width: 100%;
    height: 500px;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.7);
  }
</style>
