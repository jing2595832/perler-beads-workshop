// 社区作品 API
// 获取作品列表 / 创建新作品

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // 获取查询参数
    const url = new URL(context.request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const sort = url.searchParams.get('sort') || 'newest'; // newest, popular
    
    // 构建查询
    let query = 'SELECT * FROM community_works';
    
    if (sort === 'popular') {
      query += ' ORDER BY likes DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    query += ' LIMIT ? OFFSET ?';
    
    const { results } = await env.DB.prepare(query)
      .bind(limit, offset)
      .all();
    
    // 解析 JSON 字段
    const works = results.map(work => ({
      ...work,
      grid: JSON.parse(work.grid),
      colors: JSON.parse(work.colors)
    }));
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: works,
      pagination: { limit, offset }
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

export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const work = await request.json();
    
    // 验证必填字段
    if (!work.id || !work.title || !work.grid) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '缺少必填字段' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    const now = Date.now();
    
    await env.DB.prepare(`
      INSERT INTO community_works 
      (id, title, author, description, grid, width, height, colors, likes, views, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).bind(
      work.id,
      work.title,
      work.author || '匿名用户',
      work.description || '',
      JSON.stringify(work.grid),
      work.width || 20,
      work.height || 20,
      JSON.stringify(work.colors || []),
      now,
      now
    ).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: '作品发布成功',
      id: work.id
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

// 处理 OPTIONS 请求（CORS 预检）
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
