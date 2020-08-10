<template>
  <section class="mask">
    <div class="popup-wrapper">
      <header class="popup-header">
        <span>
          {{title[isTips]}}
        </span>
      </header>
      <article class="popup-content">
        <p>
          <span class="popup-content-text">
            {{tipsContent}}
          </span>
        </p>
      </article>
      <footer class="popup-button" @click="confirmHandle()">
        <a>{{$t('book.confirm')}}</a>
      </footer>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      title: [this.$t('detail.tips'), this.$t('detail.warning')]
    }
  },
  computed: {
    ...mapGetters([
      'isTips',
      'tipsContent'
    ])
  },
  methods: {
    ...mapActions([
      'setIsTips',
      'setTipsContent'
    ]),
    confirmHandle() {
      this.setIsTips(-1)
      this.setTipsContent('')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
.mask {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
  .popup-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 34%;
    left: 50%;
    width: px2rem(250);
    // height: px2rem(200);
    transform: translateX(-50%);
    padding-top: px2rem(15);
    box-sizing: border-box;
    background-color: #fff;
    border-radius: px2rem(10);
    .popup-header {
      @include center;
      font-size: px2rem(18);
      font-weight: bold;
      margin: 0 px2rem(16);
      padding-bottom: px2rem(8);
      border-bottom: px2rem(1) solid #999;
    }
    .popup-content {
      flex: 1;
      @include center;
      text-align: center;
      padding: px2rem(8) px2rem(20);
      .popup-content-text {
        font-size: px2rem(16);
        line-height: 1.5;
      }
    }
    .popup-button {
      flex: 0 0 px2rem(35);
      @include center;
      color: #666;
      padding-bottom: px2rem(5);
      border-bottom-left-radius: px2rem(10);
      border-bottom-right-radius: px2rem(10);
      &:active {
        color: #333;
        background-color: rgba(0, 0, 0, .1);
      }
    }
  }
}
</style>
