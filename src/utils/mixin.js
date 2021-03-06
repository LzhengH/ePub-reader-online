import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss } from './book'
import { saveLocation, getReadTime } from './localStorage'
// 获取vuex的getters
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'isLoadingFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'sectionOffset',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'offsetY',
      'isTips',
      'tipsContent',
      'currentType'
    ]),
    themeList() {
      return themeList(this) // this要是vue示例才行
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setIsLoadingFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setSectionOffset',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setOffsetY',
      'setIsTips',
      'setTipsContent',
      'setCurrentType'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()// 获取当前按照分页的页数
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi // 开始处的cfi
        // 获取当前进度（0-1）
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
      }
      // 由于每本书分页情况不同会有目录和section对不上的情况，这里进行偏移量判断
      if (this.sectionOffset == null || (currentLocation.start && this.navigation[this.section + this.sectionOffset] && this.navigation[this.section + this.sectionOffset].href !== currentLocation.start.href)) {
        for (let i = -10; i <= 10; i++) { // 一般上下浮动10以内
          if (this.navigation[this.section + i] && currentLocation.start) {
            let navHref = this.navigation[this.section + i].href
            let curHref = currentLocation.start.href
            if (navHref.includes('#')) { // 有的带#号要删除才能判断
              navHref = navHref.split('#')[0]
            }
            if (curHref.includes('#')) {
              curHref = curHref.split('#')[0]
            }
            if (navHref === curHref) {
              this.setSectionOffset(i) // 保存偏移量到vuex
              break
            }
          }
        }
      }
    },
    display(target, cb) {
      if (target) {
        return this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        return this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    getReadTimeByMinute() {
      const readTime = getReadTime(this.fileName)
      if (!readTime) {
        return 0
      } else {
        return Math.ceil(readTime / 60)
      }
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute())
    }
  }
}
