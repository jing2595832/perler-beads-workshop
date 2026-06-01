// 统计 API
// 图纸下载统计 / 网站访问统计

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // 获取总作品数
    const worksResult = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM community_works'
    ).first();
    
    // 获取总点赞数
    const likesResult = await env.DB.prepare(
      'SELECT SUM(likes) as total FROM community_works'
    ).first();
    
    // 获取热门作品
    const { results: popularWorks } = await env.DB.prepare(
      'SELECT id, title, author, likes, views FROM community_works ORDER BY likes DESC LIMIT 5'
    ).all();
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        totalWorks: worksResult?.count || 0,
        totalLikes: likesResult?.total || 0,
        popularWorks: popularWorks || []
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}

// 记录图纸下载
export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const body = await request.json();
    const { patternId } = body;
    
    if (!patternId) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少 patternId'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    const now = Date.now();
    
    // 使用 INSERT OR REPLACE 语法（SQLite 语法）
    await env.DB.prepare(`
      INSERT INTO pattern_downloads (pattern_id, download_count, last_download_at)
      VALUES (?, 1, ?)
      ON CONFLICT(pattern_id) DO UPDATE SET
        download_count = download_count + 1,
        last_download_at = excluded.last_download_at
    `).bind(patternId, now).run();
    
    return new Response(JSON.stringify({
      success: true,
      message: '下载记录已更新'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}

// 处理 OPTIONS 请求
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
