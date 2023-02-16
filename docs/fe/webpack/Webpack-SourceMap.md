---
title: Webpack中配置SourceMap
date: 2020-11-14
isTimeLine: true
tags:
- webpack
categories: frontend
---

本章主要记录了webpack中的SourceMap的概念，以及如何配置SourceMap。

<!-- more -->

# Webpack中配置SourceMap

## 一、SourceMap的配置

首先我们来介绍下sourceMap，它其实是一个映射关系，它能映射出打包出的文件中错误的地方在源代码文件中的第几行。举个例子：

比如我们在index.js中写了一个错误的代码，然后打包出的文件在运行时候会报错，但是打包之后的文件代码量是很大的，也许报错在1000行。但是实际在源文件中这个报错的代码在第10行，所以这时候sourceMap就能帮助我们定位到在源代码中错误的位置。

首先我们先来验证一下上面的说话：

在webpack配置文件中添加如下配置：

```javascript
module.exports = {
    mode:'production',
    devtool:'none',
    entry:{
        main:'./src/index.js',
    },
 ...
```

然后我们将无关文件都删除了，只保留一个index.js和index.html模板。其中index.js代码如下：

```javascript
consele.log('hello world');
```

可以看到，我们故意写了一个错误的console，然后我们运行npm run bundle打包。打包完成之后我们打开index.html，可以看到控制台报错了，然后我们会发现报错的文件是main.js中的73行（可能和编辑器中的代码行数不一致，这是由于不同的格式化工具导致的）。

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570333860595-d1fe1e24-8dec-48dd-a50a-ae784a76eeeb.png#align=left&display=inline&height=366&name=image.png&originHeight=366&originWidth=1360&size=74220&status=done&width=1360)

可以看到，这并不是我们想要的结果，我们希望在报错的时候，能将报错的位置定位在源代码中具体的某一行。这时候我们修改webpack配置如下：

```javascript
module.exports = {
    mode:'production',
    devtool:'source-map',
    entry:{
        main:'./src/index.js',
    },
...
```

然后我们重新运行npm run bundle打包，再次打开index.html：

![image.png](https://cdn.nlark.com/yuque/0/2019/png/335120/1570334193259-3d657f4b-995b-481f-ac46-afbd229d845b.png#align=left&display=inline&height=369&name=image.png&originHeight=369&originWidth=1360&size=58733&status=done&width=1360)

我们可以看到现在报错信息已经定位到源代码文件中的报错的那一行了。这对于在开发测试阶段帮助我们快速定位问题很有帮助，但是在生产阶段不推荐使用，通过打包出的文件我们可以看到除了正常打包出的文件之外，还有一个.map结尾的文件，这就是sourceMap维护的一个对应关系。如果在生产阶段，而且是正常的项目，这个文件是非常巨大的，很影响生产环境程序的运行。

```javascript
.
├── index.html
├── main.js
└── main.js.map
```

### 1、inline-source-map
devtool选项除了可以配置成source-map之外，还可以配置成inline-source-map，这个选项会将映射关系直接打包进项目output中配置的js文件中，此配置可以定位到错误的行和列。

### 2、cheap-source-map
这个选项会只会定位到错误的某一行，不会定位错误的列。

### 3、cheap-module-source-map
这个选项会将除了业务代码之外的loader，plugin等错误信息也打包进sourceMap映射，并且忽略列号。

### 4、eval
这个选项会直接执行报错的代码并且指向源代码文件中的错误位置，这在代码量非常小的情况有用。

更多其他配置选项，请查看[webpack devtool 官方文档](https://webpack.js.org/configuration/devtool/#devtool)。

### 5、常用配置

测试开发：cheap-module-eval-source-map
生产报错定位：cheap-module-source-map

几点解释：

- none：没有sourceMap
- cheap：忽略列号
- inline：打包进js中
- eval：直接执行错误
