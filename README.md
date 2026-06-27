# SubConverter

> 通用字幕格式转换工具 — 浏览器端，无需服务器，文件不上传。

**🔗 在线体验：** https://subconverter-delta-six.vercel.app/

---

## 中文版

### ✨ 特性

- **6 格式互转**：VTT · SRT · ASS · SSA · LRC · SBV，任意互转
- **批量处理**：多文件同时添加，选择输出格式，一键全部转换 + ZIP 打包下载
- **格式嗅探**：`.txt` 等无扩展名文件自动按内容识别
- **实时预览**：原文与转换结果并排对比
- **纯客户端**：文件不会离开你的电脑
- **中英双语**：根据浏览器语言自动切换，右上角可手动切换

### 🎬 支持的格式

| 格式 | 扩展名 | 说明 |
|------|--------|------|
| **VTT** | `.vtt` | WebVTT（HTML5 视频） |
| **SRT** | `.srt` | SubRip（最通用字幕格式） |
| **ASS** | `.ass` | Advanced SubStation Alpha（带样式字幕） |
| **SSA** | `.ssa` | SubStation Alpha（旧版字幕格式） |
| **LRC** | `.lrc` | 歌词格式（音乐播放器） |
| **SBV** | `.sbv` | YouTube 字幕格式 |

### 📖 使用方法

1. 在浏览器打开 `index.html`
2. 拖拽字幕文件到上传区域，或点击选择文件
3. 选择目标输出格式
4. 点击「全部转换」或逐文件转换
5. 并排预览结果
6. 点击「打包下载 (.zip)」获取所有转换后的文件

#### 快捷键

- `Ctrl+Enter` — 快速全部转换

#### 格式嗅探

`.txt` 或其它无扩展名文件会被自动识别：

- `WEBVTT` 开头 → VTT
- `[Script Info]` 开头 → ASS / SSA
- `[MM:SS.xx]` 模式 → LRC
- 序号 + `-->` 时间戳 → SRT
- `H:MM:SS.mmm` 模式 → SBV

#### 语言自动检测

首次打开时根据浏览器 `navigator.language` 自动选择中文或英文，之后偏好保存在 `localStorage`，右上角按钮可随时切换。

### 🧪 测试文件

`test/` 目录包含各格式的基础样例和边界测试：

| 文件 | 测试内容 |
|------|----------|
| `sample.*` | 各格式基础样例 |
| `cue-id.vtt` | VTT 数字/文本 cue ID |
| `edge-vtt.vtt` | VTT NOTE/STYLE 块 |
| `edge-srt.srt` | SRT 含 HTML 标签 |
| `special.srt` | Unicode、Emoji、特殊字符 |
| `arrow-sbv.sbv` | SBV 使用 `-->` 箭头格式 |
| `style-comment.ass` | ASS 多风格 + Comment 事件 |
| `multi-ts.lrc` | LRC 多时间戳 |
| `multi-lrc.lrc` | 纯多行 LRC |
| `word-lrc.lrc` | LRC 逐词 `<MM:SS.xx>` 时间戳 |
| `sniff-*.txt` | 格式内容嗅探测试 |

### 📁 项目结构

```
subconverter/
├── index.html          # 单文件应用（解析器 + 生成器 + UI）
├── test/
│   ├── sample.*        # 各格式基础样例
│   ├── edge-*          # 边界测试
│   ├── sniff-*.txt     # 格式嗅探测试
│   └── test-parse.js   # 解析器测试套件
└── README.md
```

整个项目就是一个 HTML 文件——解析器、生成器、UI 全用原生 JavaScript 实现，Tailwind CSS 从 CDN 加载。

### 🔧 开发

无需构建工具，直接编辑 `index.html` 后刷新浏览器即可。

运行测试套件：

```bash
node test/test-parse.js
```

### 🚀 部署

纯静态站点，可部署到任何静态文件服务器：

```bash
git push origin main
```

### 📄 许可

MIT

---

## English

### ✨ Features

- **6 formats, any direction** — VTT · SRT · ASS · SSA · LRC · SBV, convert bidirectionally
- **Batch processing** — add multiple files, select target format, convert all at once
- **ZIP download** — pack all converted files into a single archive
- **Format sniffing** — files with unknown extensions (`.txt`) are auto-detected by content
- **Live preview** — side-by-side source and converted output
- **Fully client-side** — your files never leave your machine
- **Bilingual UI** — auto-detects browser language, manually toggle at top-right

### 🎬 Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| **VTT** | `.vtt` | WebVTT (HTML5 video) |
| **SRT** | `.srt` | SubRip (most common subtitle format) |
| **ASS** | `.ass` | Advanced SubStation Alpha (styled subtitles) |
| **SSA** | `.ssa` | SubStation Alpha (legacy format) |
| **LRC** | `.lrc` | Lyric format (music players) |
| **SBV** | `.sbv` | YouTube caption format |

### 📖 Usage

1. Open `index.html` in any modern browser
2. Drag & drop subtitle files or click to select
3. Choose the desired output format
4. Click **Convert All** or convert files individually
5. Preview results side-by-side
6. Click **Download ZIP** to get all converted files

#### Keyboard Shortcut

- `Ctrl+Enter` — quickly convert all pending files

#### Format Sniffing

Files with a `.txt` extension or unrecognized extension are automatically identified by content analysis:

- `WEBVTT` header → VTT
- `[Script Info]` header → ASS / SSA
- `[MM:SS.xx]` pattern → LRC
- Number + `-->` timestamp → SRT
- `H:MM:SS.mmm` pattern → SBV

#### Language Auto-detection

On first visit, the UI language is determined by `navigator.language` — uses Chinese if it starts with `zh`, English otherwise. The preference is saved in `localStorage` and can be toggled at any time via the button in the top-right corner.

### 🧪 Test Files

The `test/` directory includes sample files for every format plus edge cases:

| File | What It Tests |
|------|---------------|
| `sample.*` | Basic format coverage |
| `cue-id.vtt` | VTT with numeric/text cue identifiers |
| `edge-vtt.vtt` | VTT with NOTE and STYLE blocks |
| `edge-srt.srt` | SRT with HTML tags inside text |
| `special.srt` | Unicode, emoji, special characters |
| `arrow-sbv.sbv` | SBV using VTT-style `-->` timestamps |
| `style-comment.ass` | ASS with multiple styles and Comment events |
| `multi-ts.lrc` | LRC with multiple timestamps per line |
| `multi-lrc.lrc` | Plain multi-line LRC |
| `word-lrc.lrc` | LRC with word-level `<MM:SS.xx>` timestamps |
| `sniff-*.txt` | Format detection via content sniffing |

### 📁 Project Structure

```
subconverter/
├── index.html          # Single-file app (parser + generator + UI)
├── test/
│   ├── sample.*        # Basic samples for each format
│   ├── edge-*          # Edge case files
│   ├── sniff-*.txt     # Format sniffing test files
│   └── test-parse.js   # Parser test suite
└── README.md
```

Everything is in a single HTML file — the parser, generator, and UI are all vanilla JavaScript with Tailwind CSS (loaded from CDN).

### 🔧 Development

No build tools required. Just edit `index.html` and refresh the browser.

To run the test suite:

```bash
node test/test-parse.js
```

### 🚀 Deployment

This is a static site. Deploy to GitHub Pages, Netlify, Vercel, or any static file server:

```bash
git push origin main
```

### 📄 License

MIT
