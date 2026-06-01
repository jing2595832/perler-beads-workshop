// 单个作品 API
// 获取作品详情 / 更新点赞数 / 删除作品

export async function onRequestGet(context) {
  const { env, params } = context;
  const { id } = params;
  
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM community_works WHERE id = ?'
    ).bind(id).first();
    
    if (!result) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '作品不存在' 
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    // 解析 JSON 字段
    const work = {
      ...result,
      grid: JSON.parse(result.grid),
      colors: JSON.parse(result.colors)
    };
    
    // 增加浏览数（异步，不阻塞响应）
    env.DB.prepare(
      'UPDATE community_works SET views = views + 1 WHERE id = ?'
    ).bind(id).run().catch(() => {});
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: work 
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

// 更新作品（点赞等）
export async function onRequestPost(context) {
  const { env, params, request } = context;
  const { id } = params;
  
  try {
    const body = await request.json();
    
    if (body.action === 'like') {
      await env.DB.prepare(
        'UPDATE community_works SET likes = likes + 1 WHERE id = ?'
      ).bind(id).run();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: '点赞成功' 
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: '未知操作' 
    }), {
      status: 400,
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
