# 部署指南 - 台灣道教廟宇元宇宙

## Vercel 部署步驟

### 1. 準備專案
```bash
# 確保專案可以成功建置
npm run build

# 測試本地開發服務器
npm run dev
```

### 2. 推送到 GitHub
```bash
# 初始化 Git 倉庫
git init

# 添加所有文件
git add .

# 提交變更
git commit -m "Initial commit: Taiwan Temple Metaverse"

# 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/taiwan-temple-metaverse.git
git push -u origin main
```

### 3. 連接 Vercel
1. 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "New Project"
3. 選擇你的 GitHub 倉庫
4. 配置專案設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (預設)
   - **Build Command**: `npm run build` (預設)
   - **Output Directory**: `.next` (預設)

### 4. 環境變數（如果需要）
目前專案不需要環境變數，但如果需要可以添加：
- `NEXT_PUBLIC_APP_NAME`: 應用程式名稱
- `NEXT_PUBLIC_VERSION`: 版本號

### 5. 部署
點擊 "Deploy" 按鈕，Vercel 會自動：
- 安裝依賴
- 執行建置
- 部署到全球 CDN

## 部署後檢查

### 功能測試
1. **載入畫面**: 檢查神聖符號動畫是否正常
2. **3D 場景**: 確認廟宇和扶鸞系統正常顯示
3. **互動功能**: 測試點擊供桌觸發扶鸞儀式
4. **鳳凰乩筆**: 確認乩筆動畫和光效正常
5. **中文文字**: 檢查神諭文字是否正確顯示
6. **UI 控制**: 測試說明面板和控制按鈕

### 效能檢查
- 頁面載入速度
- 3D 場景渲染流暢度
- 記憶體使用情況
- 移動裝置相容性

## 優化建議

### 效能優化
1. **圖片優化**: 使用 WebP 格式
2. **程式碼分割**: 實作動態導入
3. **快取策略**: 配置適當的快取標頭
4. **CDN**: 利用 Vercel 的全球 CDN

### SEO 優化
1. **Meta 標籤**: 添加適當的 meta 資訊
2. **結構化資料**: 實作 JSON-LD
3. **圖片 alt 文字**: 為所有圖片添加描述
4. **網站地圖**: 生成 sitemap.xml

## 故障排除

### 常見問題
1. **建置失敗**: 檢查 TypeScript 錯誤和依賴版本
2. **3D 場景不顯示**: 確認 Three.js 版本相容性
3. **互動無反應**: 檢查事件監聽器設定
4. **效能問題**: 減少多邊形數量和紋理大小

### 除錯工具
- 瀏覽器開發者工具
- Vercel 部署日誌
- Next.js 建置日誌
- Three.js 除錯工具

## 維護指南

### 定期更新
- 依賴套件更新
- 安全修補程式
- 效能優化
- 新功能開發

### 監控
- 網站可用性
- 使用者體驗指標
- 錯誤率監控
- 效能指標追蹤

---

部署完成後，你的台灣道教廟宇元宇宙體驗就可以讓全世界的人們感受扶鸞儀式的神聖力量了！
