<template>
  <div class="main">
    <div class="container">
      <div class="userinfo" data-clipboard="userInfo.url" bindtap="clipboard">
        <div class="userinfo-avatar">
          <open-data type="userAvatarUrl"></open-data>
        </div>
        <text class="userinfo-nickname">
          <open-data type="userNickName"></open-data>
        </text>
        <div class="desc">{{ userInfo.desc }}</div>
      </div>
    </div>
    <!-- <i-cell @click="toDetail" title="关于" is-link>
      <i-icon type="mine" size="24" color="#80848f" slot="icon" />
    </i-cell>-->
    <i-cell @click="subscribe" :title="subscribed?'已订阅':'订阅更新'" is-link>
      <i-icon type="like" size="24" color="#80848f" slot="icon" />
    </i-cell>
    <i-toast id="toast" />
  </div>
</template>

<script>
import { $Toast } from '../../../static/iview/base/index'
export default {
  data() {
    return {
      userInfo: {
        desc: '科技互联网爱好者',
      },
      wxghUrl: '/static/images/qrcode_for_xdmj.jpg',
      subscribed: 0,
    }
  },
  methods: {
    toDetail() {
      // mpvue.navigateTo({
      //   url: '/pages/article_detail/main?title=' + encodeURI('关于我'),
      // })
    },
    subscribe() {
      let that = this
      if (that.subscribed) {
        return
      }
      let tmplIds = ['jmASVGE9Ut9doV7aY75SkqyS6Nenj3XaQ_BbvAXpqdI']
      wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        success(res) {
          if (res['BjmASVGE9Ut9doV7aY75SkqyS6Nenj3XaQ_BbvAXpqdI'] !== 'reject') {
            wx.cloud
              .callFunction({
                name: 'subscribe',
                data: {
                  templateId: tmplIds[0],
                },
              })
              .then(() => {
                that.subscribed = 1
                $Toast({
                  content: '订阅成功',
                  type: 'success',
                })
              })
              .catch(() => {
                that.subscribed = 0
                $Toast({
                  content: '订阅失败',
                  type: 'error',
                })
              })
          }
        },
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
.my-btn {
  color: inherit;
  line-height: 24px;
  font-size: inherit;
  text-align: inherit;
  background-color: transparent;
  padding-left: 0;
  &::after {
    display: none;
  }
}
.main {
  padding: 0 10px;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 60rpx 0;
    box-sizing: border-box;
    text-align: center;

    .userinfo {
      display: flex;
      flex-direction: column;
      align-items: center;
      .userinfo-avatar {
        width: 138rpx;
        height: 138rpx;
        margin: 20rpx;
        border-radius: 50%;
        overflow: hidden;
      }
      .userinfo-nickname {
        margin-top: 3px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .desc {
      color: rgba(0, 0, 0, 0.45);
    }
    .item {
      margin-top: 20rpx;
      text-align: center;
      .title-box {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        .title {
          color: #4a4a4a;
          font-size: 28rpx;
          .icon {
            margin-right: 5px;
          }
        }
      }
    }
  }

  .wx-info {
    margin-top: 10px;
    .wxgh {
      width: 168px;
      height: 168px;
    }
  }
}
</style>
