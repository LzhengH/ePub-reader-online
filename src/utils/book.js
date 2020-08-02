// 常量管理
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]
export const FONT_FAMILY = [
  { font: 'Default' },
  { font: '方正黑体' },
  { font: '方正楷体' },
  { font: '方正书宋' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000'
        }
      }
    }
  ]
}

export function addCss(href) { // 以添加link标签的方式添加全局主题样式
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}
export function removeCss(href) { // 移除之前的link标签
  let links = document.getElementsByTagName('link')
  for (let i = links.length - 1; i >= 0; i--) {
    let link = links[i]
    if (link && link.href && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
