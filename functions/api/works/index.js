/**
 * Cloudflare Worker - 获取作品列表API
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export async function onRequest({ env, params, request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 获取作品列表
  if (request.method === 'GET') {
    try {
      const list = await env.PERLER_WORKS.list();
      const works = [];

      for (const key of list.keys) {
        const work = await env.PERLER_WORKS.get(key.name, 'json');
        if (work) {
          works.push(work);
        }
      }

      // 按时间倒序
      works.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      return new Response(JSON.stringify({
        success: true,
        data: works,
        total: works.length
      }), {
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: corsHeaders
  });
}
