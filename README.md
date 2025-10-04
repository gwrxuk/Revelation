# 台灣道教廟宇元宇宙 - 扶鸞體驗

一個基於 Three.js 和 Next.js 的台灣傳統道教扶鸞儀式元宇宙體驗。

## 專案特色

### 🏛️ 文化體驗
- **扶鸞儀式**：體驗台灣傳統道教扶鸞文化
- **鳳凰乩筆**：3D 呈現神聖的鳳凰羽毛筆
- **神聖文字**：繁體中文書法效果渲染

### 🎨 技術特色
- **Three.js 3D 場景**：完整的廟宇 3D 環境
- **React Three Fiber**：現代化的 3D 開發框架
- **互動體驗**：點擊觸發扶鸞儀式
- **視覺效果**：神聖光暈、粒子系統、後處理效果

### 🚀 部署就緒
- **Vercel 優化**：專為 Vercel 平台優化
- **AI 神諭**：整合 OpenAI GPT 生成動態神諭
- **響應式設計**：支援各種裝置
- **效能優化**：載入優化與動畫流暢度

## 技術架構

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主頁面
├── components/            # React 組件
│   ├── TempleScene.tsx    # 主 3D 場景
│   ├── Temple.tsx         # 廟宇 3D 模型
│   ├── FuluSystem.tsx     # 扶鸞系統
│   ├── PhoenixBrush.tsx   # 鳳凰乩筆
│   ├── ChineseTextRenderer.tsx # 中文文字渲染
│   ├── LoadingScreen.tsx  # 載入畫面
│   └── UIOverlay.tsx      # UI 覆蓋層
├── package.json           # 專案依賴
├── next.config.js         # Next.js 配置
├── tsconfig.json          # TypeScript 配置
└── vercel.json           # Vercel 部署配置
```

## 安裝與運行

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 開啟 http://localhost:3000
```

### 部署到 Vercel
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel

# 或直接推送到 GitHub 並連接 Vercel
```

### 環境變數配置
在 Vercel 專案設定中添加環境變數：
```
OPENAI_API_KEY=your_openai_api_key_here
```

**注意**：沒有 API Key 時會自動使用預設神諭，不影響基本功能。

## 文化背景

### 扶鸞的意義
「扶鸞」一詞字面意為「扶持鳳凰」，其中「鳳凰」指的是乩筆，這是一種詩意的說法，比喻此工具為鳳凰羽毛筆。鳳凰象徵神靈，透過乩筆來書寫神諭，指引眾生。

### 台灣道教文化
扶鸞儀式是台灣道教文化的重要組成部分，體現了人神溝通的傳統智慧與精神信仰。在現代科技與傳統文化的結合下，這個元宇宙體驗讓更多人能夠了解並感受這份神聖的文化遺產。

## 互動方式

1. **點擊供桌**：開始扶鸞儀式
2. **AI 生成神諭**：每次都有不同的智慧指引
3. **觀察鳳凰乩筆**：欣賞神聖的動畫效果
4. **閱讀神諭**：感受神靈降臨的文字
5. **3D 導航**：使用鍵盤滑鼠自由探索
6. **文化學習**：了解扶鸞的歷史與意義

## 技術依賴

- **Next.js 14**：React 全端框架
- **Three.js**：3D 圖形庫
- **React Three Fiber**：Three.js 的 React 渲染器
- **@react-three/drei**：Three.js 輔助庫
- **@react-three/postprocessing**：後處理效果
- **TypeScript**：型別安全

## 瀏覽器支援

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 授權

本專案僅供學習與文化推廣使用。

---

體驗台灣傳統道教文化的神聖力量，感受鳳凰乩筆的智慧指引。
