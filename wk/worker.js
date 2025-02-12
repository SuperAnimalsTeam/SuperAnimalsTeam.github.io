// worker.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  if (request.method === 'POST' && path === '/send') {
    return handleSendMessage(request)
  } else if (request.method === 'GET' && path === '/messages') {
    return handleGetMessages(request)
  } else {
    return new Response('Not Found', { status: 404 })
  }
}

async function handleSendMessage(request) {
  const { message, user } = await request.json()
  const timestamp = Date.now()
  const messageId = `message:${timestamp}`

  await MESSAGES.put(messageId, JSON.stringify({ user, message, timestamp }))

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleGetMessages(request) {
  const messages = await MESSAGES.list()
  const messageList = []

  for (const message of messages.keys) {
    const messageData = await MESSAGES.get(message.name)
    messageList.push(JSON.parse(messageData))
  }

  return new Response(JSON.stringify(messageList), {
    headers: { 'Content-Type': 'application/json' }
  })
}