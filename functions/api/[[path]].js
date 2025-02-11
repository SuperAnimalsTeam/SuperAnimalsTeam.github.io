export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '');

    // 处理消息
    if (path === 'messages') {
        if (request.method === 'GET') {
            // 获取消息
            const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100').all();
            return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
        } else if (request.method === 'POST') {
            // 发送消息
            const { text, sender } = await request.json();
            await env.DB.prepare('INSERT INTO messages (text, sender, timestamp) VALUES (?, ?, ?)')
                .bind(text, sender, Date.now())
                .run();
            return new Response('Message sent', { status: 200 });
        }
    }

    return new Response('Not found', { status: 404 });
}