---
title: webpack介绍
date: 2020-11-13
isTimeLine: true
tags:
- webpack
categories: frontend
---

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

<!-- more -->

# webpack介绍

## 一、webpack是什么？
### 1、一个小需求引入的问题
先来看下面这样一个问题，有一个需求，是通过js在页面中添加三个部分，最初的时候我们可能会这么写。像下面这样：

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
    <p>这是我们的网页内容</p>
    <div id="root"></div>
    <script src="./index.js"></script>
</body>
</html>
```

上面是一个简单html，通过引入index.js向页面中添加三个部分。下面是index.js的内容：

```javascript
//index.js
var dom = document.getElementById('root');

var header = document.createElement('div');
header.innerText = 'header';
dom.append(header);

var sidebar = document.createElement('div');
sidebar.innerText = 'sidebar';
dom.append(sidebar);

var content = document.createElement('div');
content.innerText = 'content';
dom.append(content);
```

### 2、拆分

以上代码就完成了这个小需求，但是可以看到所有代码都是在一个index.js文件中完成的，这里代码很少，当我们的需求很复杂的时候，index文件将变得非常巨大，所有代码混在一起，变得不易于维护，所以我们想办法进行拆分，可能就产生了下面这样的代码：

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
    <p>这是我们的网页内容</p>
    <div id="root"></div>
    <script src="./header.js"></script>
    <script src="./sidebar.js"></script>
    <script src="./content.js"></script>
    <script src="./index.js"></script>
</body>
</html>
```

```javascript
//header.js
function Header(){
    var header = document.createElement('div');
    header.innerText = 'header';
    dom.append(header);
}
//sidebar.js
function Sidebar(){
    var sidebar = document.createElement('div');
    sidebar.innerText = 'sidebar';
    dom.append(sidebar);
}
//content.js
function Content(){
    var content = document.createElement('div');
    content.innerText = 'content';
    dom.append(content);
}
//index.js
var dom = document.getElementById('root');
new Header();
new Sidebar();
new Content();
```

通过以上代码，我们完成了代码的拆分，拆分成了四个文件，采用面向对象编程的思想，将页面中的三个部分封装到三个js文件中，再在index文件中进行构造对象来组合需求。同时我们发现在index.html中我们也多引入了三个文件。

虽然我们成功拆分成了三个部分，但是可以看出，浏览器多发送了三次http请求，同时对四个js文件的引入顺序也有要求，必须按照顺序引入才可以。不仅如此，通过几个js文件，我们发现，我们无法确定Header，Sidebar，Content来自哪个文件中间，这里虽然文件名一致，但是当代码量巨大，命名空间也会存在污染的可能，所以也会导致代码逻辑不清晰，难以维护。

### 3、ES6模块化

这时候我们就想到，有没有这么一种引入方式：

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
    <p>这是我们的网页内容</p>
    <div id="root"></div>
    <script src="./index.js"></script>
</body>
</html>
```

```javascript
//es6 moudule
import Header from './header'
import Sidebar from './sidebar'
import Content from './content'


new Header();
new Sidebar();
new Content();

//header.js
function Header(){
    var dom = document.getElementById('root');
    var header = document.createElement('div');
    header.innerText = 'header';
    dom.append(header);
}
export default Header；
//sidebar.js
function Sidebar(){
    var dom = document.getElementById('root');
    var sidebar = document.createElement('div');
    sidebar.innerText = 'sidebar';
    dom.append(sidebar);
}
export default Sidebar；
//content.js
function Content(){
    var dom = document.getElementById('root');
    var content = document.createElement('div');
    content.innerText = 'content';
    dom.append(content);
}
export default Content；
```

通过import方式引入不同文件中暴露出的模块，html页面中也只是引入了一个js文件。这样，我们可以看到结构清晰，还可以减少http请求，这就是ES6模块化规范的引入方式。与其类似的还有Commonjs，AMD，CMD等模块化规范，具体模块化规范已经可以写到另一篇文章中记录了，所以这里不做赘述。

然而，我们这里的代码是无法在浏览器中运行的，引入主流的浏览器还无法很好的支持这种模块化引入的方式，所以当我们运行的时候会报错。所以我们需要一种认识他们的工具，也就是我们今天要说的webpack，与其类似的工具还有gulp，grunt，rollup等。

### 4、引入Webpack

其实webpack是一个模块打包器，webpack认识几种模块化暴露引入规范，它会把这些模块打包到一个文件中，接下来我们看一下使用webpack怎么解决上面的问题：

首先我们需要安装webpack，这里我们使用npm进行安装，你也可以使用其他包管理工具如yarn。

先看下我们的工程目录：
```javascript
.
└── 01_demo
   ├── content.js
   ├── header.js
   ├── index.html
   ├── index.js
   └── sidebar.js
```

首先我们在项目根目录下安装webpack，以下是安装顺序：

```javascript
npm init -y

npm install webpack webpack-cli --save-dev
```

安装完之后，工程结构是以下这样，其中01_demo目录是用来放本次练习的js和html文件，package.json是npm的配置文件，它属于Commonjs规范，这里可以简单说下，nodejs走的也是Commonjs规范。在我们安装webpack的时候，会在当前目录下生成node_modules目录，它就是用来存放当前工程依赖的目录。需要深入了解的，可以学习下nodejs（强烈建议）。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570099649099-14561d73-69a2-49f6-92eb-9f235ffc8534.png#align=left&display=inline&height=237&name=image.png&originHeight=237&originWidth=302&size=14783&status=done&width=302)

接下来我们使用webpack对index.js文件进行打包。

在**01_demo目录**下执行以下命令：

```javascript
npx webapck index.js
```

接下来我们再看下工程目录：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570100172696-84332530-18c6-4fa3-8c5e-00814e5b2056.png#align=left&display=inline&height=276&name=image.png&originHeight=276&originWidth=301&size=16550&status=done&width=301)

我们发现webpack自动在当前目录下帮我们生成了一个dist目录，并且打包出了一个main.js，现在我们在index.html文件中引入main.js，然后运行：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570100411274-1a87b68a-f17c-4f18-ba7e-391c558e1e2c.png#align=left&display=inline&height=427&name=image.png&originHeight=427&originWidth=362&size=34146&status=done&width=362)

我们发现浏览器正常运行了。

### 5、简单说明
> npm init -y


npm init -y的作用是初始化一个npm项目，生成一个package.json文件，package.json文件可以简单理解为类似maven的pom.xml文件。其作用是声明项目所需要的依赖，作者信息，项目信息，使用的协议以及npm scripts脚本等。接来下使用npm安装的依赖都会自动配置到package.json文件的中。

> npm install webpack webpack-cli --save-dev


npm install 命令是安装一个依赖包，此时我们安装的是webpack和webpack-cli包，并保存到本地项目的开发依赖中。开发依赖在项目打包到生产环境时是不会打包进去的，也就是只会在开发过程中用到。

npm install安装包时会自动到中央npm版本库中查找响应的包进行安装，如果没有指定版本号，会自动下载最新的包。

webpack和webpack-cli的关系，webpack-cli是webpack的客户端工具，可以理解是一个脚手架的命令行工具，cli中封装了常用脚本，通过cli我们可以简单快速的使用webpack的功能。

> npx webpack index.js


webpack index.js通过cli的webpack命令对index.js进行打包，这里为什么使用npx命令呢？
因为我们在安装webpack的时候并没有全局安装webpack，所以如果直接使用webpack打包，会找不到该命令。而npx的规则是，默认会在当前工程的依赖中查找webpack，如果没有再查找全局的webpack，如果还没有，会直接在中央仓库中下载webpack然后运行。

## 二、小结

本章我们简单的使用了webpack进行打包，通过简单的小例子，我们了解了webpack默认情况就是一个js的模块打包器，他会检索我们需要打包的文件，查找有没有模块引入的代码，通过import等关键代码，定位模块，最终把需要的模块都打包到一起。下一章，我们继续webapck学习之旅。
