<template>
  <div class="main">
    <div class="nav-box">
      <div class="module flex" @click="navTo(1)">
        <image class="module-pic" src="/static/images/p-note.png" mode="aspectFit" />
        <div class="info">
          <div class="title">免费软件</div>
          <div class="desc">一些免费软件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    navTo(id) {
      var url = ''
      switch (id) {
        case 1:
          url = '/pages/blog/main'
          break
        default:
      }
      mpvue.navigateTo({
        url: url,
      })
    },
  },
  onShow() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onShareTimeline() {},
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
}
</script>

<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  padding: 0 10px;
  .nav-box {
    margin-top: 30rpx;
    .module {
      margin: 0 40rpx 40rpx 40rpx;
      box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);
      border-radius: 16rpx;
      align-content: flex-start;
      padding: 40rpx;
      .module-pic {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }
      .info {
        font-size: 24rpx;
        color: #757575;
        margin-left: 30rpx;
        .title {
          color: #212121;
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 25rpx;
        }
      }
    }
  }
}
</style>
