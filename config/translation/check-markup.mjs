// 校验中文译文是否完整保留了英文原文的 Markdown 结构。
//
// 有意不比对：行尾双空格（硬换行）——纯排版，原文自身不一致，不影响结构；
// 也正因如此，本脚本对空白差异不敏感，便于中文自然断行。
//
// 用法:
//   node config/translation/check-markup.mjs          只检查 zh 中已存在的文件
//   node config/translation/check-markup.mjs --all    另外断言 en/zh 的 id 集合相等（按 id 记号配对）
//
// 退出码 0 = 全部通过。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const enDir = path.join(root, 'config/docs/en');
const zhDir = path.join(root, 'config/docs/zh');

const checkAll = process.argv.includes('--all');

const seq = (s, re, group = 1) => [...s.matchAll(re)].map((m) => m[group] ?? m[0]);
const count = (s, re) => (s.match(re) || []).length;

// 按空行切段，用于"段落数"与"每段加粗数"这类与语言无关的比对
const paragraphs = (s) => s.split(/\r?\n[ \t]*\r?\n/).filter((p) => p.trim() !== '');

// 各语言版本会各自指向自己的 EPUB，这不是结构差异，比对前先归一化
// 另外：中文版有意把站点与下载链接指向本仓库（fork），英文/俄文仍指向上游 Kellenok，
// 这属发布目标差异、不是结构差异，故一并归一化仓库 owner / github.io 用户。
const normalize = (s) =>
  s
    .replace(/cure-dolly-(en|ru|zh)\.epub/g, 'cure-dolly-LANG.epub')
    .replace(/github\.com\/[^/\s)]+\/cure-script[\w-]*/g, 'github.com/OWNER/REPO')
    .replace(/[a-z0-9-]+\.github\.io\/cure-script[\w-]*/g, 'OWNER.github.io/REPO');

// 中文文件名已本地化：站内 .md 链接在 en/zh 指向不同文件名，比对前把目标里的
// 文件名归一化成 id 记号（非数字文件保持原名），避免因改名制造假阳性。
const normLink = (t) => t.replace(/(\.\/)(\d+(?:-\d+)?[a-z]?)[^)\s]*\.md/g, '$1$2.md');

// 文件名配对键：有 id 记号取 id，否则用原文件名（about/index/original）。
const keyOf = (f) => {
  const m = f.match(/^(\d+(?:-\d+)?[a-z]?)/);
  return m ? m[1] : f;
};

// 中文版有意添加、英文原文没有的「说明性内容」：
//  - about.md：首部 `::: info 译者注` 容器（含说明文字与外链）；
//  - 97 课：末尾致谢句仅为语序本地化，不增删链接；
//  - original.md：开头补了一行译者说明（不新增链接）。
// 逐字结构比对会把这些当成差异，故在比对前剔除，使校验只针对译文/结构本身。
const stripAdded = (s) =>
  s
    .replace(/\n::: info 译者注[\s\S]*?\n:::\n/g, '\n')
    .replace(/\n\*（译者注：[\s\S]*?）\*\n/g, '\n');

const checks = {
  // 精确序列比对（内容必须逐字一致）
  code: {
    kind: 'seq',
    get: (s) => seq(s, /<code>([\s\S]*?)<\/code>/g),
    label: '<code> 内部文本',
  },
  inlineCode: {
    kind: 'seq',
    get: (s) => seq(s, /(?<!`)`([^`\n]+)`(?!`)/g),
    label: '行内反引号内容',
  },
  img: {
    kind: 'seq',
    get: (s) => seq(s, /!\[([^\]]*)\]\(([^)]+)\)/g, 2),
    label: '图片路径',
  },
  imgAlt: {
    kind: 'seq',
    get: (s) => seq(s, /!\[([^\]]*)\]\(/g),
    label: '图片 alt 文本',
  },
  container: {
    kind: 'seq',
    get: (s) => seq(s, /^:::[ \t]*([a-zA-Z-]+)/gm),
    label: '容器类型',
  },
  furigana: {
    kind: 'seq',
    get: (s) => seq(s, /\[[^\]]+\]\{([^}]+)\}/g),
    label: '振假名读音',
  },
  mdLink: {
    kind: 'seq',
    get: (s) => seq(s, /\]\((\.\/[^)]+)\)/g).map(normLink),
    label: '站内链接目标',
  },
  linkTarget: {
    kind: 'seq',
    get: (s) => seq(s, /\]\(([^)\s]+)\)/g).map(normLink),
    label: '全部链接目标（含 mailto）',
    // 中文语序可能导致同一批链接顺序不同，顺序敏感比对会制造假阳性；
    // 顺序无关的「链接目标集合」由 linkTargetSet 负责，这里不再重复检查。
    skip: true,
  },
  supInner: {
    kind: 'seq',
    get: (s) => seq(s, /<sup>([\s\S]*?)<\/sup>/g).map(normLink),
    label: '<sup> 内部文本',
  },
  heading: {
    kind: 'seq',
    get: (s) => seq(s, /^(#{1,6})\s/gm),
    label: '标题层级序列',
  },
  // 链接「集合」比对：顺序无关（中文语序与英文不同，属正常本地化），只要求
  // 出现的目标集合一致——即不新增、也不丢失任何链接。仅「全部链接目标」这一项
  // 允许顺序不同；站内 .md 链接仍由 mdLink 做顺序敏感比对。
  linkTargetSet: {
    kind: 'seq',
    get: (s) => [...new Set(seq(s, /\]\(([^)\s]+)\)/g).map(normLink))].sort(),
    label: '链接目标集合',
  },
  boldPerPara: {
    kind: 'seq',
    get: (s) => paragraphs(s).map((p) => count(p, /\*\*/g)),
    label: '每段加粗标记数',
    skipIf: (a, b) => a.length !== b.length, // 段落数已不一致时，该项只会产生噪音
  },

  // 计数比对
  paragraph: { kind: 'count', get: (s) => paragraphs(s).length, label: '段落数' },
  // 注意：不要求偶数。英文原文存在残缺加粗（如 35 课的 `it is* **[…](…).*`），
  // 此时中文忠实镜像才是正确的，要求偶数会制造假阳性。
  bold: { kind: 'count', get: (s) => count(s, /\*\*/g), label: '加粗标记数' },
  hr: { kind: 'count', get: (s) => count(s, /^---[ \t]*$/gm), label: '--- 分隔线' },
  ol: { kind: 'count', get: (s) => count(s, /^\d+\.[ \t]/gm), label: '有序列表项' },
  ul: { kind: 'count', get: (s) => count(s, /^[-*][ \t]/gm), label: '无序列表项' },
  u: { kind: 'count', get: (s) => count(s, /<u>/g), label: '<u> 标签' },
};

const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.md')).sort();
const zhFiles = fs.readdirSync(zhDir).filter((f) => f.endsWith('.md')).sort();

// 按 id 记号配对（about/index/original 按同名），中文文件名与英文不同名也能对齐。
const enByKey = new Map(enFiles.map((f) => [keyOf(f), f]));
const zhByKey = new Map(zhFiles.map((f) => [keyOf(f), f]));

let problems = 0;
const report = [];

if (checkAll) {
  const missing = enFiles.filter((f) => !zhByKey.has(keyOf(f)));
  const extra = zhFiles.filter((f) => !enByKey.has(keyOf(f)));
  const fmt = (list) =>
    list.slice(0, 8).join('\n        ') + (list.length > 8 ? `\n        …另有 ${list.length - 8} 个` : '');
  if (missing.length) {
    problems++;
    report.push(`MISSING  缺少 ${missing.length} 个文件:\n        ${fmt(missing)}`);
  }
  if (extra.length) {
    problems++;
    report.push(`EXTRA    多出 ${extra.length} 个文件（英文版没有）:\n        ${fmt(extra)}`);
  }
}

for (const f of zhFiles) {
  const enFile = enByKey.get(keyOf(f));
  if (!enFile) {
    problems++;
    report.push(`ORPHAN   ${f}  (英文版没有相同 id 的文件)`);
    continue;
  }
  const en = normalize(fs.readFileSync(path.join(enDir, enFile), 'utf8'));
  const zh = stripAdded(normalize(fs.readFileSync(path.join(zhDir, f), 'utf8')));
  const issues = [];

  for (const [name, spec] of Object.entries(checks)) {
    if (spec.skip) continue;
    const a = spec.get(en);
    const b = spec.get(zh);

    if (spec.kind === 'count') {
      if (spec.even && (a % 2 !== 0 || b % 2 !== 0)) {
        issues.push(`${spec.label}: 奇数 en=${a} zh=${b}`);
      } else if (a !== b) {
        issues.push(`${spec.label}: en=${a} zh=${b}（差 ${b - a}）`);
      }
      continue;
    }

    if (spec.skipIf && spec.skipIf(a, b)) continue;
    if (JSON.stringify(a) === JSON.stringify(b)) continue;

    if (a.length !== b.length) {
      issues.push(`${spec.label}: 数量 en=${a.length} zh=${b.length}`);
      continue;
    }
    const i = a.findIndex((v, k) => v !== b[k]);
    const show = (v) => JSON.stringify(v).slice(0, 80);
    issues.push(`${spec.label}: 第 ${i + 1} 项不同\n          en=${show(a[i])}\n          zh=${show(b[i])}`);
  }

  if (issues.length) {
    problems++;
    report.push(`FAIL  ${f}\n        ${issues.join('\n        ')}`);
  }
}

if (report.length) console.log(report.join('\n\n'));
const scope = checkAll ? `（--all，en=${enFiles.length} zh=${zhFiles.length}）` : '';
console.log(`\n检查 ${zhFiles.length} 个文件${scope}，问题文件 ${problems} 个。`);
process.exit(problems ? 1 : 0);
