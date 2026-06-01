# 🚀 部署检查清单

## 前置条件

- [ ] GitHub 账号
- [ ] Cloudflare 账号
- [ ] 已购买域名（可选）

---

## 第一步：本地准备

### 1.1 复制图纸图片

```bash
# Windows PowerShell
copy "d:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\拼豆豆原创图纸\*.png" "d:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\perler-beads-workshop\public\patterns\"
```

验证：
```bash
ls public/patterns/*.png | wc -l
# 应显示 113
```

### 1.2 本地测试

```bash
npm run dev
```

检查：
- [ ] 首页正常显示
- [ ] 图纸库显示113个图纸
- [ ] 图纸详情页可访问
- [ ] 下载按钮可用
- [ ] 所有页面无404错误

### 1.3 构建测试

```bash
npm run build
```

检查：
- [ ] 构建成功，无错误
- [ ] `dist/` 目录生成
- [ ] `dist/patterns/` 包含所有图片

---

## 第二步：GitHub 仓库

### 2.1 初始化 Git（如未初始化）

```bash
git init
git add .
git commit -m "Initial commit: Perler Beads Workshop"
```

### 2.2 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`perler-beads-workshop`
3. 设置为 Public
4. 不要初始化 README（已存在）

### 2.3 推送代码

```bash
git remote add origin https://github.com/YOUR_USERNAME/perler-beads-workshop.git
git branch -M main
git push -u origin main
```

---

## 第三步：Cloudflare Pages 部署

### 3.1 创建 Pages 项目

1. 登录 https://dash.cloudflare.com
2. 点击左侧菜单 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**

### 3.2 连接 GitHub

1. 授权 Cloudflare 访问 GitHub
2. 选择 `perler-beads-workshop` 仓库
3. 点击 **Begin setup**

### 3.3 构建设置

| 设置项 | 值 |
|--------|-----|
| Project name | perler-beads-workshop |
| Production branch | main |
| Build command | `npm run build` |
| Build output directory | `dist` |

### 3.4 环境变量

添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `NODE_VERSION` | 18 |

### 3.5 保存并部署

点击 **Save and Deploy**

等待构建完成...

---

## 第四步：自定义域名（可选）

### 4.1 添加自定义域名

1. 在 Cloudflare Pages 项目设置中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名，例如：`perlerworkshop.com`
4. 按照提示添加 DNS 记录

### 4.2 配置 DNS

在 Cloudflare DNS 设置中添加：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|---------|
| CNAME | @ | perler-beads-workshop.pages.dev | 已代理 |
| CNAME | www | perler-beads-workshop.pages.dev | 已代理 |

---

## 第五步：验证部署

### 5.1 功能测试

访问你的网站，检查：

- [ ] 首页加载正常
- [ ] 所有图片显示正确
- [ ] 图纸下载功能正常
- [ ] 页面切换流畅
- [ ] 移动端显示正常

### 5.2 SEO 检查

- [ ] 页面标题正确
- [ ] meta description 存在
- [ ] Open Graph 标签正确
- [ ] 网站可被搜索引擎索引

### 5.3 性能检查

使用 Lighthouse 检查：
- [ ] Performance > 80
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

---

## 第六步：后续维护

### 6.1 自动部署

每次推送到 `main` 分支，Cloudflare 会自动重新部署。

### 6.2 添加新图纸

1. 将新图纸 PNG 文件放入 `public/patterns/`
2. 在 `src/data/patterns.ts` 中添加图纸数据
3. 提交并推送：`git add . && git commit -m "feat: add new patterns" && git push`

### 6.3 监控

在 Cloudflare Dashboard 查看：
- 网站访问量
- 错误率
- 性能指标

---

## 常见问题

### Q: 构建失败，提示 "patterns not found"

A: 确保 `public/patterns/` 目录包含所有113张图片，并已提交到 Git。

### Q: 图片显示404

A: 检查图片路径是否正确，应为 `/patterns/filename.png`。

### Q: 中文显示乱码

A: 确保 HTML 文件设置了正确的 charset：`<meta charset="UTF-8">`。

### Q: 如何更新网站？

A: 修改代码后，执行 `git add . && git commit -m "update" && git push`，Cloudflare 会自动重新部署。

---

## 联系方式

如有部署问题，请联系：
- 邮箱：jing2595832@163.com
