# SubConverter

> **🌐 通用字幕格式转换工具 | Universal Subtitle Converter**

浏览器端字幕格式互转工具，支持 **VTT · SRT · ASS · SSA · LRC · SBV** 任意互转，无需服务器，文件不上传。

A browser-based subtitle format converter. Convert between VTT, SRT, ASS, SSA, LRC, and SBV — no server, no upload, all in your browser.

**🌍 在线体验 Live Demo:** https://pclgo.github.io/subconverter/

---

## ✨ 特性 Features

- **6 格式互转 Convert any direction** — VTT · SRT · ASS · SSA · LRC · SBV
- **批量处理 Batch processing** — 多文件同时添加，一键全部转换 + ZIP 打包下载
- **格式嗅探 Format sniffing** — `.txt` 等无扩展名文件自动按内容识别
- **丰富格式支持 Rich format** — cue ID、内联标签、NOTE/STYLE 块、多时间戳、逐词时间戳
- **实时预览 Live preview** — 原文与转换结果并排对比
- **纯客户端 Fully client-side** — 文件不会离开你的电脑
- **中英双语 Bilingual UI** — 根据浏览器语言自动切换，右上角手动切换

## 🎬 支持的格式 Supported Formats

| 格式 Format | 扩展名 Extension | 说明 Description |
|-------------|-----------------|------------------|
| **VTT** | `.vtt` | WebVTT (HTML5 video) |
| **SRT** | `.srt` | SubRip (最通用格式 / most common) |
| **ASS** | `.ass` | Advanced SubStation Alpha (带样式字幕 / styled) |
| **SSA** | `.ssa` | SubStation Alpha (旧版格式 / legacy) |
| **LRC** | `.lrc` | 歌词格式 / Lyric format (music players) |
| **SBV** | `.sbv` | YouTube 字幕格式 / YouTube caption format |

## 📖 使用方法 Usage

1. 在浏览器打开 `index.html`
2. 拖拽字幕文件到上传区域，或点击选择文件
3. 选择目标输出格式
4. 点击 **全部转换 (Convert All)** 或逐文件转换
5. 并排预览结果
6. 点击 **打包下载 (Download ZIP)** 获取所有转换后的文件

### 快捷键 Keyboard Shortcut

- `Ctrl+Enter` — 快速全部转换 / quickly convert all pending files

### 格式嗅探 Format Sniffing

`.txt` 或其它无扩展名文件会自动识别格式：
- `WEBVTT` 头 → VTT
- `[Script Info]` 头 → ASS / SSA
- `[MM:SS.xx]` 时间戳 → LRC
- 序号 + 时间戳 → SRT
- `H:MM:SS.mmm` 模式 → SBV

### 语言自动检测 Language Auto-detection

- 首次打开根据浏览器语言自动选择中文或英文
- 点击右上角按钮手动切换
- 偏好设置保存在 `localStorage`

## 🧪 测试文件 Test Files

`test/` 目录包含各格式的基础样例和边界测试：

| 文件 File | 测试内容 What It Tests |
|-----------|----------------------|
| `sample.*` | 各格式基础样例 / Basic format coverage |
| `cue-id.vtt` | VTT 数字/文本 cue ID / Numeric & text identifiers |
| `edge-vtt.vtt` | VTT NOTE/STYLE 块 / NOTE & STYLE blocks |
| `edge-srt.srt` | SRT 含 HTML 标签 / HTML tags inside text |
| `special.srt` | Unicode、Emoji、特殊字符 / Special characters |
| `arrow-sbv.sbv` | SBV 使用 `-->` 箭头 / Arrow-style timestamps |
| `style-comment.ass` | ASS 多风格 + Comment 事件 / Multi-style & comments |
| `multi-ts.lrc` | LRC 多时间戳 / Multiple timestamps |
| `multi-lrc.lrc` | 纯多行 LRC / Plain multi-line LRC |
| `word-lrc.lrc` | LRC 逐词时间戳 / Word-level timestamps |
| `sniff-*.txt` | 格式嗅探测试 / Format sniffing tests |

## 📁 项目结构 Project Structure

```
subconverter/
├── index.html          # 单文件应用 / Single-file application
├── test/
│   ├── sample.*        # 基础样例 / Basic samples
│   ├── edge-*          # 边界测试 / Edge cases
│   ├── sniff-*.txt     # 格式嗅探 / Format sniffing
│   └── test-parse.js   # 解析器测试 / Parser test suite
└── README.md
```

整个项目就是一个 HTML 文件——解析器、生成器、UI 全用原生 JavaScript 实现，Tailwind CSS 从 CDN 加载。

Everything is in a single HTML file — parser, generator, and UI are all vanilla JavaScript with Tailwind CSS (loaded from CDN).

## 🔧 开发 Development

无需构建工具，直接编辑 `index.html` 刷新即可。

No build tools required. Just edit `index.html` and refresh.

运行测试套件 / Run the test suite:

```bash
node test/test-parse.js
```

## 🚀 部署 Deployment

纯静态站点，可以部署到 GitHub Pages、Netlify、Vercel 等平台。

This is a static site. Deploy to GitHub Pages, Netlify, Vercel, or any static file server.

```bash
git push origin main
```

在仓库设置中启用 **GitHub Pages** → Source: `main` branch → root `/`。

## 📄 许可 License

MIT
