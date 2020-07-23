const book = {
  state: {
    fileName: '', // 电子书路径
    menuVisible: false, // 是否显示菜单
    settingVisible: -1, // 二级菜单显示设置： -1不显示、0字号、1主题、2进度、3目录
    defaultFontSize: 16, // 阅读器字号
    defaultFontFamily: 'Default', // 字体
    fontFamilyVisible: false, // 是否显示字体选择弹窗
    defaultTheme: 'Default', // 主题
    bookAvailable: false, // 章节进度条是否可用
    progress: 0, // 章节进度条的百分比进度
    section: 0, // 当前章节
    isPaginating: true,
    currentBook: null, // 当前的电子书book实例
    navigation: null,
    cover: null, // 电子书封面路径
    metadata: null,
    paginate: '',
    pagelist: null,
    offsetY: 0,
    isBookmark: null
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
    SET_IS_PAGINATING: (state, isPaginating) => {
      state.isPaginating = isPaginating
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
    SET_PAGINATE: (state, paginate) => {
      state.paginate = paginate
    },
    SET_PAGELIST: (state, pagelist) => {
      state.pagelist = pagelist
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY
    },
    SET_IS_BOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark
    }
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
    setIsPaginating: ({ commit }, isPaginating) => {
      return commit('SET_IS_PAGINATING', isPaginating)
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
    setPaginate: ({ commit }, paginate) => {
      return commit('SET_PAGINATE', paginate)
    },
    setPagelist: ({ commit }, pagelist) => {
      return commit('SET_PAGELIST', pagelist)
    },
    setIsBookmark({ commit }, isBookmark) {
      return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setOffsetY({ commit }, offsetY) {
      return commit('SET_OFFSETY', offsetY)
    },
    setHotSearchOffsetY({ commit }, offsetY) {
      return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
    },
    setFlapCardVisible({ commit }, flapCardVisible) {
      return commit('SET_FLAP_CARD_VISIBLE', flapCardVisible)
    },
    setIsEditMode({ commit }, isEditMode) {
      return commit('SET_IS_EDIT_MODE', isEditMode)
    },
    setShelfList({ commit }, list) {
      return commit('SET_SHELF_LIST', list)
    },
    setShelfSelected({ commit }, selected) {
      return commit('SET_SHELF_SELECTED', selected)
    },
    setShelfTitleVisible({ commit }, visible) {
      return commit('SET_SHELF_TITLE_VISIBLE', visible)
    },
    setShelfCategory({ commit }, category) {
      return commit('SET_SHELF_CATEGORY', category)
    },
    setCurrentType({ commit }, type) {
      return commit('SET_CURRENT_TYPE', type)
    }
  }
}
export default book
