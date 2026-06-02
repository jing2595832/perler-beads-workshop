# 拼豆豆工坊 - 部署指南

## 快速部署到 Cloudflare Pages

### 方式一：GitHub 自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   cd perler-beads-workshop
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/perler-beads-workshop.git
   git push -u origin main
   ```

2. **连接 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 **Pages** → **创建项目** → **连接到 Git**
   - 选择你的 GitHub 仓库

3. **配置构建设置**
   | 设置项 | 值 |
   |--------|-----|
   | 项目名称 | `perler-beads-workshop` |
   | 生产分支 | `main` |
   | 构建命令 | `npm run build` |
   | 构建输出目录 | `dist` |

4. **部署完成！**
   - Cloudflare 会自动分配一个 `.pages.dev` 域名
   - 每次推送到 main 分支会自动部署

### 方式二：手动部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 部署 dist 文件夹到 Cloudflare Pages
# (通过 Cloudflare Dashboard 上传或使用 wrangler)
```

---

## 用户作品投稿系统

### 当前状态
- ✅ 用户可以在设计工具中创作并分享作品
- ✅ 作品保存到浏览器 localStorage
- ✅ 可生成分享链接

### 可选：部署云端存储（Cloudflare Workers + KV）

如需作品永久保存和跨设备访问：

1. 安装 Wrangler CLI
   ```bash
   npm install -g wrangler
   ```

2. 登录 Cloudflare
   ```bash
   npx wrangler login
   ```

3. 创建 KV 命名空间
   ```bash
   npx wrangler kv:namespace create "perler_works"
   ```

4. 更新 `wrangler.toml` 中的 KV ID

5. 部署
   ```bash
   npx wrangler deploy
   ```

**成本：完全免费**（Cloudflare 免费额度足够个人使用）

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:4321

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 项目结构

```
perler-beads-workshop/
├── src/
│   ├── components/      # 组件 (Header, Footer, PatternCard, etc.)
│   ├── layouts/         # 页面布局
│   ├── pages/          # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── patterns/       # 图纸库
│   │   ├── design.astro    # 设计工具
│   │   ├── design/[id].astro # 作品详情
│   │   ├── tutorials/       # 教程
│   │   ├── community.astro # 社区
│   │   ├── about.astro     # 关于我们
│   │   ├── contact.astro   # 联系我们
│   │   ├── privacy.astro    # 隐私政策
│   │   ├── terms.astro     # 使用条款
│   │   └── 404.astro       # 404页面
│   ├── data/            # 数据文件
│   └── env.d.ts         # 环境类型
├── public/
│   ├── patterns/        # 图纸图片 (113张PNG)
│   ├── images/          # 图片资源
│   └── favicon.ico      # 网站图标
├── functions/           # Cloudflare Functions (API)
├── astro.config.mjs     # Astro 配置
├── tailwind.config.mjs  # Tailwind CSS 配置
└── package.json         # 依赖管理
```

---

## 注意事项

### 图纸图片
113张图纸 PNG 文件已放在 `public/patterns/` 目录。如果需要更新：
- 将新图片复制到 `public/patterns/` 目录
- 确保文件名与 `src/data/patterns.ts` 中的 `filename` 字段匹配

### 环境变量
Cloudflare Pages 会自动注入环境变量，无需手动配置。

### 自定义域名
1. 进入 Cloudflare Pages 项目设置
2. 点击 **自定义域**
3. 添加你的域名
4. 按照提示配置 DNS

---

**最后更新**: 2024年1月
