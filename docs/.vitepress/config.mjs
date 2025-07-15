import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ts-mapper',
  description: 'Type-safe object mapping library for TypeScript and NestJS',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'ts-mapper' }],
    ['meta', { name: 'og:image', content: '/og-image.png' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'ts-mapper',
      description: 'Type-safe object mapping library for TypeScript and NestJS',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'ts-mapper',
      description: '适用于 TypeScript 和 NestJS 的类型安全对象映射工具',
    }
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/en/guide/core/getting-started' },
      { text: 'API Reference', link: '/en/api/ts-mapper' },
      { text: 'Contributing', link: '/en/contributing' },
      { text: 'Changelog', link: '/en/changelog' },
      {
        text: 'GitHub',
        link: 'https://github.com/ilhamtahir/nest-mapper',
        target: '_blank'
      }
    ],

    sidebar: {
      '/en/guide/core/': [
        {
          text: 'ts-mapper Core',
          items: [
            { text: 'Getting Started', link: '/en/guide/core/getting-started' },
            { text: 'transform() Function', link: '/en/guide/core/transform' },
            { text: '@Mapping Decorator', link: '/en/guide/core/mapping' },
            { text: 'Custom Strategies', link: '/en/guide/core/custom-strategy' }
          ]
        }
      ],
      '/en/guide/nest/': [
        {
          text: 'nest-mapper Integration',
          items: [
            { text: 'NestJS Getting Started', link: '/en/guide/nest/getting-started' },
            { text: 'Mapper Injection', link: '/en/guide/nest/injection' },
            { text: 'Abstract Class Support', link: '/en/guide/nest/abstract-class' },
            { text: 'Nested & Circular Dependencies', link: '/en/guide/nest/circular-deps' }
          ]
        }
      ],
      '/en/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'ts-mapper API', link: '/en/api/ts-mapper' },
            { text: 'nest-mapper API', link: '/en/api/nest-mapper' }
          ]
        }
      ],
      '/zh/guide/core/': [
        {
          text: 'ts-mapper 核心',
          items: [
            { text: '快速开始', link: '/zh/guide/core/getting-started' },
            { text: 'transform() 函数', link: '/zh/guide/core/transform' },
            { text: '@Mapping 装饰器', link: '/zh/guide/core/mapping' },
            { text: '自定义转换策略', link: '/zh/guide/core/custom-strategy' }
          ]
        }
      ],
      '/zh/guide/nest/': [
        {
          text: 'nest-mapper 集成',
          items: [
            { text: 'NestJS 快速开始', link: '/zh/guide/nest/getting-started' },
            { text: 'Mapper 依赖注入', link: '/zh/guide/nest/injection' },
            { text: '抽象类支持', link: '/zh/guide/nest/abstract-class' },
            { text: '嵌套与循环依赖', link: '/zh/guide/nest/circular-deps' }
          ]
        }
      ],
      '/zh/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'ts-mapper API', link: '/zh/api/ts-mapper' },
            { text: 'nest-mapper API', link: '/zh/api/nest-mapper' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ilhamtahir/nest-mapper' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@ilhamtahir/ts-mapper' }
    ],

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2024 IlhamTahir'
    },

    editLink: {
      pattern: 'https://github.com/ilhamtahir/nest-mapper/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})
