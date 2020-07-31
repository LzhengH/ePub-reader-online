<template>
  <div class="home" @click="hideMore()">
    <div class="home-title-wrapper">
      <div class="left">{{title}}</div>
      <div class="right">
        <div id='icon-wrapper' class="icon-wrapper">
          <div class="icon-block" @click="toggleMore()">
            <span class="icon-more"></span>
            <span class="icon-text">{{moreText}}</span>
          </div>
          <transition name='scale'>
            <div class="more-popup" v-show='selectMore'>
              <div
                class="more-popup-item"
                v-for="(item, index) in more"
                :key="index"
                @click="item.func()">
                {{item.key}}：{{item.value}}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="home-content-wrapper">
      <home-uploader>
      </home-uploader>
    </div>
  </div>
</template>

<script>
  import { saveLocale } from '../utils/localStorage'
  import HomeUploader from '../components/home/HomeUploader'
  export default {
    name: 'Home',
    components: {
      HomeUploader
    },
    data() {
      return {
        title: this.$t('home.title'),
        moreText: this.$t('detail.more'),
        selectMore: false,
        more: [
          {
            key: this.$t('detail.lang'),
            value: this.$t('detail.currentLang'),
            func: this.changeLang
          }
        ]
      }
    },
    methods: {
      toggleMore() {
        this.selectMore = !this.selectMore
      },
      hideMore(e) { // 点击别处关闭弹窗
        let iconWrapper = document.getElementById('icon-wrapper')
        if (iconWrapper) {
          if (!iconWrapper.contains(event.target)) {
            this.selectMore = false
          }
        }
      },
      changeLang() {
        console.log('切换语言')
        switch (this.$i18n.locale) {
          case 'en':
            this.$i18n.locale = 'cn'
            saveLocale('cn')
            break
          case 'cn':
            this.$i18n.locale = 'en'
            saveLocale('en')
            break
        }
        window.location.reload()
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../assets/styles/mixin.scss';
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: px2rem(16);
  background-color: #eee;
  .home-title-wrapper {
    position: relative;
    z-index: 10;
    @include center;
    height: px2rem(77);
    color: #333;
    background-color: #FCC800;
    font-size: px2rem(22);
    font-weight: bold;
    padding: px2rem(10) px2rem(10) px2rem(10) px2rem(30);
    box-sizing: border-box;
    .left {
      flex: 1;
    }
    .right {
      flex: 0 0 px2rem(24);
      .icon-wrapper {
        position: relative;
        .icon-block {
          display: flex;
          flex-direction: column;
          @include center;
          .icon-text {
            font-size: px2rem(12);
          }
        }
        .more-popup {
          position: absolute;
          z-index: 101;
          top: 100%;
          right: px2rem(30);
          background-color: #fff;
          padding: px2rem(15) px2rem(15);
          box-shadow: px2rem(2) px2rem(2) px2rem(4) rgba(#000, 0.2);
          border-radius: px2rem(8);
          transform-origin: 100% 0 0;
          @include center;
          .more-popup-item {
            white-space: nowrap;
            font-size: px2rem(16);
          }
        }
      }
    }
  }
  .home-content-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
