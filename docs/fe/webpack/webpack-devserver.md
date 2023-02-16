---
title: webpackdevserver使用
date: 2020-11-14
isTimeLine: true
tags:
- webpack
categories: frontend
---

本章主要记录了webpackdevserver的使用。

<!-- more -->


# webpackdevserver使用

## 一、webpack --watch

```javascript
 "scripts": {
    "watch": "webpack --watch"
  },
```

通过配置package.json中的webpack --watch参数可以简单的监听文件变动，自动重新打包文件，但是不会自动刷新页面，也不能自动打开浏览器。

接下来我们安装下webpack-dev-server，然后修改webpack配置文件如下：

```javascript
npm install webpack-dev-server -D
...
devServer:{
        contentBase:'./bundle',
 },
```

然后我们在package.json中配一个npm script如下：

```javascript
"start": "webpack-dev-server",
```

然后我们运行 `npm run start` 来启动webpack-dev-server。然后我们打开页面，然后修改index.js中的代码，可以发现，浏览器中的页面刷新了，并且显示的修改后的代码。

更多的webpack命令参数可以查看[webpack官网](https://webpack.js.org/api/cli/#usage-without-config-file)。

接下来我们再修改一下配置如下：

```javascript
  devServer:{
        contentBase:'./bundle',
        open:true,
        port:8090,
          //配置跨域代理
        proxy:{
             '/api':{
                target:'http://localhost:3000'
             }
         }
    },
```

接下来，我们重新运行 `npm run start` 可以发现自动打开了浏览器，并且浏览器地址是 `http://localhost:8090` ，其实webpack-dev-sever底层是启动了一个http服务器，帮助我们开启了一个本地服务器，这样我们在开发过程中使用的就是http协议了。而不是直接打开index.html走的是file协议，这样我们就可以使用ajax请求了。同时，我们可以看到还有一个proxy配置，这是帮助我们配置一个代理，来帮助我们在开发阶段很方便的进行跨域请求。更多的配置项可以在[webpack官网](https://webpack.js.org/configuration/dev-server/)找到。

## 二、使用express和webpack-dev-middleware实现类似webpack-dev-server功能

在早期的时候webpack-dev-server不是特别稳定，所以一些框架的作者并没有使用webpack-dev-server。而是选择了自己搭建一个服务器。接下里我们简单模拟一下：

首先我们在package.json中再配置一个npm script如下：

```javascript
"server": "node server.js",
```

首先我们通过express快速搭建一个http服务器，由于我们需要监听webpack文件自动打包，所以需要借助一个webpack中间件，安装如下：

```javascript
npm install express webpack-dev-middleware -D
```

接下来我们在根目录下新建一个server.js，内容如下：

```javascript
const express = require('express');
const webpack = require('webpack');
//监听webpack打包代码发生的变化
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
//编译器执行一次就会重新打包一次代码
const compiler = webpack(config);

//express实例
const app = express();

//通过use使用webpack中间件
app.use(webpackDevMiddleware(compiler,{
    //打包生成的path和webpack配置文件中的一致，可以都为空
    publicPath: config.output.publicPath   //webpack.config.js中的publicPath为/
}))

//在3000端口启动一个http服务器
app.listen(3000,()=>{
    console.log('server is runing');
})

```

然后我们运行 `npm run server` 使用node运行server.js文件创建一个http服务器。然后我们修改index.js文件，通过控制台可以发现自动打包了，但是没有刷新页面，需要手动刷新。

关于更多在node中使用webpack的知识可以查看[webpack官网](https://webpack.js.org/api/node/)。

## 三、使用webpack-dev-server的HMR功能

> HMR（Hot Module Replacement）热模块替换


#### 1、css-loader中的hmr

现在我们修改配置文件如下：

```javascript
//package.json

"dev": "webpack-dev-server"
```

```javascript
//webpack.config.js
...

devServer:{
        contentBase:'./bundle',
        open:true,
        port:8090
},
 ...
{
                test:/\.css$/ ,
                use:[
                    { loader: 'style-loader'},
                    { loader: 'css-loader',options:{
                        importLoaders:1,
                        modules: true
                    }},
                    { loader: 'postcss-loader',options:{
                        plugins:[
                            require('autoprefixer')("last 100 versions")
                        ]
                    }}
                ]
},
```

通过上面配置可以看见我们添加了一个对css文件的loader配置。然后我们修改下index.js文件如下：

```javascript
import './style.css'

var btn = document.createElement('button');
btn.innerHTML="新增";
document.body.appendChild(btn);

btn.onclick = function(){
    var div = document.createElement('div');
    div.innerHTML = 'item';
    document.body.appendChild(div);
}
```

styls.css内容如下：

```css
div:nth-child(odd){
    background:pink;
}
```

接下来我们运行 `npm run dev` 启动webpack-dev-server，然后我们点击button生成item如下：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1571668309915-784e6826-8ea3-4ada-b213-a8a7b23a4271.png#align=left&display=inline&height=205&name=image.png&originHeight=205&originWidth=690&size=9149&status=done&width=690)

接着我们修改css文件，结果我们发现，页面重新渲染了。这时候虽然样式被修改了，但是我们还需要再次点击新增来增加item，这种体验不是很好。这是我们就可以使用hmr来进行模块热替换，接下来我们修改配置文件如下：：

```javascript
 ...

var webpack = require('webpack');

...

devServer:{
        contentBase:'./bundle',
        open:true,
        port:8090,
        //开启hmr功能
        hot:true,
        //hmr不生效，浏览器也不刷新
        hotOnly:true
},
 ...
 
 plugins: [
        new HtmlWebpackPlugin({
            template:'src/index.html'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:'bundle'
        }),
        //开启hmr必须配置该plugin
        new webpack.HotModuleReplacementPlugin()
  ],
    
  ...
```

可以发现的是我们开启了hot和hotOnly选项来启动hmr功能，并且配置了webpack的热模块替换插件。然后我们 重新运行 `npm run dev ` ，再次重复上面的步骤，可以看到我们修改样式立即生效了，同时item也并没有重新渲染。其实css-loader内部已经使用hmr功能进行热模块替换。

#### 2、js文件中使用hmr

接下来我们看下js如何使用hmr，现在index.js如下：

```javascript
import counter from './counter';
import number from './number';

counter();
number();

//本质上所有使用hmr的文件都需要写这种代码，这是大多数框架中已经内置了，比如上面使用到的css-loader
if(module.hot){
    module.hot.accept('./number',()=>{
        //css-loader已经内置了该写法
        document.body.removeChild(document.getElementById('number'))
        number();
    })
}
```

number.js和counter.js中如下：

```javascript
//counter.js

function counter(){
    var div = document.createElement('div');
    div.setAttribute('id','counter');
    div.innerHTML = 1;
    div.onclick = function(){
        div.innerHTML = parseInt(div.innerHTML,10)+1
    }
    document.body.appendChild(div);
}

export default counter;

//number.js

function number(){
    var div = document.createElement('div');
    div.setAttribute('id','number');
    div.innerHTML = 2000;
    document.body.appendChild(div);
}

export default number;
```

通过上面的代码我们就可以实现js的hmr功能了，可以看到的是，不是和上面写css那样，我们开启hmr功能后，修改css样式，自动就会热模块替换了，我们在index.js还需要自己手动书写需要热模块替换的部分。也就是上面的module.hot判断里的逻辑。其实啊，大多数框架中都已经帮助我们完成了热模块替换部分的代码编写，大多数情况下只有我们自己定制库或者自己编写库的时候，才会用到。联想vue和react热重载。

以上就是webpack-dev-server的简单配置，更多配置内容请参考官方文档。
