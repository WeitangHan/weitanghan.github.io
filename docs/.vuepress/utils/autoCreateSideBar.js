/**
 * 自动生成侧边栏文件
 * 技术：node文件模块的相关pai函数的使用
 * 使用：在config.js中引用该文件，然后配置项 sidebar: createSideBar()
 */
/**
 * 1. 使用node的文件模块fs，查找某一文件夹下的目录结构，找到的结果应该有两种，一个是纯名称，第二个是以 .md 结尾的文件名
 * 2. 查找到的文件目录结构可以分为三种情况:
 *     2.1 第一种：不需要操作的文件，即文件白名单，这种情况的出现是因为我习惯把要用到的图片或其他资源放到相应的文件夹下面，比如小程序这个文件夹下面有个img文件夹，专门保存小程序要用到的图片，这个时候「img」就应该剔除掉，不做处理；
 *     2.2 第二种：单文件，即文件的名称为「.md」结尾，则将该文件写入配置；
 *     2.3 第三种：文件夹，除去上面两种情况，剩下的就是文件夹，对于文件，不写入当前的目录结构配置返回第一步，查找该文件夹下目录结构，迭代操作。
 * 3. 格式化上面两步的迭代操作，作为侧边栏配置，写入config.js文件中
 * */
// const fs = require('fs') // 文件模块
import fs from "fs";
//
// import('fs').then(fs => {
//
//     }
// ).catch(error => {
//
// });
const file_catalogue = {} // 最终返回的路由

module.exports = {
    /**
     * 自动生成侧边栏
     * @param {String} path 路径，特指存放文章的根目录
     * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
     */
    createSideBar(path = '', white_path = []) {
        this.getFileCatalogue('/' + path, white_path)

        return this.reverse(file_catalogue)
    },

    /**
     * 查询某一文件夹目录下的所有文件
     * @param {string} path 文件根目录
     * @param {Array} white_path 路由白名单 表示不参与构建路由的文件名称
     */
    getFileCatalogue(path = '', white_path = []) {
        // 1. 过滤掉白名单的文件
        const catagolue_list = fs.readdirSync('./docs' + path).filter(file => !white_path.includes(file))
        if (!catagolue_list.length) {
            return
        }

        // 2.找到的文件包含.md字符，判定为单一文件
        file_catalogue[path + '/'] = [
            {
                title: path.split('/')[path.split('/').length - 1],
                children: catagolue_list.filter(v => v.includes('.md')).map(file => {
                    return file === 'README.md' || white_path.includes(file) ? '' : file.substring(0, file.length - 3)
                })
            }
        ]

        // 3.找到的文件存在不包含.md文件，即存在文件夹，继续查找
        catagolue_list
            .filter(v => !v.includes('.md'))
            .forEach(new_path => this.getFileCatalogue(path + '/' + new_path, white_path))
    },

    /**
     * 反序
     * 原因：查找侧边栏是从上到下匹配，但是生成的配置是从外到内，即更详细的目录结构其实是放在最下边，所以要反序
     */
    reverse(info) {
        let new_info = {}
        const info_keys = Object.keys(info).reverse()

        info_keys.forEach(key => {
            new_info[key] = info[key]
        })
        return new_info
    }
}