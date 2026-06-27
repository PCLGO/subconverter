# SubConverter

> A browser-based universal subtitle format converter. Convert between **VTT, SRT, ASS, SSA, LRC, and SBV** — no server, no upload, all in your browser.

**🌐 Live Demo:** https://pclgo.github.io/subconverter/

---

## Features

- **6 formats, any direction** — VTT · SRT · ASS · SSA · LRC · SBV, convert bidirectionally
- **Batch processing** — add multiple files, select target format, convert all at once
- **ZIP download** — pack all converted files into a single archive
- **Format sniffing** — files with unknown extensions (`.txt`) are auto-detected by content
- **Rich format support** — cue IDs, inline styles, NOTE/STYLE blocks, multi-timestamp lines, word-level timestamps
- **Live preview** — side-by-side source and converted output
- **Fully client-side** — your files never leave your machine

## Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| **VTT** | `.vtt` | WebVTT (HTML5 video) |
| **SRT** | `.srt` | SubRip (most common format) |
| **ASS** | `.ass` | Advanced SubStation Alpha (styled subtitles) |
| **SSA** | `.ssa` | SubStation Alpha (legacy format) |
| **LRC** | `.lrc` | Lyric format (music players) |
| **SBV** | `.sbv` | YouTube caption format |

## Usage

1. Open `index.html` in any modern browser
2. Drag & drop subtitle files or click to select
3. Choose the desired output format
4. Click **Convert All** or convert files individually
5. Preview results side-by-side
6. Click **Download ZIP** to get all converted files

### Keyboard Shortcut

- `Ctrl+Enter` — quickly convert all pending files

### Format Sniffing

Files with a `.txt` extension or any unrecognized extension are automatically identified by content analysis:
- `WEBVTT` header → VTT
- `[Script Info]` header → ASS / SSA
- `[MM:SS.xx]` timestamp pattern → LRC
- Number + timestamp pattern → SRT
- `H:MM:SS.mmm` pattern → SBV

## Test Files

The `test/` directory includes sample files for every format, plus edge cases:

| File | What It Tests |
|------|---------------|
| `sample.vtt/srt/ass/ssa/lrc/sbv` | Basic format coverage |
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

## Project Structure

```
subconverter/
├── index.html          # Single-file application
├── test/
│   ├── sample.*        # Basic samples for each format
│   ├── edge-*          # Edge case files
│   ├── sniff-*.txt     # Format sniffing test files
│   └── test-parse.js   # Parser test suite
└── README.md
```

Everything is in a single HTML file — the parser, generator, and UI are all vanilla JavaScript with Tailwind CSS (loaded from CDN).

## Development

No build tools required. Just edit `index.html` and refresh.

To run the test suite:

```bash
node test/test-parse.js
```

## Deployment

This is a static site. Push to GitHub Pages, Netlify, Vercel, or any static file server.

```bash
git push origin main
```

Enable **GitHub Pages** in your repo settings → Source: `main` branch → root `/`.

## License

MIT
