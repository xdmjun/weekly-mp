<template>
  <div class="main">
    <!-- <i-notice-bar icon="systemprompt" loop>内容可能与Web端科技爱好者周刊略有误差</i-notice-bar> -->
    <official-account></official-account>
    <i-load-more v-if="loading" :loading="loading" />
    <div class="content">
      <wemark :md="content" link highlight type="wemark"></wemark>
      <Wxcomment tipOne="Markdown " tipTwo="will be supported" submitBtnText="回复" :articleID="name" contentLen='1'></wxcomment>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      name: '',
      content: '',
      qrcode: '',
      showVideoTip: false,
      userInfo: {},
      maskHidden: false,
      cardCode: '',
      avatarUrl: '',
      imagePath: '',
      currentTab: 0,
      visible1: false,
      xcxCodeUrl: '',
      loading: true,
    }
  },
  methods: {
    getUser(e) {
      this.userInfo = e.mp.detail.userInfo
      this.formSubmit()
      this.visible1 = false
    },
    showSheet() {
      this.visible1 = true
    },
    handleCancel1() {
      this.visible1 = false
    },
  },
  onLoad(options) {
    if (options.scene && options.scene.indexOf('md') !== -1) {
      this.name = decodeURIComponent(options.scene)
    } else {
      this.name = this.$root.$mp.query.name
    }
    wx.cloud
      .callFunction({
        name: 'weekly',
        data: { name: this.name },
      })
      .then(res => {
        let rs = JSON.parse(res.result)
        this.title = rs.data.title
        mpvue.setNavigationBarTitle({ title: this.title })
        this.content = rs.data.content.replace(/[\\]/g, '')
        if (this.content.indexOf('iframe') !== -1) {
          this.showVideoTip = true
        }
        this.loading = false
      })
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: this.title,
      path: '/pages/blog/main?name=' + this.name,
      imageUrl: this.imagePath || '',
    }
  },
  onShareTimeline() {
    return {
      title: this.title,
      query: 'name=' + this.name,
      imageUrl: this.imagePath || '',
    }
  },
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onUnload() {
    Object.assign(this.$data, this.$options.data())
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .title {
    font-size: 16px;
    color: #4a4a4a;
    border-bottom: 1px solid #efefef;
    padding: 8px 0;
    text-align: center;
  }
  .content {
    padding: 0 15px;
  }
}

.bgImg {
  display: block;
  width: 100%;
  height: 366rpx;
}
.mine {
  display: block;
  text-align: center;
  color: #333;
  margin-top: 44rpx;
}
.code {
  display: block;
  text-align: center;
  color: #333;
  font-size: 76rpx;
  font-weight: bold;
  margin-top: 30rpx;
}
.who {
  display: block;
  margin-top: 80rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
}
.inputBox {
  text-align: center;
  margin-top: 44rpx;
}
.input {
  text-align: center;
  width: 440rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #f5f5f5;
  font-size: 32rpx;
  display: inline-block;
}
.btn {
  width: 160rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(90deg, rgba(255, 226, 0, 1), rgba(255, 200, 11, 1));
  box-shadow: 0px 4px 8px 0px rgba(255, 200, 11, 0.5);
  color: #333;
  font-size: 32rpx;
  display: inline-block;
  line-height: 88rpx;
  margin-left: 40rpx;
}
button[class='btn']::after {
  border: 0;
}
.tishi {
  display: block;
  text-align: center;
  color: #999;
  margin-top: 30rpx;
  font-size: 20rpx;
}
.shareText {
  display: block;
  text-align: center;
  color: #333;
  font-size: 28rpx;
  margin-top: 100rpx;
}
.imgBox {
  text-align: center;
  width: 100%;
  margin-top: 60rpx;
  padding-bottom: 120rpx;
}
.img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.m_l {
  margin-left: 180rpx;
}

.zfbtn,
.save {
  display: block;
  width: 218rpx;
  height: 78rpx;
  border-radius: 20rpx;
  border: solid 1px #647adb;
  padding: 0;
  margin: 0 auto;
  line-height: 78rpx;
  text-align: center;
  position: fixed;
  bottom: 50rpx;
  background-color: #ffffff;
  color: #647adb;
  font-size: 28rpx;
}
.save {
  left: 10%;
}
.zfbtn {
  right: 10%;
}
.invite-modle {
  width: 100%;
  height: 240rpx;
  background-color: #fff;
  box-shadow: 0, 0, 0 rgba(170, 170, 170, 0.38);
  padding: 48rpx 0 0 28rpx;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
}
.poster-mod {
  width: 100%;
  height: 150rpx;
  overflow: hidden;
  background: #fff;
  white-space: nowrap;
}
.poster-item {
  height: 144rpx;
  background-color: #f0f0f0;
  border-radius: 6rpx;
  border: 1.5px solid transparent;
  display: inline-block;
  overflow: hidden;
  margin: 0 50rpx 0 20rpx;
}
.poster-item.cur {
  border-color: #e94579;
}
.poster-item .img {
  width: 144rpx;
  height: 144rpx;
}
.imagePathBox {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
/* 海报上的关闭按钮 */
.closeThis {
  width: 45rpx;
  height: 45rpx;
  border-radius: 50%;
  position: absolute;
  top: 38rpx;
  right: 78rpx;
  z-index: 1005;
}
.shengcheng {
  width: 75vw;
  height: 82vh;
  position: fixed;
  top: 50rpx;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100;
}

.album {
  width: 100rpx;
  height: 100rpx;
  background-color: orange;
  border-radius: 50%;
  font-family: MicrosoftYaHei;
  font-size: 28rpx;
  line-height: 100rpx;
  text-align: center;
  position: fixed;
  bottom: 300rpx;
  left: 20rpx;
  color: #fff;
  animation: rotatesImg infinite 10s linear;
  -webkit-animation: rotatesImg infinite 10s linear; /* Safari and Chrome */
}

/* 新样式 */
.bgImgNew {
  width: 750rpx;
  height: 1043rpx;
  margin-top: 11rpx;
}
.posterBtn {
  width: 100rpx;
  height: 100rpx;
  background-color: orange;
  border-radius: 50%;
  font-family: MicrosoftYaHei;
  font-size: 28rpx;
  line-height: 100rpx;
  text-align: center;
  position: fixed;
  bottom: 300rpx;
  right: 20rpx;
  color: #fff;
  animation: rotates infinite 10s linear;
  -webkit-animation: rotates infinite 10s linear; /* Safari and Chrome */
}
@keyframes rotates {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0deg);
  }
}
@-webkit-keyframes rotates {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0deg);
  }
}
@keyframes rotatesImg {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes rotatesImg {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
</style>
