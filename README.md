# SubConverter

> 通用字幕格式转换工具｜Universal Subtitle Converter

**🔗 https://subconverter-delta-six.vercel.app/**

---

## 中文

### 支持格式

VTT · SRT · ASS · SSA · LRC · SBV，任意互转。

### 使用方法

1. 拖拽或选择字幕文件
2. 选择输出格式
3. 点击「全部转换」
4. 点击「打包下载」获取 ZIP

快捷键：`Ctrl+Enter` 快速全部转换。

`.txt` 文件会自动嗅探识别格式（WEBVTT / Script Info / 时间戳模式）。

界面根据浏览器语言自动切换中英文，右上角可手动切换。

---

## English

### Supported Formats

VTT · SRT · ASS · SSA · LRC · SBV, convert any direction.

### Usage

1. Drag & drop or select subtitle files
2. Choose output format
3. Click **Convert All**
4. Click **Download ZIP**

Shortcut: `Ctrl+Enter` to convert all at once.

Files with `.txt` extension are auto-detected by content (WEBVTT / Script Info / timestamp patterns).

The UI auto-detects your browser language and can be toggled at top-right.

---

## Test Files

| File | Tests |
|------|-------|
| `sample.*` | Basic samples for all 6 formats |
| `cue-id.vtt` | VTT cue identifiers |
| `edge-vtt.vtt` | VTT NOTE / STYLE blocks |
| `edge-srt.srt` | SRT with HTML tags |
| `special.srt` | Unicode, emoji, special chars |
| `arrow-sbv.sbv` | SBV arrow timestamps |
| `style-comment.ass` | ASS multi-style + comments |
| `multi-ts.lrc` | LRC multi-timestamp |
| `word-lrc.lrc` | LRC word-level timestamps |
| `sniff-*.txt` | Format sniffing |
