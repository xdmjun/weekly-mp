<template>
  <div class="main">
    <!-- <official-account></official-account> -->
    <swiper
      class="banner"
      indicator-dots="true"
      autoplay="true"
      interval="5000"
      duration="300"
      circular="true"
    >
      <div v-for="(item,i) in bannerList" :key="i">
        <swiper-item class="s-item" @click="jump(item.name)">
          <image :src="item.src" lazy-load="true" class="slide-image" mode="aspectFill" />
        </swiper-item>
      </div>
    </swiper>

    <div class="quick-nav-box">
      <div class="nav-item" @click="jump('free-software.md')">
        <image class="nav-icon" src="/static/images/software.png" mode="aspectFit" />
        <div class="nav-name">免费软件</div>
      </div>
      <div class="nav-item" @click="jump('free-photos.md')">
        <image class="nav-icon" src="/static/images/pic-lib.png" mode="aspectFit" />
        <div class="nav-name">免费图库</div>
      </div>
      <div class="nav-item" @click="jump('free-music.md')">
        <image class="nav-icon" src="/static/images/music.png" mode="aspectFit" />
        <div class="nav-name">免费音乐</div>
      </div>
    </div>

    <div class="blogs-box">
      <div class="card">
        <div class="blog" v-for="(blog,index) in weeklies" :key="index">
          <l-card
            :type="blog.type"
            :position="blog.position"
            :l-class="blog.recommend?'rec-card':''"
            :image="blog.img!=''?blog.img:''"
            :title="blog.title"
            :plaintext="blog.img==''"
            @click="toDetail(blog.file_name)"
          >
            <view class="content">{{blog.desc}}</view>
          </l-card>
        </div>
      </div>
    </div>
    <i-load-more :tip="haveMore?'':'没了没了，别划了'" :loading="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      blogs: [],
      weeklies: [],
      page: 1,
      haveMore: true,
      loading: false,
      bannerList: [],
    }
  },
  methods: {
    jump(name) {
      if (name !== '') {
        mpvue.navigateTo({
          url: '/pages/blog/main?name=' + name,
        })
      }
    },
    toDetail(name) {
      mpvue.navigateTo({
        url: '/pages/blog/main?name=' + name,
      })
    },
    getList() {
      this.loading = true
      wx.cloud
        .callFunction({
          name: 'weeklies',
          data: { page: this.page },
        })
        .then(res => {
          this.loading = false
          let rs = JSON.parse(res.result)
          if (rs.data.length === 0) {
            this.haveMore = false
          } else {
            let position = ['left', 'right']
            let weeklies = []
            rs.data.map((blog, i) => {
              if (i % 2 !== 0) {
                blog.type = 'primary'
                blog.position = position[Math.floor(Math.random() + 0.5)]
              } else {
                blog.type = 'cover'
              }
              weeklies.push(blog)
            })
            let random = this.getRandomIndex(weeklies)
            this.bannerList = [
              {
                name: weeklies[random[0]].file_name,
                src: weeklies[random[0]].img,
              },
              {
                name: weeklies[random[1]].file_name,
                src: weeklies[random[1]].img,
              },
              {
                name: weeklies[random[2]].file_name,
                src: weeklies[random[2]].img,
              },
            ]
            this.weeklies = this.weeklies.concat(...weeklies)
          }
        })
    },
    getRandomIndex(weeklies) {
      let randowArr = [
        Math.floor(Math.random() * weeklies.length),
        Math.floor(Math.random() * weeklies.length),
        Math.floor(Math.random() * weeklies.length),
      ]
      return randowArr
    },
    toSearch() {
      mpvue.navigateTo({
        url: '/pages/search_key/main',
      })
    },
  },
  onShareAppMessage() {},
  onShareTimeline() {},
  onLoad() {
    this.getList()
  },
  onReachBottom() {
    // 下拉加载
    this.page++
    this.getList()
  },
  mounted() {
    wx.showShareMenu({ menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onShow() {},
}
</script>
<style lang="less" scoped>
page {
  background: #fff;
}
.main {
  .search-box {
    margin-bottom: 10px;
  }
  .banner {
    width: 100%;
    margin-bottom: 5px;
    .slide-image {
      width: 100%;
    }
  }
  .quick-nav-box {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 10px 40px 15px 40px;
    border-bottom: 1px solid #efefef;
    .nav-item {
      flex: 1;
      text-align: center;
      .nav-icon {
        width: 40px;
        height: 40px;
      }
      .nav-name {
        margin-top: 2px;
        text-align: center;
        color: #757575;
        font-size: 13px;
      }
      &:first-child {
        .nav-icon {
          width: 57px;
        }
      }
    }
  }

  .experts-box {
    padding: 14px 16px 5px 16px;
    background: #fff;
    .section-info {
      display: flex;
      justify-content: center;
      align-content: center;
      font-size: 14px;
      align-items: center;
      .title {
        font-size: 18px;
        color: #404040;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .experts-list {
      margin-top: 20px;
      display: flex;
      align-content: flex-start;
      .item {
        color: #fff;
        font-size: 14px;
        padding: 18px 0 16px 12px;
        flex: 1;
        .title {
          font-size: 16px;
        }
        .extra-info {
          margin-top: 4px;
        }
        &:nth-child(1) {
          background: linear-gradient(315deg, rgba(28, 206, 175, 1) 0%, rgba(0, 141, 152, 1) 100%);
          margin-right: 15px;
        }
        &:nth-child(2) {
          background: linear-gradient(48deg, rgba(255, 205, 80, 1) 0%, rgba(244, 166, 0, 1) 100%);
        }
      }
    }
  }

  .blogs-box {
    padding: 15px 5px 5px 5px;
    .card {
      .blog {
        margin-bottom: 15px;
        .content {
          word-break: break-all;
          font-size: 28rpx;
          color: #999;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>
