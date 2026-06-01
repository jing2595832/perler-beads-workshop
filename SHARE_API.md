# 用户投稿系统部署指南

## 功能说明

用户可以在设计工具中将自己的作品投稿到社区，其他用户可以查看和点赞。

## 当前状态

### 已实现的功能（无需额外部署）
- ✅ 设计工具中添加"分享作品"按钮
- ✅ 生成可分享的链接
- ✅ 导出JSON格式
- ✅ 作品详情页
- ✅ 社区页面展示用户作品
- ✅ 点赞功能
- ✅ 本地存储（localStorage）

### 可选功能（需要部署API）
- ☁️ 云端存储（Cloudflare Workers + KV）
- 🔗 永久分享链接
- 📊 跨设备访问

---

## 快速开始（无需部署）

### 分享作品
1. 在设计工具中完成作品
2. 点击 **"🌐 分享作品"** 按钮
3. 填写作品信息
4. 选择 **"复制分享链接"** 或 **"发布到社区"**

### 分享链接工作原理
- 作品数据通过 Base64 编码嵌入 URL
- 任何人打开链接都可以查看作品
- 无需登录或注册

---

## 可选：部署云端存储

如果想让作品永久保存，可以部署 Cloudflare Workers API。

### 前置要求
- Cloudflare 账号（免费）
- Node.js 已安装

### 部署步骤

#### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare
```bash
npx wrangler login
```
浏览器会打开，按提示授权。

#### 3. 创建 KV 命名空间
```bash
cd perler-beads-workshop
npx wrangler kv:namespace create "perler_works"
```

会输出类似：
```
{ binding = "PERLER_WORKS", id = "xxxxxxxxxxxxxxxx" }
```

#### 4. 更新配置文件
编辑 `wrangler.toml`，将 `YOUR_KV_NAMESPACE_ID` 替换为上一步返回的 id：

```toml
kv_namespaces = [
  { binding = "PERLER_WORKS", id = "xxxxxxxxxxxxxxxx" }
]
```

#### 5. 部署 API
```bash
npx wrangler deploy
```

部署成功后，API 地址为：
```
https://perler-works-api.<your-subdomain>.workers.dev/api/works
```

#### 6. 更新前端代码
修改 `src/pages/design.astro` 中的 API 地址为你的实际地址。

---

## API 文档

### 获取作品列表
```
GET /api/works
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123_12345",
      "title": "我的作品",
      "author": "用户昵称",
      "width": 20,
      "height": 20,
      "grid": [[...]],
      "likes": 5,
      "views": 10,
      "createdAt": 1234567890
    }
  ],
  "total": 1
}
```

### 发布作品
```
POST /api/works
Content-Type: application/json

{
  "title": "作品名称",
  "author": "作者昵称",
  "description": "作品描述",
  "width": 20,
  "height": 20,
  "grid": [[...]],
  "colors": ["#FF6B6B", "#4ECDC4"]
}
```

### 获取单个作品
```
GET /api/works/{id}
```

### 点赞作品
```
POST /api/works/{id}/like
```

---

## 成本说明

### Cloudflare 免费额度
| 服务 | 免费额度 | 本项目用量 |
|------|----------|-----------|
| Workers | 100,000 请求/天 | ~100/月 |
| KV 读取 | 100,000 次/天 | ~1000/月 |
| KV 写入 | 1,000 次/天 | ~10/月 |
| KV 存储 | 1 GB | <1 MB |

**完全免费！**

---

## 常见问题

### Q: 部署后本地存储的作品还在吗？
A: 在的。系统会同时显示本地存储和云端的作品。

### Q: 可以删除自己的作品吗？
A: 目前 API 不支持删除。计划在后台添加管理功能。

### Q: 分享链接会过期吗？
A: 
- Base64 链接：永久有效
- Cloudflare KV：除非手动删除，否则永久保存

### Q: 如何添加图片上传功能？
A: 需要额外的存储服务，如：
- Cloudflare Images
- Cloudflare R2
- AWS S3
- Imgur 匿名上传

请联系开发者添加此功能。
