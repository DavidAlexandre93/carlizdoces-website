const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/_carlizdoces/'

function pickImageUrl(node) {
  return (
    node?.display_url ||
    node?.thumbnail_src ||
    node?.display_src ||
    node?.thumbnail_resources?.[node.thumbnail_resources.length - 1]?.src ||
    ''
  )
}

function mapNode(node) {
  return {
    id: node?.id || node?.shortcode,
    caption: node?.edge_media_to_caption?.edges?.[0]?.node?.text || '',
    permalink: node?.shortcode ? `https://www.instagram.com/p/${node.shortcode}/` : INSTAGRAM_PROFILE_URL,
    imageUrl: pickImageUrl(node),
    timestamp: node?.taken_at_timestamp || null,
  }
}

function parseLegacySharedData(html) {
  const sharedDataMatch = html.match(/window\._sharedData\s*=\s*(\{[\s\S]*?\});<\/script>/)
  if (!sharedDataMatch) return []

  const parsed = JSON.parse(sharedDataMatch[1])
  const edges =
    parsed?.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges || []

  return edges.map((edge) => mapNode(edge.node)).filter((item) => item.id && item.imageUrl)
}

function parseModernData(html) {
  const match = html.match(/"edge_owner_to_timeline_media"\s*:\s*(\{"count"[\s\S]*?\})\s*,\s*"edge_saved_media"/)
  if (!match) return []

  const media = JSON.parse(match[1])
  const edges = media?.edges || []

  return edges.map((edge) => mapNode(edge.node)).filter((item) => item.id && item.imageUrl)
}

export default async function handler(req, res) {
  try {
    const response = await fetch(INSTAGRAM_PROFILE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      throw new Error(`Instagram respondeu com ${response.status}`)
    }

    const html = await response.text()
    const posts = parseLegacySharedData(html)
    const resolvedPosts = posts.length > 0 ? posts : parseModernData(html)

    const items = resolvedPosts.slice(0, 3)

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    res.status(200).json({ items })
  } catch {
    res.status(200).json({
      items: [],
      error: 'Não foi possível carregar as postagens do Instagram no momento.',
    })
  }
}
