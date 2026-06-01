# 拼豆豆工坊 - Cloudflare 部署指南

## 项目结构

```
perler-beads-workshop/
├── src/                    # 源代码
│   ├── pages/             # 页面
│   ├── components/        # 组件
│   ├── data/              # 数据文件
│   └── layouts/           # 布局模板
├── functions/api/         # Cloudflare Pages Functions (API)
├── dist/                  # 构建输出
├── schema.sql             # 数据库表结构
├── wrangler.toml          # Cloudflare 配置
└── astro.config.mjs       # Astro 配置
```

## 部署步骤

### 1. 创建 GitHub 仓库

```bash
# 在 GitHub 创建新仓库，然后推送代码
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/perler-beads-workshop.git
git push -u origin main
```

### 2. 创建 Cloudflare D1 数据库

```bash
# 安装 wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建数据库
wrangler d1 create perler-db

# 记录输出的 database_id，更新到 wrangler.toml
```

### 3. 初始化数据库表

```bash
# 执行 SQL 脚本创建表
wrangler d1 execute perler-db --file=./schema.sql
```

### 4. 更新 wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "perler-db"
database_id = "你的-database-id"
```

### 5. 部署到 Cloudflare Pages

#### 方式一：通过 Wrangler CLI

```bash
# 构建项目
npm run build

# 部署
wrangler pages deploy dist
```

#### 方式二：通过 Git 集成（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** → **创建项目**
3. 连接 GitHub 仓库
4. 构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
5. 添加环境变量（可选）：
   - `NODE_VERSION`: `20`
6. 绑定 D1 数据库：
   - 在设置中添加 D1 绑定，变量名为 `DB`
7. 保存并部署

## API 端点

部署后可通过以下 API 访问数据：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/works` | GET | 获取社区作品列表 |
| `/api/works` | POST | 发布新作品 |
| `/api/works/:id` | GET | 获取单个作品详情 |
| `/api/works/:id` | POST | 点赞作品 |
| `/api/stats` | GET | 获取统计数据 |
| `/api/stats` | POST | 记录图纸下载 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 数据库管理

```bash
# 查看数据库列表
wrangler d1 list

# 执行 SQL 查询
wrangler d1 execute perler-db --command="SELECT * FROM community_works"

# 备份数据库
wrangler d1 export perler-db --output=./backup.sql

# 导入数据
wrangler d1 execute perler-db --file=./backup.sql
```

## 注意事项

1. **免费版限制**：
   - 每日 50,000 次读取
   - 每日 5,000 次写入
   - 足够小型网站使用

2. **图片存储**：
   - 图纸图片存储在 `public/patterns/`
   - 构建后会自动包含在部署包中

3. **数据持久化**：
   - 社区作品优先保存到 D1 数据库
   - 同时保留 localStorage 作为离线缓存

## 故障排除

### 构建失败

```bash
# 清理缓存重新构建
rm -rf dist node_modules .astro
npm install
npm run build
```

### API 返回 500 错误

检查 D1 数据库绑定是否正确配置在 wrangler.toml 中。

### 图片无法加载

确保 `public/patterns/` 目录下的图片已正确提交到 Git。

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 按照提示配置 DNS 记录
3. 启用 HTTPS（自动）

---

如有问题，请查看 [Cloudflare 文档](https://developers.cloudflare.com/pages/) 或提交 Issue。
