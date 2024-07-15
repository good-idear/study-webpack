const { defineConfig } = require('@vue/cli-service')
const VueMultiplePageSplit = require('./VueMultiplePageSplit')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack:(config) => {
    config.plugin('VueMultiplePageSplit').use(VueMultiplePageSplit,[
      {
        // 多语言库，来自多语言平台提出转存
        langs: {
          timestamp: 1720756325778,
          config: {
            supportHMR: true
          },
          language: [
            'en',
            'id',
            'pt-BR',
            'es',
            'ar',
            'tr',
            'th',
            'zh-TW',
            'zh',
            'ru',
            'ur',
            'zh-HK'
          ],
          textList: [
            {
              key: 'balance_limit',
              hash: 'Qlhpc+IM+qG5gqXRhnEyZQ==',
              text: [
                'Insufficient balance',
                'Saldo tidak mencukupi',
                'Saldo insuficiente',
                '',
                '',
                'Bakiye yetersiz',
                '',
                '',
                '余额不足',
                '',
                '',
                ''
              ],
              tags: [
                'distribute',
                'festival'
              ]
            },
          ]
        },
        // 是否开启优化，开启后将舍弃没有用到的多语言
        // 注意：开启此选项要保证严格按照k18n规范引入-
        // -否则会由于ast上匹配不到相应规则而出现多语言加载失败
        optimization: false,
        // 向window上注入的全局变量名称, 默认__k18nLang
        variable: '__k18nLang',
        pageTagMap: {

        }
      }
    ])
  },

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      inject:'body'
    }
  }
})
