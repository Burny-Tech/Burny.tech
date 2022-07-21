const { defaultTheme } = require('vuepress')
const { backToTopPlugin } = require('@vuepress/plugin-back-to-top')








module.exports = {
  lang: 'zh-CN',
  base: "/",
  title: 'Burny.tech',
  description: '开发博客笔记',
  head: [
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],




  ],

  theme: defaultTheme({
    // 默认主题配置
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: 'Group',
        children: ['/group/foo.md', '/group/bar.md'],
      },
            // 字符串 - 页面文件路径
            '/bar/README.md',
            {
              text: 'Group 2',
              children: [
                {
                  text: 'Always active',
                  link: '/',
                  // 该元素将一直处于激活状态
                  activeMatch: '/',
                },
                {
                  text: 'Active on /',
                  link: '/not-foo/',
                  // 该元素在当前路由路径是 /foo/ 开头时激活
                  // 支持正则表达式
                  activeMatch: '^/foo/',
                },
              ],
            },
    ],
    // colorMode: 'auto' 
        logo: 'https://vuejs.org/images/logo.png', //左上角 
    repo: 'https://gitee.com/chenyx299/burny.tech',
    repoLabel: 'Burny.tech仓库',
  //  logo: '/images/log.png'
    
    
    sidebar: {
      '/group/': [
        {
          text: 'group all',
          collapsible: true,
          children: ['/group/test1/README.md', '/group/test1/test1.md'],
        },
        {
          text: 'buall all',
          collapsible: true,
          children: ['/group/test2/README.md', '/group/test2/test2.md'],
        },
      ],
    },
    sidebarDepth: 3,
      editLink: true,
    editLinkText: '编辑此页',
    lastUpdated: true,
    lastUpdatedText: '最近更新时间自定义',
    //贡献者列表
    contributors: true, 
    contributorsText: '贡献者列表',
    notFound: ['m没有找到自定义', 'meiyou2'],
    backToHome: '回到首页',
    openInNewWindow: '打开新窗口',
    toggleColorMode: '切换主题',
    

 
    //未知配置 主题配置 tip warning danger https://v2.vuepress.vuejs.org/zh/reference/default-theme/markdown.html
    

  }),

  plugins: [
    [backToTopPlugin()],
    ['@vssue/vuepress-plugin-vssue', {
      platform: 'github',
      owner: 'Burny-Tech',
      repo: 'Burny.tech',
      clientId: 'e934b7c798f140bb6d32',
      clientSecret: '41902742a01c1792bc472f301b140c067e94c770',
    }],
    

  ]
    
      
  



}
