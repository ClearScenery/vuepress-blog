---
title: webpack中使用plugin
date: 2020-11-13
isTimeLine: true
tags:
- webpack
categories: frontend
---

本章主要记录了webpack中的plugin的概念，以及如何配置plugin。

<!-- more -->

# webpack中使用plugin

## 一、使用plugin打包

plugin可以在webpack运行到某个时刻的时候帮我们处理一些事情，类似于生命周期钩子函数的作用。

### 1、使用HtmlWebpackPlugin


HtmlWebpackPlugin这个插件的作用是在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html文件中。

首先我们将原先创建的bundle目录删除，其次我们修改webpack.config.js如下：

```javascript
//完整的webpack.config.js配置
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:'production',
    entry:{
        main:'./src/index.js'
    },
    module: {
        rules:[
            {
                test:/\.(jpg|png|gif)$/ ,
                use:{
                    loader:'url-loader',
                    options:{
                        //placeholder
                        name:'[name]_[hash].[ext]',
                        outputPath:'images/',
                        limit: 9
                    }
                }
            },
            {
                test:/\.(eot|ttf|svg|woff|woff2)$/ ,
                use:{
                    loader:'file-loader',
                }
            },
            {
                test:/\.scss$/ ,
                use:[
                    { loader: 'style-loader'},
                    { loader: 'css-loader',options:{
                        importLoaders:2,
                        modules: true
                    }},
                    { loader: 'sass-loader'},
                    { loader: 'postcss-loader',options:{
                        plugins:[
                            require('autoprefixer')
                        ]
                    }}
                ]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()],
    output: {
        filename: 'bundle.js',
        path:path.resolve(__dirname,'bundle')
    }
}
```

可以看到我们引入了HtmlWebpackPlugin插件并配置，接下来我们安装该插件并执行npm run bundle：

```javascript
npm install --save-dev html-webpack-plugin

npm run bundle
```

可以发现成功打包并生成了一个index.html文件。其内容如下：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570296426806-b2fbcc83-3970-422c-b41e-53cd1e8b8d13.png#align=left&display=inline&height=157&name=image.png&originHeight=157&originWidth=478&size=17443&status=done&width=478)

可以发现HtmlWebpackPlugin打包了一个html文件的同时还帮我们引入了bundle.js。

但是这里有一个问题，我们的代码中首先就需要一个id为root的dom节点，这时候HtmlWebpackPlugin并没有帮我们生成，所以还需要我们自己为HtmlWebpackPlugin提供一个模板。接下来我们在src目录下新建一个index.html文件，内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

然后我们修改webpack配置如下：

```javascript
 plugins: [new HtmlWebpackPlugin({
        template:'src/index.html'
 })],
```

然后我们再次运行npm run bundle打包，然后再次打开index.html，可以发现，成功的打包之前写的代码了：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570296820996-f111b5b7-d759-4ad6-9575-b92235bf752e.png#align=left&display=inline&height=500&name=image.png&originHeight=500&originWidth=970&size=146539&status=done&width=970)
## 
### 2、使用CleanWebpackPlugin

当我们多次打包并且可能文件名字不同时，HtmlWebpackPlugin并不会把上一次打包生成的文件删除，这样就会导致的多次打包之后可能堆积的文件越来越多。所以大多数情况下我们还会使用CleanWebpackPlugin在每次打包之前将上一次打包的文件删除掉。

接下来我们修改配置如下：

```javascript
...
var HtmlWebpackPlugin = require('html-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
...
plugins: [
        new HtmlWebpackPlugin({
            template:'src/index.html'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:'bundle'
        })
 ],
...
```

首先我们引入CleanWebpackPlugin，然后在plugins配置CleanWebpackPlugin插件。
接下来我们安装该插件：

```javascript
npm install clean-webpack-plugin -D
```

然后我们运行npm run bundle，这样在打包之前就会删除上次打包的bundle目录下的所有文件了。

更多关于plugin的配置请查看官方文档。

## 二、多个入口文件的配置

有时我们需要对多个文件同时进行打包并输出成多个文件，此时我们需要进行如下配置：

```javascript
...  
entry:{
        main:'./src/index.js',
        sub:'./src/index.js'
  },
  ...
  output: {
        publicPath:'https://cdn.xxx.cn',
        filename: '[name].js',
        path:path.resolve(__dirname,'bundle')
  }
...
```

需要说的一点是有时我们需要将打包出的文件发送到cdn下，所以我们在html中引入的文件就必须是在某一cdn域名下的文件，所以配置了上面的publicPath选项。

接下来我们打包看一下：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570298389767-a464631b-f8eb-4da1-9984-1a448a5ff73c.png#align=left&display=inline&height=169&name=image.png&originHeight=176&originWidth=301&size=20542&status=done&width=289)

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570298421708-cb457444-9a4d-405e-9f4f-2e43165beeb7.png#align=left&display=inline&height=37&name=image.png&originHeight=51&originWidth=703&size=17616&status=done&width=509)

同时HtmlWebpackPlugin还帮助我们引入了两个js文件并且是带有cdn域名的。

更多的关于webpack的配置请详细阅读webpack官方文档（推荐）。
