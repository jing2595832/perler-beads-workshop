# 图纸资源

## 需要手动复制的文件

请将以下文件夹中的所有PNG图纸文件复制到本目录：

**源目录：**
```
d:/工作文件夹/自制软件/网站设计测试/拼豆豆网站设计/拼豆豆原创图纸/
```

**目标目录：**
```
d:/工作文件夹/自制软件/网站设计测试/拼豆豆网站设计/perler-beads-workshop/public/patterns/
```

## 操作步骤

### Windows 命令行：
```cmd
copy "d:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\拼豆豆原创图纸\*.png" "d:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\perler-beads-workshop\public\patterns\"
```

### 或者手动复制：
1. 打开文件夹 `d:\工作文件夹\自制软件\网站设计测试\拼豆豆网站设计\拼豆豆原创图纸\`
2. 全选所有PNG文件（Ctrl+A）
3. 复制（Ctrl+C）
4. 打开 `perler-beads-workshop\public\patterns\`
5. 粘贴（Ctrl+V）

## 文件列表
应包含 113 个图纸文件，从 01-emoji-heart.png 到 113-advanced-character.png

## Git 提交建议

首次复制图纸后，执行：
```bash
git add public/patterns/
git commit -m "feat: add 113 perler bead pattern images"
```

注意：由于 Git 不适合存储大量二进制文件，建议：
1. 将图纸上传到 Git LFS
2. 或使用 Cloudflare R2 / 其他 CDN 存储图片
3. 或使用 GitHub Releases 分发
