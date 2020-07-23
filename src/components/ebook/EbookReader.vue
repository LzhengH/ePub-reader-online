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
    getTheme, saveTheme, getLocation
  } from '../../utils/localStorage'
  window.epub = Epub // 不加这个会报找不到epub的错误
  export default {
    mixins: [ebookMixin],
    data() {
      return {
      }
    },
    methods: {
      prevPage() {
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
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
      initRendition() {
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          method: 'default'
        })
        this.rendition.themes.font('Arial')
        // 获取保存的当前阅读记录并渲染
        const location = getLocation(this.fileName) || null
        this.display(location, () => {
          // 将localStorage里的数据初始化到vuex中
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        // 让rendition加载字体css(必须使用url的方式)
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {})
        })
      },
      initGesture() {
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
      },
      initEpub() {
        const url = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
        this.book = new Epub(url)
        this.setCurrentBook(this.book) // 将book实例传入vuex
        this.initRendition() // 初始化rendition
        this.initGesture() // 初始化手势
        this.book.ready.then(() => { // 将书籍分页
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then(locations => {
            // console.log(locations)
            this.setBookAvailable(true)
            this.refreshLocation() // 分页之后要重新刷新当前章节的进度
          })
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
