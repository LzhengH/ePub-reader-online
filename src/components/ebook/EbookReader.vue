<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import {
    getFontFamily, saveFontFamily,
    getFontSize, saveFontSize,
    getTheme, saveTheme
  } from '../../utils/localStorage'
  // 不加这个会报找不到epub的错误
  window.epub = Epub
  export default {
    mixins: [ebookMixin],
    data() {
      return {
      }
    },
    methods: {
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu() {
        if (this.menuVisible) { // 判断将要隐藏底部菜单时
          this.setSettingVisible(-1) // 同时隐藏设置菜单
          this.setFontFamilyVisible(false) // 同时隐藏字体选择菜单
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu() {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize + 'px')
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily() {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initEpub() {
        const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
        this.book = new Epub(url)
        this.setCurrentBook(this.book) // 将book实例传入vuex
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          method: 'default'
        })
        this.rendition.themes.font('Arial')
        this.rendition.display().then(() => {
          // 将localStorage里的数据初始化到vuex中
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        // epub绑定事件
        this.rendition.on('touchstart', e => {
          // 利用changedTouches判断操作
          // 触摸开始时的X坐标
          this.touchStartX = e.changedTouches[0].clientX
          // 触摸开始的时间
          this.touchStartTime = e.timeStamp
        })
        this.rendition.on('touchend', e => {
          // 移动的X轴距离
          const offsetX = e.changedTouches[0].clientX - this.touchStartX
          // 触摸的时间
          const time = e.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          e.stopPropagation()
          // e.preventDefault() // 使用阻止默认事件会使页面卡顿，先不使用
        }, { passive: false }) // 在这里处理阻止默认事件
        // 让rendition加载字体css(必须使用url的方式)
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
        })
      }
    },
    mounted() {
      this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang='scss' scoped>
  // @import '../../assets/styles/global';
</style>
