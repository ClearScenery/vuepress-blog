---
title: webpack中loader的简单配置
date: 2020-11-13
isTimeLine: true
tags:
- webpack
categories: frontend
---

本章主要记录了webpack中的loader的概念，以及如何配置loader来处理各种模块文件。

<!-- more -->

# webpack中loader的简单配置

## 一、file-loader与url-loader

### 1、file-loader

上一章我们简单使用了一个file-loader来打包jpg图片，这一章我们再来探究下loader的使用。接下来看这样一个配置：

```javascript
const path = require('path');

module.exports = {
    mode:'production',
    entry:{
        main:'./src/index.js'
    },
    module: {
        rules:[
            {
                test:/\.jpg/ ,
                use:{
                    loader:'file-loader',
                    options:{
                        //placeholder
                        name:'[name]_[hash].[ext]',
                        outputPath:'images/'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path:path.resolve(__dirname,'bundle')
    }
}
```

仔细看上面的配置可以发现，和上一章的file-loader没有太大的区别。除了file-loader配置的时候多了一个options选项，这里options中配置了打包的文件名字为**name:'[name]_[hash].[ext]'**，也就是打包的时候会使用**原文件的名字**加上生成的**hash值**并且使用**原文件的扩展名**。同时，我们配置了一个outputPath，意思是将打包的jpg图片放到images目录下。

接下来我们运行npm run bundle看下打印输出：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570172120361-00144688-f38a-4cdf-b5ad-b8534062c097.png#align=left&display=inline&height=376&name=image.png&originHeight=376&originWidth=785&size=79567&status=done&width=785)

可以发现，我们正常的打包了。同时，可以发现在项目bundle目录下会生成一个images目录，其中存放打包出的jpg文件：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570172207807-bfd0ee59-5575-4c74-8af1-a3e590030e1d.png#align=left&display=inline&height=413&name=image.png&originHeight=413&originWidth=337&size=27659&status=done&width=337)

同时，我们打开index.html文件，可以发现能够正常渲染。并且img标签的src指向的也是打包输出的jpg文件。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570172293673-874d399f-5068-427b-9b6c-08f0494a53fa.png#align=left&display=inline&height=439&name=image.png&originHeight=439&originWidth=662&size=112576&status=done&width=662)
通过上面使用file-loader我们可以发现，file-loader将jpg文件打包到images目录下，同时img中也是通过路径的方式引入打包的图片。

假如我们想要对多种类型的图片或者文件打包，可以配置test正则匹配，如下：

```javascript
 test:/\.(jpg|png|gif)/ 
```

### 2、url-loader

与file-loader类似的还有一个url-loader，它与file-loader的区别是默认情况下url-loader会将jpg等文件以base64位编码的方式将图片打包进js文件中。

接下来我们测试下：

```javascript
const path = require('path');

module.exports = {
    mode:'production',
    entry:{
        main:'./src/index.js'
    },
    module: {
        rules:[
            {
                test:/\.(jpg|png|gif)/ ,
                use:{
                    loader:'url-loader',   //简单的将file-loader替换成url-loader
                    options:{
                        //placeholder
                        name:'[name]_[hash].[ext]',
                        outputPath:'images/'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path:path.resolve(__dirname,'bundle')
    }
}
```

进行如上配置之后，我们需要先安装url-loader，执行以下命令安装:

```javascript
npm install url-loader -D
```

首先我们将bundle目录下的images目录删除，然后我们运行npm run bundle再次打包：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570173245682-7ee8022b-5de6-403a-a82d-574639568df8.png#align=left&display=inline&height=322&name=image.png&originHeight=340&originWidth=523&size=62486&status=done&width=496)    ![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570173263435-8d05605f-0613-4038-9484-098c06db8af3.png#align=left&display=inline&height=323&name=image.png&originHeight=314&originWidth=183&size=17965&status=done&width=188)

可以发现，我们依然成功打包，但是并没有在bundle目录下产生images目录。我们再次打开index.html，发现依然可以成功渲染：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570173395824-1099ffb7-0c64-49d7-92a3-fb632ab7ca2f.png#align=left&display=inline&height=432&name=image.png&originHeight=432&originWidth=864&size=121776&status=done&width=864)

但是我们可以看见，这时候img标签就不是引入一个路径了，而是直接使用了js base64编码。到这里我们已经可以看出区别了。

file-loader默认会将图片等文件以指定配置的形式打包输出到指定目录下，而url-loader默认情况下会打包成base64位编码的形式。

但是呢，url-loader还提供了一个options选项limit，通过limit选项我们可以控制当打包的文件大小超过limit配置的值，将不会打包成base64位，而是和file-loader一样打包成响应的文件。所以我们可以进行如下配置：

```javascript
...
{
  test:/\.(jpg|png|gif)/ ,
  use:{
    loader:'url-loader',
    options:{
      //placeholder
      name:'[name]_[hash].[ext]',
      outputPath:'images/',
      limit: 9
    }
  }
}
...
```

通过之前的打包输出可以看见logo.jpg的大小为9.13k，所以这里我们简单配置成9k，然后运行npm run bundle重新打包：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570174797709-4d53d57e-be2a-46f6-8568-23740056d11f.png#align=left&display=inline&height=351&name=image.png&originHeight=351&originWidth=327&size=25154&status=done&width=327)

这里我们依然打包成功了，同时也生成了images目录和打包出的文件，我们再来看下index.html：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570174900402-96b3df41-fd9a-418a-b648-cf25f60fdacc.png#align=left&display=inline&height=417&name=image.png&originHeight=417&originWidth=663&size=112134&status=done&width=663)

可以发现，正常渲染，而且img 图片又变成引入url的方式了。通过url-loader我们可以对一些小图片进行base64位打包，这样打包到js中，可以减少一次http请求。当然这只试用小图片的情况下，大图片打包进js中也会减慢js的加载，所以其中利弊自己衡量。

这里我们只是简单的对jpg等图片进行打包，接下来我们看看如何对css进行打包。

## 二、打包css

### 1、打包普通css

通过上面的学习我们知道webpack默认情况下只可以对js文件进行打包，如果需要对其他类型的文件打包时，我们就需要使用对应的loader。这里假如我们需要对css文件进行打包，我们需要使用两个loader：

- css-loader：分析css文件之间的关系，然后合并css文件
- style-loader：将生成的css挂载到style标签上

接下来我们修改webpack配置文件如下：

```javascript
const path = require('path');

module.exports = {
    mode:'production',
    entry:{
        main:'./src/index.js'
    },
    module: {
        rules:[
            {
                test:/\.(jpg|png|gif)/ ,
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
                test:/\.css/ ,
                use:['style-loader','css-loader']
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path:path.resolve(__dirname,'bundle')
    }
}
```

同时，我们在src目录下新建一个index.css文件并修改index.js。其代码如下：

```css
//index.css

.avater{
    width:100px;
    height:100px;
}

```

```javascript

//index.js

import Header from './header.js';
import Sidebar from './sidebar.js';
import Content from './content.js';
import avater from './logo.jpg';
import './index.css';

var img = new Image();
img.src=avater;
img.classList.add('avater');

var root = document.getElementById('root');
root.append(img)

console.log(avater)

new Header();
new Sidebar();
new Content();

```

上面我们配置了css-loader和style-loader来打包css文件，同时，我们给logo图片设置了宽高为100px的样式，接下来我们运行npm run bundle打包：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570177230072-3392cf85-f20d-4c9a-bc2f-09c69ff28ca8.png#align=left&display=inline&height=410&name=image.png&originHeight=410&originWidth=778&size=93277&status=done&width=778)

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570177259734-863b4561-178b-4cd7-84ea-c3b13298e2ca.png#align=left&display=inline&height=427&name=image.png&originHeight=427&originWidth=770&size=80246&status=done&width=770)

同时，我们发现img标签成功设置了一个avater样式，并且在head部分多出一个style标签和.avater内联样式。

### 2、打包预处理器样式
上面我们通过css-loader和style-loader已经可以对css文件进行打包了，但有的时候我们不会直接去写原生的css，而是喜欢用一些预处理器来写样式，比如less，sass/scss等。

这里我们使用sass/scss对项目的样式进行改写，如下：

```css
//index.scss
body{ 
    .avater{
        width:100px;
        height:100px;
        border:2px solid red; 
    }
}
```

```javascript
//index.js
...
import './index.scss';
...

//webpack.config.js
...
{
  test:/\.scss/ ,
  use:['style-loader','css-loader','sass-loader']
}
...
```

然后我们修改配置文件并安装sass-loader：

```javascript
npm install sass-loader node-sass --save-dev
```

接着，运行npm run bundle打包。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570192881692-940405a8-9601-4778-8f27-cefe47fc9289.png#align=left&display=inline&height=428&name=image.png&originHeight=428&originWidth=959&size=97770&status=done&width=959)

通过日志输出可以看到正确打包了，这时候我们再运行打开index.html看一下：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570193089113-2fbf77c2-e8bc-47c2-903a-6d481cc94c2c.png#align=left&display=inline&height=408&name=image.png&originHeight=408&originWidth=892&size=84602&status=done&width=892)
样式生效了，说明sass-loader配置成功了。更多关于sass-laoder的信息可以点击[sass-loader](https://webpack.js.org/loaders/sass-loader/)。
### 
### 3、使用postcss

上面使用sass-loader来将我们写的sass语法打包编译成css，如果使用其他预处理器，引入相应的loader即可。接下来我们在webpack中使用postcss-loader。

首先来介绍下postcss，postcss可以让我们使用现代浏览器尚不支持的css特性。以及拥有css模块化，css自动修复，css网格，自动生成兼容前缀的css代码等功能。这里我们简单的只使用其中一个功能插件：autoprefixer ，这个插件能够帮我们在写需要兼容的css时，自动帮我生成带浏览器前缀的样式。

接下来我们配置postcss-loader并使用autoprefixer插件：

在webpack.config.js文件配置添加postcss-loader，并新建一个postcss.config.js文件

```javascript
{
    test:/\.scss/ ,
    use:['style-loader','css-loader','sass-loader','postcss-loader']
}
```

```javascript
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
 }
```

然后我们安装postcss-loader和autoprefixer：

```javascript
npm i -D postcss-loader autoprefixer
```

接着我们修改配置如下：

```javascript
{
  test:/\.scss$/ ,
    use:[
      { loader: 'style-loader'},
      { loader: 'css-loader'},
      { loader: 'sass-loader'},
      { loader: 'postcss-loader' }
    ]
}
```

同时，我们新增postcss.config.js配置文件，并添加配置如下：

```javascript
module.exports = {
    plugins: [
        require('autoprefixer')({
            "overrideBrowserslist": [
                "last 100 versions"
            ]
        })
    ]
};
```

上面配置的意思是引入autoprefixer插件，并设置需要兼容的浏览器版本列表。然后我修改一下index.scss样式：


```css
body{
    .avater{
        width:100px;
        height:100px;
        border-radius:50%;
        transform:translate(10px,10px);
    }
}
```


然后我们打包运行成功，打开index.html，通过Chrome Devtools可以看到autoprefixer自动帮助我们生成了兼容的浏览器前缀样式：


![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570284084186-6870d590-4462-4118-bb20-f373f8e10df6.png#align=left&display=inline&height=292&name=image.png&originHeight=292&originWidth=877&size=91994&status=done&width=877)

上面的postcss插件autoprefixer配置可以有多种配置方式，例如下面这几种：

#### 1、方式一

```javascript
//postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')({
            "browsers": [
                "last 100 versions"
            ]
        })
    ]
};
```

#### 2、方式二

```javascript
//webpack.config.js，不需要再新建postcss.config.js
{
   test:/\.scss$/ ,
     use:[
       { loader: 'style-loader'},
       { loader: 'css-loader'},
       { loader: 'sass-loader'},
       { loader: 'postcss-loader',options:{
         plugins:[
           require('autoprefixer')('last 100 versions')
         ]
       }}
     ]
 }
```

#### 3、方式三

```javascript
//package.json中加入下面的键值对，同时postcss-loader options选项使用autoprefixer插件
 "browserslist": [
   "last 100 versions"
  ]
//webpack.config.js
{
   test:/\.scss$/ ,
     use:[
       { loader: 'style-loader'},
       { loader: 'css-loader'},
       { loader: 'sass-loader'},
       { loader: 'postcss-loader',options:{
         plugins:[
           require('autoprefixer')
         ]
       }}
     ]
 }
```

#### 4、方式四

```javascript
//在根目录下.browserslistrc文件，内容如下:

last 100 versions

//webpack.config.js
{
   test:/\.scss$/ ,
     use:[
       { loader: 'style-loader'},
       { loader: 'css-loader'},
       { loader: 'sass-loader'},
       { loader: 'postcss-loader',options:{
         plugins:[
           require('autoprefixer')
         ]
       }}
     ]
 }
```

通过以上配置都可以正常打包，并且其中还可以进行其他**正确**的组合。这里要提示的一点是，browserslist配置不仅是autoprefixer的配置，babel以及其他框架中也有，所以这里需要注意是否有冲突的问题。所以最开始的配置中，我们使用的配置是overrideBrowserslist，而不是browsers。这样当使用autoprefixer时，会使用重写后的，这样看起来更稳妥。

当我们使用browsers时可以发现，控制台会有提示：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570285709992-a34d33c3-76c5-408c-b111-e3b641cbc802.png#align=left&display=inline&height=197&name=image.png&originHeight=197&originWidth=635&size=33722&status=done&width=635)

所以到底使用哪种方式，自行根据项目需求决定。

> importLoaders


```javascript
{
  test:/\.scss$/ ,
    use:[
      { loader: 'style-loader'},
      { loader: 'css-loader', options: { importLoaders: 2 } },
      { loader: 'sass-loader'},
      { loader: 'postcss-loader' }，
    ]
}
```

可以看见我们在上面的css-loader配置了一个options选项：importLoaders。这是为了防止多重引入css，不走下面的sass-loader和postcss-loader。比如我在index.js中引入了index.scss，然后在index.scss中又引入了avater.scss。此时打包的时候avater.scss可能不会经过postcss和sass的解析流程。

### 4、css模块化

有时候我们希望在不同的js模块化中引用了相同的样式，但是只希望其中某一个生效，这时候我们可以使用css模块化，通过如下配置我们可以开启css-loader的模块化机制：

```javascript
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
```

接下来我们修改index.js如下：

```javascript
import Header from './header.js';
import Sidebar from './sidebar.js';
import Content from './content.js';
import avater from './logo.jpg';
import style from './index.scss'
import createAvater from './createAvater'

createAvater();

var img = new Image();
img.src=avater;
img.classList.add(style.avater);

var root = document.getElementById('root');
root.append(img)

console.log(avater)

new Header();
new Sidebar();
new Content();
```

同时我们在src目录下新建一个createAvater.js文件，内容如下：

```javascript
import avater from './logo.jpg';

function createAvater(){
    var img = new Image();
    img.src=avater;
    img.classList.add('avater');
    var root = document.getElementById('root');
    root.append(img)
}

export default createAvater;
```

接下来我们再次打包，然后打开index.html：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570287518999-9e05b82c-1e2e-4af0-b7fe-da1c68d95881.png#align=left&display=inline&height=564&name=image.png&originHeight=564&originWidth=1360&size=246745&status=done&width=1360)

通过上面的内容可以发现我们我们在createAvater中引用avater并没有生效，因为我们在index.js中使用了模块化引入css的方式，在使用该样式，但是createAvater中没有模块化引入。同时，我们可以看到模块化之后的css打包输出的css规则名字是一个hash串，所以我们在createAvater中使用.avater是找不到这个样式的。

## 三、打包字体图标

这里使用iconfont上的图标举例，首先我们iconfont阿里巴巴适量图标库上选择几个图标添加到项目，并下载字体图标文件：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570292806195-054f01b2-0677-40db-8b09-13bbf7b1a786.png#align=left&display=inline&height=302&name=image.png&originHeight=302&originWidth=752&size=32245&status=done&width=752)
下载过后解压目录，里面的文件有多个，类似下面这样

```javascript
.
├── demo.css
├── demo_index.html
├── iconfont.css
├── iconfont.eot
├── iconfont.js
├── iconfont.json
├── iconfont.svg
├── iconfont.ttf
├── iconfont.woff
└── iconfont.woff2
```

然后我们将eot，svg，ttf，woff，woff2文件拷贝到src的fonts目录下（新建），然后修改webpack.config.js文件如下：

```javascript
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
```

接着我们将字体图标文件中css文件中的代码拷贝添加到index.scss中：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570295192456-088771cf-ab3d-45ec-a5d2-b4c18cca55c4.png#align=left&display=inline&height=552&name=image.png&originHeight=552&originWidth=900&size=100873&status=done&width=900)

然后@font-face中url部分，修改成正确的文件路经。最后我们修改index.js，添加如下代码：

```javascript
var fonts = document.createElement('div');
fonts.classList.add(style.iconfont);
fonts.classList.add(style['icon-baohu']);
root.append(fonts);
```

接下来我们运行npm run bundle打包，再打开index.html可以发现正常显示我们的图标了：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570295311515-dea17fa7-73d2-4690-8158-5b4df3098f23.png#align=left&display=inline&height=539&name=image.png&originHeight=539&originWidth=992&size=169935&status=done&width=992)

由于字体大小的缘故所以显示的很小，同时可以看到div中的样式是一个打包随机生成hash串，因为我们仍然使用了css模块化的缘故，当我们改成不适用css模块化之后，样式就会显示成css文件中的名字。

以上章节主要讲解了常用loader的时候，当然这只是所有loader的中的一部分。更多的loader知识可以到[webpack官网](https://webpack.js.org/loaders/)仔细阅读一下。
