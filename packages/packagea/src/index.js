class VueMultiplePageSplit {
    constructor(options = {}) {
      const _options = _.cloneDeep(options);
      this.options = _options;
    }
  
    apply(compiler) {
      const { langs, optimization, variable = '__k18nLang' } = this.options;
  
      if (!langs || !langs.textList || !langs.language) {
        console.log('请配置合法的多语言包');
        return;
      }
  
      const pageLanguage = PageLanguage.getInstance(langs, optimization);
  
      const PLUGIN_NAME = this.constructor.name;
  
  
  
      compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
          // console.log('PLUGIN_NAME',PLUGIN_NAME)
        // 获取入口文件
        const entry = compiler.options.entry;
  
        // console.log('ertry',entry)
  
        compilation.hooks.seal.tap(PLUGIN_NAME, () => {
          const { target = 'vue2' } = this.options;
          const modules = [...compilation.modules];
  
          const pathToVueResourceMap = {};
  
          // 页面地址到模块间的映射
          Object.keys(entry).forEach((path) => {
            if (entry[path]) {
              // dev-server 的entry会包含webpack/hot/dev-server.js和webpack-dev-server/client/index.js，最后一个才是真正的入口文件
              const entryFiles = entry[path];
              const entryRecource = entryFiles[entryFiles.length - 1];
              pathToVueResourceMap[path] = getVueDependency(modules, entryRecource, undefined, compilation, path);
            }
          });
  
          const modulesWithText = modules.filter(
            (module) =>
              module.resource &&
              !/node_modules/.test(module.resource) &&
              (((module.resource.indexOf(`.vue?vue&type=template`) > -1 ||
                module.resource.indexOf(`.vue?vue&type=script`) > -1) &&
                module.resource !== module.userRequest) ||
                isPlainFile(module.resource)),
          );
  
          modulesWithText.forEach((m) => {
            if (m._source._value) {
              const extractedInfo =
                target === 'vue2'
                  ? extractForVue2({ code: m._source._value })
                  : extractForVue3({ code: m._source._value });
              if (extractedInfo.length > 0) {
                const path = getNameSpace(pathToVueResourceMap, m);
                if (path.length > 0) {
                  path.forEach((p) => pageLanguage.add(p, extractedInfo));
                }
              }
            }
          });
        });
  
        // console.log('11',compiler.options.plugins)
        if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks){
          const hooks = HtmlWebpackPlugin.getHooks && HtmlWebpackPlugin.getHooks(compilation);
          hooks.alterAssetTags.tapAsync(PLUGIN_NAME, (htmlPluginData, callback) => {
            console.log('12121211212')
            const { assetTags } = htmlPluginData;
            const currentPageLangs = pageLanguage.read(htmlPluginData.outputName.replace('.html', ''));
            assetTags.scripts.unshift({
              tagName: 'script',
              closeTag: true,
              attributes: {
                type: 'text/javascript',
              },
              innerHTML: `window.${variable} = ${JSON.stringify(currentPageLangs)}`,
            });
            callback(null, htmlPluginData);
          });
         
        }
  
      });
  
      
    }
  }
  
  module.exports = VueMultiplePageSplit;