const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const resolve = (dir)=>path.join(__dirname, dir);
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  configureWebpack: {
    resolve: {
        alias: {
            '@': resolve('src'),
            '@com': resolve('src/components'),
            '@utils': resolve('src/utils'),
        }
    }
},
})
