const { defaultTheme } = require('vuepress')
const { backToTopPlugin } = require('@vuepress/plugin-back-to-top')
const { externalLinkIconPlugin } = require('@vuepress/plugin-external-link-icon')
const { mediumZoomPlugin } = require('@vuepress/plugin-medium-zoom')
const { nprogressPlugin } = require('@vuepress/plugin-nprogress')
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')
const { docsearchPlugin } = require('@vuepress/plugin-docsearch')
const { prismjsPlugin } = require('@vuepress/plugin-prismjs')
const { shikiPlugin } = require('@vuepress/plugin-shiki')



module.exports = {
  lang: 'zh-CN',
  base: "/",
  title: '开发知识库笔记',
  description: '开发知识库笔记',
  head: [
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  displayAllHeaders: false,

  theme: defaultTheme({
    // 默认主题配置
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '碎片化笔记',
        link: '/debris'
      },
      // 字符串 - 页面文件路径
      // '/bar/README.md',
      // {
      //   text: '知识库',
      //   children: [
      //     {
      //       text: 'Always active',
      //       link: '/',
      //       // 该元素将一直处于激活状态
      //       activeMatch: '/',
      //     },
      //     {
      //       text: 'Active on /',
      //       link: '/not-foo/',
      //       // 该元素在当前路由路径是 /foo/ 开头时激活
      //       // 支持正则表达式
      //       activeMatch: '^/foo/',
      //     },
      //   ],
      // },
    ],
    // colorMode: 'auto' 
    logo: '/images/icon/android-chrome-192x192.png', //左上角 
    repo: 'https://github.com/Burny-Tech/Burny.tech.git',
    repoLabel: 'GitHub',
    //  logo: '/images/log.png'


    sidebar: {
      '/debris/': [
        {
          text: 'Java',
          sidebarDepth: 5,
          link: '/debris/java/'
          // collapsible: true,
          // children: [
          //   '/debris/java/index.md',
          //   '/debris/git/index.md'],
        },
        {
          text: 'SpringBoot',
          link: '/debris/SpringBoot'
        },
        {
          text: '运维部署',
          link: '/debris/sh',
          sidebarDepth: 5,
          children: [
            {
              text: 'gogs迁移gitlab',
              sidebarDepth: 5,
              link: '/debris/sh/gogs2gitlab'
            },
            {
              text: 'yum更改源',
              link: '/debris/sh/yum'
            },
            {
              text: 'docker',
              link: '/debris/sh/docker',
            }
          ]
        },
        // {
        //   title: "/debris/sh/docker",
        //   children: [
        //     {
        //       title: 'aaa',
        //       path: '/debris/sh/docker'
        //     }
        //   ]
        // }
        // ,
        {
          text: 'git',
          link: '/debris/git'
        }
        // {
        //   text: 'buall all',
        //   collapsible: true,
        //   children: ['/group/test2/README.md', '/group/test2/test2.md'],
        // },
      ]


    },
    sidebarDepth: 3,
    editLink: true,
    editLinkText: '编辑此页',
    lastUpdated: true,
    lastUpdatedText: '最近更新时间自定义',
    //贡献者列表
    //contributors: true,
    //contributorsText: '贡献者列表',
    notFound: ['暂无此页', '暂无此页'],
    backToHome: '回到首页',
    openInNewWindow: '打开新窗口',
    toggleColorMode: '切换主题',



    //未知配置 主题配置 tip warning danger https://v2.vuepress.vuejs.org/zh/reference/default-theme/markdown.html


  }),

  plugins: [
    backToTopPlugin(),
    externalLinkIconPlugin({
      locales: {
        '/': {
          openInNewWindow: 'open in new window',
        },
        '/zh/': {
          openInNewWindow: '在新窗口打开',
        },
      },
    }),
    mediumZoomPlugin({
      selector: ':not(a) > img',
      delay: 500,
    }),
    nprogressPlugin(),
    registerComponentsPlugin(),
    docsearchPlugin({

    }),
    prismjsPlugin({
      // 配置项
    }),
    shikiPlugin({
      // 配置项
      IThemeRegistration: 'nord'
    }),
  ]






}
