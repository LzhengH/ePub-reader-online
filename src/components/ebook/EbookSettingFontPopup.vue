<template>
  <transition name='popup-slide-up'>
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon">
          <span class="icon-down2" @click="hide"></span>
        </div>
        <span class="ebook-popup-title-text">
          {{$t('book.selectFont')}}
          ({{$t('book.waitFont')}})
        </span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div
          class="ebook-popup-item"
          v-for="(item, index) in fontFamilyList"
          :key="index"
          @click="setFontFamily(item, index)">
          <div
            class="ebook-popup-item-text"
            :class="{'selected': isSelected(item)}">
            {{item}}
          </div>
          <div
            class="ebook-popup-item-check"
            v-if="isSelected(item)">
            <span class="icon-check" v-show="!isLoadingFontFamily"></span>
            <loading class="font-loading" v-show="isLoadingFontFamily"></loading>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { FONT_FILE_LIST } from '../../utils/book'
import { saveFontFamily } from '../../utils/localStorage'
import Loading from '../common/Loading'
export default {
  mixins: [ebookMixin],
  components: {
    Loading
  },
  data() {
    return {
      // fontFamilyList: FONT_FAMILY
    }
  },
  computed: {
    fontFamilyList() {
      let fontNameList = ['Default'].concat(FONT_FILE_LIST.map(item => item.split('.')[0]))
      return fontNameList
    }
  },
  methods: {
    hide() {
      this.setFontFamilyVisible(false)
    },
    isSelected(item) {
      return this.defaultFontFamily === item
    },
    setFontFamily(font, index) {
      if (font === 'Default') {
        this.setIsLoadingFontFamily(false)
        this.currentBook.rendition.themes.font('Arial')
      } else {
        this.setIsLoadingFontFamily(true) // 字体加载中
        this.currentBook.rendition.themes.font(font)
        // 判断加载是否完成
        const fileName = FONT_FILE_LIST[index - 1]
        const fontCss = new window.FontFace(font, `url(${process.env.VUE_APP_RES_URL}/fonts/${fileName})`)
        document.fonts.add(fontCss)
        fontCss.load().then(info => {
          this.setIsLoadingFontFamily(false) // 加载完成
        })
      }
      saveFontFamily(this.fileName, font)
      this.setDefaultFontFamily(font)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/mixin.scss';
  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title {
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b8bb;
      text-align: center;
      @include center;
      .ebook-popup-title-icon {
        flex: 0 0 px2rem(20);
        height: 100%;
        @include center;
        font-size: px2rem(16);
        font-weight: bold;
      }
      .ebook-popup-title-text {
        flex: 1;
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check {
          flex: 1;
          @include right;
          font-size: px2rem(14);
          font-weight: bold;
          color: #346cb9;
          .font-loading {
            width: px2rem(14);
            height: px2rem(14);
          }
        }
      }
    }
  }
</style>
