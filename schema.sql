-- 拼豆豆工坊数据库表结构
-- 用于 Cloudflare D1

-- 社区作品表
CREATE TABLE IF NOT EXISTS community_works (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT DEFAULT '匿名用户',
    description TEXT,
    grid TEXT NOT NULL, -- JSON 格式存储像素数据
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    colors TEXT NOT NULL, -- JSON 格式存储颜色数组
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL, -- Unix 时间戳
    updated_at INTEGER
);

-- 图纸下载统计表
CREATE TABLE IF NOT EXISTS pattern_downloads (
    pattern_id TEXT PRIMARY KEY,
    download_count INTEGER DEFAULT 0,
    last_download_at INTEGER
);

-- 网站访问统计表
CREATE TABLE IF NOT EXISTS site_stats (
    stat_date TEXT PRIMARY KEY, -- YYYY-MM-DD 格式
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    design_tool_uses INTEGER DEFAULT 0
);

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_works_created_at ON community_works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_likes ON community_works(likes DESC);
CREATE INDEX IF NOT EXISTS idx_works_author ON community_works(author);

-- 插入一些示例数据（可选）
-- INSERT INTO community_works (id, title, author, description, grid, width, height, colors, likes, created_at)
-- VALUES (
--     'work_sample_001',
--     '示例作品',
--     '系统',
--     '这是一个示例作品',
--     '[[{"hex":"#FF6B6B"},null],[null,{"hex":"#4ECDC4"}]]',
--     2,
--     2,
--     '["#FF6B6B","#4ECDC4"]',
--     10,
--     1704067200000
-- );
