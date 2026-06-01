# GitHub 自动部署配置指南

## 概述
配置完成后，每次推送代码到GitHub，网站将自动部署到Cloudflare Pages。

## 配置步骤

### 步骤 1：在Cloudflare创建API Token

1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击"创建令牌" → "开始使用"（自定义令牌）
3. 填写以下信息：
   - **令牌名称**：`GitHub Actions Deploy`
   - **资源**：选择"帐户"
   - **权限**：选择以下权限：
     - `Cloudflare Pages:Edit`（编辑Cloudflare Pages）
     - `Account:Read`（读取帐户信息）
   - **帐户资源**：选择您的帐户

4. 点击"继续以显示摘要" → "创建令牌"
5. **复制生成的Token**（只显示一次，请保存好）

### 步骤 2：在GitHub配置Secrets

1. 访问您的GitHub仓库：
   ```
   https://github.com/您的用户名/perler-beads-workshop/settings/secrets/actions
   ```

2. 点击"New repository secret"，添加以下两个Secrets：

   **第一个Secret：**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 刚才复制的Cloudflare API Token

   **第二个Secret：**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: `243a88b11027802a7ca7e78830726236`

### 步骤 3：推送代码触发部署

在本地终端运行：
```bash
cd "D:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\perler-beads-workshop"
git add .
git commit -m "配置GitHub自动部署"
git push origin main
```

### 步骤 4：查看部署状态

1. 访问GitHub仓库的Actions页面：
   ```
   https://github.com/您的用户名/perler-beads-workshop/actions
   ```

2. 您将看到部署进度，成功后网站将自动更新

## 部署后的网站地址

- 主站点：https://perler-beads-workshop.pages.dev

## 注意事项

1. **API Token安全**：不要泄露您的API Token，它拥有对Cloudflare账户的访问权限
2. **D1数据库**：部署后需要在Cloudflare Dashboard手动绑定D1数据库
   - 进入 Workers & Pages → perler-beads-workshop → 设置 → Functions
   - 添加D1数据库绑定：变量名 `DB`，数据库选择 `perler-beads-db`
3. **自动部署**：配置完成后，每次推送到main分支都会自动触发部署

## 故障排除

如果部署失败，请检查：
1. Secrets是否正确配置
2. API Token是否有Cloudflare Pages编辑权限
3. GitHub Actions日志中的错误信息
