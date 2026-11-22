import { defineConfig } from 'vitepress';
import furigana from 'furigana-markdown-it';
import { sidebar } from './sidebar.mts'; 

export default defineConfig({
  title: "Cure Dolly",
  description: "in markdown",
  srcDir: 'docs',
  base: process.env.VITE_BASE_URL || '/',
  ignoreDeadLinks: true,
  rewrites: {
    'en/:rest*': ':rest*'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' },
          { text: 'Download EPUB', link: 'https://github.com/Kellenok/cure-script/releases/latest/download/cure-dolly-en.epub' }
        ]
      }
    },
    ru: {
      label: 'Russian',
      lang: 'ru',
      themeConfig: {
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'О проекте', link: '/ru/about' },
          { text: 'Скачать EPUB', link: 'https://github.com/Kellenok/cure-script/releases/latest/download/cure-dolly-ru.epub' }
        ]
      }
    },
    zh: {
      label: 'Chinese',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '关于', link: '/zh/about' },
          { text: '下载 EPUB', link: 'https://github.com/lanbingyue1/cure-script-zh/releases/latest/download/cure-dolly-zh.epub' }
        ]
      }
    }
  },

  markdown: {
    image: {
      lazyLoading: true
    },
    config: (md) => {
      md.use(furigana());
    }
  },
  
  head: [
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { rel: 'icon', href: '/cure-script-zh/favicon.ico' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet', rel: 'stylesheet' }
    ],
    ['meta', { name: 'og:title', content: "Cure Dolly Grammar guide" }],
    ['meta', { property: 'og:description', content: 'Enjoy the entire grammar guide in a easy-to-read web format' }],
    ['meta', { property: 'og:image', content: '/cure-script-zh/og.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://lanbingyue1.github.io/cure-script-zh' }],
    ['meta', { name: 'twitter:url', content: 'https://lanbingyue1.github.io/cure-script-zh' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' } ],
    ['meta', { name: 'twitter:title', content: 'Cure Dolly Grammar guide' } ],
    ['meta', { name: 'twitter:description', content: 'Enjoy the entire grammar guide in a easy-to-read web format' } ],
    ['meta', { name: 'twitter:image', content: '/cure-script-zh/og.png' } ],
  ],

  themeConfig: {
    sidebar: sidebar,
    editLink: {
      pattern: 'https://github.com/lanbingyue1/cure-script-zh/edit/main/config/docs/:path'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lanbingyue1/cure-script-zh' }
    ],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          // 让中文可检索：minisearch 默认按空白/标点切词，中文整句会变成一个 token，
          // 导致中文查询 0 命中。这里在默认切分的基础上，把 CJK 连续串再拆成单字；
          // 英文/俄文仍按空格切分，行为不变。
          options: {
            tokenize: (text: string) => {
              const isCJK = (ch: string) =>
                /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/.test(ch);
              return text
                .toLowerCase()
                .split(/[\n\r\p{Z}\p{P}\p{S}]+/u)
                .flatMap((seg) => {
                  if (!seg) return [] as string[];
                  const tokens: string[] = [];
                  let buf = '';
                  for (const ch of seg) {
                    if (isCJK(ch)) {
                      if (buf) { tokens.push(buf); buf = ''; }
                      tokens.push(ch);
                    } else {
                      buf += ch;
                    }
                  }
                  if (buf) tokens.push(buf);
                  return tokens;
                });
            }
          }
        }
      }
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Download EPUB', link: 'https://github.com/Kellenok/cure-script/releases/latest/download/cure-dolly-en.epub' }
    ],
    footer: {
      message: 'Created by <a href="https://bento.me/kln">Kellen</a>',
      copyright: 'Originally transripted by <a href="https://docs.google.com/document/d/1XpuXerkGU8waJ4DPDNJA4bGeqOvM-csXjTe57iHARHc">nunko/dinuz</a>.'
    }
  }
});
