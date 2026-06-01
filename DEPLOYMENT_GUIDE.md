# 拼豆豆工坊 - 完整部署指南

## 📋 目录

1. [项目概述](#项目概述)
2. [本地开发](#本地开发)
3. [生产部署](#生产部署)
4. [域名配置](#域名配置)
5. [SEO优化](#seo优化)
6. [故障排查](#故障排查)

---

## 项目概述

### 技术栈
- **框架**: Astro 6.x
- **UI**: React + Tailwind CSS
- **部署**: Cloudflare Pages (免费)
- **存储**: Cloudflare KV (可选)

### 项目结构
```
perler-beads-workshop/
├── src/
│   ├── components/      # 可复用组件
│   ├── layouts/         # 页面布局
│   ├── pages/           # 页面路由
│   │   ├── index.astro      # 首页
│   │   ├── patterns/        # 图纸库
│   │   ├── design.astro     # 设计工具
│   │   ├── design/[id].astro # 作品详情
│   │   ├── tutorials/       # 教程
│   │   ├── community.astro  # 社区
│   │   ├── about.astro      # 关于我们
│   │   ├── contact.astro    # 联系我们
│   │   ├── privacy.astro    # 隐私政策
│   │   ├── terms.astro      # 使用条款
│   │   └── 404.astro        # 404页面
│   ├── data/            # 数据文件
│   └── styles/          # 全局样式
├── public/              # 静态资源
│   └── patterns/        # 图纸图片 (需手动复制)
├── functions/           # Cloudflare Functions
├── astro.config.mjs     # Astro配置
├── wrangler.toml        # Cloudflare配置
└── package.json         # 依赖管理
```

---

## 本地开发

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/yourusername/perler-beads-workshop.git
cd perler-beads-workshop
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 复制图纸图片
将113张PNG图纸复制到 `public/patterns/` 目录：
```bash
# Windows PowerShell
Copy-Item "D:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\拼豆豆原创图纸\*.png" "public\patterns\"

# 或手动复制
```

#### 4. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:4321`

### 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 检查代码
npm run lint

# 类型检查
npm run typecheck
```

---

## 生产部署

### 方案一：Cloudflare Pages (推荐)

#### 前置准备
1. 注册 [Cloudflare](https://dash.cloudflare.com/sign-up) 账号
2. 将代码推送到 GitHub/GitLab

#### 部署步骤

**第一步：连接Git仓库**

1. 登录 Cloudflare Dashboard
2. 点击左侧菜单 **"Pages"**
3. 点击 **"创建项目"**
4. 选择 **"连接到Git"**
5. 授权并选择你的仓库

**第二步：配置构建设置**

| 设置项 | 值 |
|--------|-----|
| 项目名称 | `perler-beads-workshop` |
| 生产分支 | `main` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |

**第三步：环境变量**

如有需要，添加以下环境变量：
```
NODE_VERSION=18
```

**第四步：保存并部署**

点击 **"保存并部署"**，等待构建完成。

#### 自动部署
- 每次推送到 `main` 分支会自动触发部署
- 预览环境：Pull Request 会自动创建预览链接

---

### 方案二：GitHub Pages

#### 配置步骤

**1. 修改 astro.config.mjs**
```javascript
export default defineConfig({
  output: 'static',
  site: 'https://yourusername.github.io',
  base: '/perler-beads-workshop',
  // ...
});
```

**2. 创建 GitHub Actions**

创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**3. 启用 GitHub Pages**
- 进入仓库 Settings → Pages
- Source 选择 "GitHub Actions"

---

### 方案三：Vercel

#### 部署步骤

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 导入 GitHub 仓库
4. 框架预设选择 "Astro"
5. 点击 "Deploy"

#### 优势
- 自动 HTTPS
- 全球 CDN
- 预览部署

---

## 域名配置

### 使用 Cloudflare 域名

#### 1. 添加自定义域名

1. 进入 Cloudflare Pages 项目
2. 点击 **"自定义域"**
3. 点击 **"设置自定义域"**
4. 输入你的域名，如 `perlerbeads.com`
5. 按照提示添加 DNS 记录

#### 2. DNS 配置示例

在 Cloudflare DNS 中添加：
```
类型: CNAME
名称: @
目标: perler-beads-workshop.pages.dev
代理状态: 已代理 (橙色云)
TTL: 自动
```

#### 3. 强制 HTTPS
- Cloudflare Pages 自动启用 HTTPS
- 在 SSL/TLS 设置中选择 "完全"

---

### 使用其他域名服务商

#### 配置步骤

1. 在域名服务商添加 CNAME 记录：
   ```
   主机记录: @ 或 www
   记录类型: CNAME
   记录值: perler-beads-workshop.pages.dev
   ```

2. 在 Cloudflare Pages 中添加该域名

3. 等待 DNS 传播（通常几分钟到几小时）

---

## SEO优化

### 已实现的SEO功能

#### 1. 基础Meta标签
- ✅ 页面标题 (title)
- ✅ 页面描述 (description)
- ✅ 关键词 (keywords)
- ✅ 作者信息
- ✅ 视口设置

#### 2. Open Graph
- ✅ og:title
- ✅ og:description
- ✅ og:image
- ✅ og:url
- ✅ og:type

#### 3. Twitter Card
- ✅ twitter:card
- ✅ twitter:title
- ✅ twitter:description
- ✅ twitter:image

#### 4. 结构化数据
- ✅ JSON-LD 组织信息
- ✅ JSON-LD 网站信息

#### 5. 其他优化
- ✅ 语义化HTML
- ✅ 图片alt属性
- ✅ 合理的标题层级
- ✅ 404页面
- ✅ 网站地图 (sitemap)

---

### 部署前SEO检查清单

#### 内容检查
- [ ] 所有页面都有独特的 title
- [ ] 所有页面都有 description (120-160字符)
- [ ] 图片都有 alt 属性
- [ ] 链接都能正常访问
- [ ] 没有死链

#### 技术检查
- [ ] robots.txt 配置正确
- [ ] sitemap.xml 已生成
- [ ] 网站加载速度 < 3秒
- [ ] 移动端适配正常
- [ ] HTTPS 已启用

#### 性能优化
- [ ] 图片已压缩
- [ ] 启用 Gzip/Brotli 压缩
- [ ] 静态资源有长期缓存

---

### 生成 Sitemap

安装 sitemap 插件：
```bash
npm install @astrojs/sitemap
```

配置 `astro.config.mjs`：
```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    sitemap({
      customPages: [
        'https://yourdomain.com/',
        'https://yourdomain.com/patterns',
        // ...
      ],
    }),
  ],
});
```

---

## 故障排查

### 常见问题

#### 1. 构建失败
```
Error: Cannot find module 'astro'
```
**解决**: 运行 `npm install`

#### 2. 图片不显示
```
404 /patterns/xxx.png
```
**解决**: 确认图片已复制到 `public/patterns/`

#### 3. 路由404
```
404 /design/xxx
```
**解决**: Cloudflare Pages 需要配置 `_redirects` 文件

创建 `public/_redirects`：
```
/* /index.html 200
```

#### 4. 样式丢失
```
Refused to apply style from '...'
```
**解决**: 检查 `astro.config.mjs` 中的 `base` 配置

---

### 性能优化

#### 图片优化
```bash
# 安装图片优化工具
npm install -g imagemin-cli

# 批量压缩
imagemin public/patterns/*.png --out-dir=public/patterns/
```

#### 启用分析
```bash
# 构建时显示性能报告
npm run build -- --analyze
```

---

## 维护指南

### 定期更新

```bash
# 检查更新
npm outdated

# 更新依赖
npm update

# 安全审计
npm audit
npm audit fix
```

### 备份策略

1. **代码备份**: Git 仓库
2. **图片备份**: 本地 + 云存储
3. **用户数据**: 如使用 KV，定期导出

---

## 联系方式

如有问题，请联系：
- 邮箱: jing2595832@163.com
- GitHub Issues: [项目地址]/issues

---

**最后更新**: 2024年1月
