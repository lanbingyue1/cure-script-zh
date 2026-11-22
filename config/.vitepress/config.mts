import { defineConfig } from 'vitepress';
import furigana from 'furigana-markdown-it';
import { sidebar } from './sidebar.mts'; 

export default defineConfig({
  title: "Cure Dolly",
  description: "in markdown",
  srcDir: 'docs',
  base: process.env.VITE_BASE_URL || '/',
  sitemap: {
    // 生成 sitemap.xml，方便搜索引擎发现 /zh/ 下的全部课程页。
    hostname: 'https://lanbingyue1.github.io/cure-script-zh/'
  },
  ignoreDeadLinks: true,
  rewrites: {
    'en/:rest*': ':rest*'
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Cure Dolly Grammar Guide',
      description: 'The complete Cure Dolly Japanese grammar course, readable online or as a downloadable EPUB.',
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
      title: 'Cure Dolly — руководство по японской грамматике',
      description: 'Полный курс японской грамматики Cure Dolly: для чтения онлайн и в виде EPUB.',
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
      title: 'Cure Dolly 日语语法指南',
      description: 'Cure Dolly 日语语法课程完整中文译本：可在线阅读，也可下载 EPUB 离线阅读。',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '关于', link: '/zh/about' },
          { text: '下载 EPUB', link: 'https://github.com/lanbingyue1/cure-script-zh/releases/latest/download/cure-dolly-zh.epub' }
        ],
        footer: {
          message: '由 <a href="https://bento.me/kln">Kellen</a> 制作',
          copyright: '原始文字稿由 <a href="https://docs.google.com/document/d/1XpuXerkGU8waJ4DPDNJA4bGeqOvM-csXjTe57iHARHc">nunko/dinuz</a> 转录。'
        }
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
      { href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap', rel: 'stylesheet' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap', rel: 'stylesheet' }
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
    ['link', { rel: 'sitemap', type: 'application/xml', href: '/cure-script-zh/sitemap.xml' }],
    /* 站点根 `/` 是英文 locale（上游设计），中文在 `/zh/`。
       这里让「中文浏览器首次直达根路径」自动跳到中文站：
         - 仅对根路径生效（/zh/、/ru/、各课程页不受影响）
         - 若来源是站内（referrer 同源，例如点了语言切换器的 English），不跳转，
           避免把主动选择英文的用户又弹回中文
         - 非中文浏览器保持英文首页不变
       en/ru 的文档零改动；仅作用于共享配置。 */
    ['script', {}, `(function(){try{
var base=${JSON.stringify(process.env.VITE_BASE_URL || '/')};
if(base.charAt(base.length-1)!=='/')base+='/';
var p=location.pathname;
var rel=p.indexOf(base)===0?p.slice(base.length):p;
if(rel.charAt(0)==='/')rel=rel.slice(1);
if(rel!==''&&rel!=='index.html')return;
var ref=document.referrer||'';
if(ref.indexOf(location.origin)===0)return;
var langs=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||''];
var pref=String(langs[0]||'').toLowerCase();
if(pref.indexOf('zh')===0)location.replace(base+'zh/'+location.search+location.hash);
}catch(e){}})();`],
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
