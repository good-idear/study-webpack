
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PLUGIN_NAME = 'VueMultiplePageSplit'


class VueMultiplePageSplit {
  constructor(options = {}) {
    // console.log('options',options)
    this.options = options;
  }

  apply(compiler) {
    const { langs, optimization, variable = '__k18nLang' } = this.options;

    if (!langs || !langs.textList || !langs.language) {
      console.log('请配置合法的多语言包');
      return;
    }

    
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
        // console.log('PLUGIN_NAME',PLUGIN_NAME)
      // 获取入口文件
      const entry = compiler.options.entry;

      // console.log('ertry',entry)


      if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks){
        
        const hooks = HtmlWebpackPlugin.getHooks && HtmlWebpackPlugin.getHooks(compilation);

        hooks.alterAssetTags.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
          console.log('12121211212')
          const { assetTags } = htmlPluginData;
          
          assetTags.scripts.unshift({
            tagName: 'script',
            closeTag: true,
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: `console.log('#####')`,
          });
          callback(null, htmlPluginData);
        });
       
      }

    });

    
  }
}

module.exports = VueMultiplePageSplit;
