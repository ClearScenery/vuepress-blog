module.exports = {
    title: '喜欢夜晚Coding的耗子',
    description: '人生如逆旅，我亦是行人',
    theme: 'reco',
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['link',{ rel: "shortcut icon", href: '/favicon.ico'}]
    ],
    themeConfig: {
      valineConfig: {
        appId: 'e4xv1putYamza36SIG5QPma0-gzGzoHsz',// your appId
        appKey: 'NzPi8qbGBKVPsk4zvUpTMthp', // your appKey
      },
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
        recordLink: 'https://beian.miit.gov.cn/',
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
    plugins: [
      [
        '@vuepress-reco/vuepress-plugin-bgm-player',
        { 
          audios: [
            // 本地文件示例
            {
              name: '蜗牛',
              artist: '周杰伦',
              url: '/周杰伦-Fantasy.Plus.mp3',
              cover: '/Fantasy.Plus.jpg'
            },
          ],
        }
      ]
    ]
}  