const book = {
  state: {
    fileName: '', // 电子书文件名
    menuVisible: false, // 是否显示菜单
    settingVisible: -1, // 二级菜单显示设置： -1不显示、0字号、1主题、2进度、3目录
    defaultFontSize: 16, // 阅读器字号
    defaultFontFamily: 'Default', // 字体
    isLoadingFontFamily: false, // 是否在加载字体
    fontFamilyVisible: false, // 是否显示字体选择弹窗
    defaultTheme: 'Default', // 主题
    bookAvailable: false, // 章节进度条是否可用
    progress: 0, // 章节进度条的百分比进度
    section: 0, // 当前章节
    sectionOffset: 0, // 章节对应目录下标的偏移量
    currentBook: null, // 当前的电子书book实例
    navigation: null, // 目录数组
    cover: null, // 电子书封面路径
    metadata: null, // 电子书相关信息
    isTips: -1, // 提示弹窗显示: -1不显示、0提示、1警告
    tipsContent: '', // 提示弹窗内容
    offsetY: 0, // 向下拉偏移量
  },
  mutations: {
    SET_FILENAME: (state, fileName) => {
      state.fileName = fileName
    },
    SET_MENUVISIBLE: (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    SET_SETTINGVISIBLE: (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    SET_DEFAULT_FONT_SIZE: (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    SET_DEFAULT_FONT_FAMILY: (state, font) => {
      state.defaultFontFamily = font
    },
    SET_IS_LOADING_FONT_FAMILY: (state, isLoadingFontFamily) => {
      state.isLoadingFontFamily = isLoadingFontFamily
    },
    SET_FONT_FAMILY_VISIBLE: (state, visible) => {
      state.fontFamilyVisible = visible
    },
    SET_DEFAULT_THEME: (state, theme) => {
      state.defaultTheme = theme
    },
    SET_BOOK_AVAILABLE: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    },
    SET_SECTION: (state, section) => {
      state.section = section
    },
    SET_SECTIONOFFSET: (state, sectionOffset) => {
      state.sectionOffset = sectionOffset
    },
    SET_CURRENT_BOOK: (state, currentBook) => {
      state.currentBook = currentBook
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation
    },
    SET_COVER: (state, cover) => {
      state.cover = cover
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata
    },
    SET_IS_TIPS: (state, isTips) => {
      state.isTips = isTips
    },
    SET_TIPS_CONTENT: (state, tipsContent) => {
      state.tipsContent = tipsContent
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY
    },
  },
  actions: {
    setFileName: ({ commit }, fileName) => {
      return commit('SET_FILENAME', fileName)
    },
    setMenuVisible: ({ commit }, menuVisible) => {
      return commit('SET_MENUVISIBLE', menuVisible)
    },
    setSettingVisible: ({ commit }, settingVisible) => {
      return commit('SET_SETTINGVISIBLE', settingVisible)
    },
    setDefaultFontSize: ({ commit }, defaultFontSize) => {
      return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
    },
    setFontFamilyVisible: ({ commit }, visible) => {
      return commit('SET_FONT_FAMILY_VISIBLE', visible)
    },
    setDefaultFontFamily: ({ commit }, font) => {
      return commit('SET_DEFAULT_FONT_FAMILY', font)
    },
    setIsLoadingFontFamily: ({ commit }, isLoadingFontFamily) => {
      return commit('SET_IS_LOADING_FONT_FAMILY', isLoadingFontFamily)
    },
    setDefaultTheme: ({ commit }, theme) => {
      return commit('SET_DEFAULT_THEME', theme)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
      return commit('SET_BOOK_AVAILABLE', bookAvailable)
    },
    setProgress: ({ commit }, progress) => {
      return commit('SET_PROGRESS', progress)
    },
    setSection: ({ commit }, section) => {
      return commit('SET_SECTION', section)
    },
    setSectionOffset: ({ commit }, sectionOffset) => {
      return commit('SET_SECTIONOFFSET', sectionOffset)
    },
    setCurrentBook: ({ commit }, book) => {
      return commit('SET_CURRENT_BOOK', book)
    },
    setNavigation: ({ commit }, navigation) => {
      return commit('SET_NAVIGATION', navigation)
    },
    setCover: ({ commit }, cover) => {
      return commit('SET_COVER', cover)
    },
    setMetadata: ({ commit }, metadata) => {
      return commit('SET_METADATA', metadata)
    },
    setOffsetY({ commit }, offsetY) {
      return commit('SET_OFFSETY', offsetY)
    },
    setIsTips({ commit }, isTips) {
      return commit('SET_IS_TIPS', isTips)
    },
    setTipsContent({ commit }, tipsContent) {
      return commit('SET_TIPS_CONTENT', tipsContent)
    },
    setCurrentType({ commit }, type) {
      return commit('SET_CURRENT_TYPE', type)
    }
  }
}
export default book
