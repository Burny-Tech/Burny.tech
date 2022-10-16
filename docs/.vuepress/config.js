// const { defaultTheme } = require('vuepress')
const { defaultTheme } = require('@vuepress/theme-default')
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
  title: 'Burny.tech',
  description: 'Burny',
  head: [
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  displayAllHeaders: true,



  open: false,
  debug: true,
  port: 80,

  theme: defaultTheme({
    // 默认主题配置
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '碎片化笔记',
        //activeMatch: '/debris',
        link: '/debris/index.md'
      },
      {
        text: '系统学习的笔记',
        //activeMatch: '/system',
        link: '/system/index.md'
      },
    ],

    sidebar: {
      '/debris/': [
        {
          text: 'git',
          // collapsible: true,
          children: [
            '/debris/git/index.md',
          ]
        },
        {
          text: 'sh',
          // collapsible: true,
          children: [
            '/debris/sh/docker/index.md',
            '/debris/sh/gogs2gitlab/index.md',
            '/debris/sh/ssl/index.md',
            '/debris/sh/yum/index.md',
            '/debris/sh/index.md'

          ]
        },
        {
          text: 'Java',
          children: ['/debris/java/Java/index.md']
        },
        {
          text: 'SpringBoot',
          children: ['/debris/java/SpringBoot/index.md']
        },
        {
          text: 'SpringJPA',
          children: ['/debris/java/JPA/index.md']
        }
        , {
          text: 'MySql',
          children: ['/debris/mysql/index.md']
        }
      ],
      '/system/': [
        {
          text: 'rabbitmq',
          children: ['/system/rabbitmq/index.md']
        },
        {
          text: 'gradle',
          children: ['/system/gradle/index.md']
        },
        {
          text: 'Redis',
          children: ['/system/redis/index.md']
        }, {
          text: 'Arthas',
          children: ['/system/Arthas/index.md']
        },
        {
          text: 'Docker',
          children: ['/system/docker/index.md']
        },
        {
          text: 'SpringSecurity',
          children: ['/system/SpringSecurity/index.md']
        },


      ],
      '/': ['']
    },

    // colorMode: 'auto' 
    // logo: '/images/icon/android-chrome-192x192.png', //左上角 
    // repo: 'https://github.com/Burny-Tech/Burny.tech.git', //右上角的
    repoLabel: 'GitHub',
    //  logo: '/images/log.png'





    sidebarDepth: 6,
    editLink: false,
    // editLinkText: '编辑此页',
    lastUpdated: false,
    // lastUpdatedText: '最近更新时间自定义',
    //贡献者列表
    contributors: false,
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
      selector: 'not(a) > img',
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

  ],

  markdown: {
    level: [2, 3, 4, 5, 6]
  }



}
