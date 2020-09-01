module.exports = {
    title: '景色分明',
    description: '人生天地间，忽如远行客',
    theme: 'reco',
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['link',{ rel: "shortcut icon", href: '/favicon.ico'}]
    ],
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '时间轴', link: '/timeline/', icon: 'reco-date' },
            { text: '关于', link: '/about/', icon: 'reco-date' },
            {
                text: '联系',
                items: [
                  { text: 'GitHub', link: 'https://github.com/ClearScenery/',icon: 'reco-github' },
                ]
            }
        ],
        
        friendLink: [
            {
              title: '空夜',
              logo:'https://zfbd.oss-cn-beijing.aliyuncs.com/img/open/head.jpg',
              link: 'http://eknown.cn/'
            },
            {
              title: 'aleestar',
              logo:'https://upyun.aleestar.cn/logo.jpg',
              link: 'https://aleestar.cn/'
            },
            {
              title: '菜哥',
              link: 'http://caixuejava.top/'
            },
        ],
        sidebar: 'auto',
        logo: '/avatar.jpg',
        type: 'blog',
        authorAvatar: '/avatar.jpg',
        author: 'ClearScenery',
        // 备案
        record: '皖ICP备19003549号-1',
        recordLink: 'http://www.beian.miit.gov.cn/',
        // 项目开始时间，只填写年份
        startYear: '2018',
        // 博客配置
        blogConfig: {
            tag: {
                location: 2,     // 在导航栏菜单中所占的位置，默认3
            },
            category: {
                location: 3,     // 在导航栏菜单中所占的位置，默认2
            },
        },
    },
    locales: {
        '/': {
          lang: 'zh-CN'
        }
    },
    plugins: {
      '@vssue/vuepress-plugin-vssue': {
        // 设置 `platform` 而不是 `api`
        platform: 'github',
  
        // 其他的 Vssue 配置
        owner: 'ClearScenery',
        repo: 'vuepress-blog',
        clientId: '7bc280ca88ff5f07789b',
        clientSecret: 'ef3fbd9ec67f9dc86b95579695c3c9b925a55b95',
      },
    },
}  