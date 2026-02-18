function createClient(url, key, options = {}) {
  const supabaseUrl = (url || '').replace(/\/$/, '')
  const supabaseAnonKey = key || ''
  const globalHeaders = options.global?.headers || {}

  const buildHeaders = () => ({
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    ...globalHeaders,
  })

  class PostgrestQuery {
    constructor(table, method = 'GET') {
      this.table = table
      this.method = method
      this.selectColumns = '*'
      this.filters = []
      this.head = false
      this.wantExactCount = false
      this.payload = null
      this.onConflict = ''
      this.singleMode = null
    }

    select(columns = '*', optionsArg = {}) {
      this.selectColumns = columns
      this.head = optionsArg.head === true
      this.wantExactCount = optionsArg.count === 'exact'
      this.method = this.head ? 'HEAD' : 'GET'
      return this
    }

    insert(payload) {
      this.method = 'POST'
      this.payload = payload
      return this
    }

    upsert(payload, optionsArg = {}) {
      this.method = 'POST'
      this.payload = payload
      this.onConflict = optionsArg.onConflict || ''
      return this
    }

    delete() {
      this.method = 'DELETE'
      return this
    }

    eq(column, value) {
      this.filters.push([column, `eq.${value}`])
      return this
    }

    in(column, values = []) {
      const encoded = values.map((value) => `${value}`.replace(/,/g, '\\,')).join(',')
      this.filters.push([column, `in.(${encoded})`])
      return this
    }

    limit(value) {
      this.filters.push(['limit', `${value}`])
      return this
    }

    maybeSingle() {
      this.singleMode = 'maybe-single'
      this.limit(1)
      return this
    }

    then(resolve, reject) {
      return this.execute().then(resolve, reject)
    }

    async execute() {
      if (!supabaseUrl || !supabaseAnonKey) {
        return {
          data: null,
          count: null,
          error: {
            message: 'Supabase não configurado. Defina REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY (ou REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT).',
          },
        }
      }

      const requestUrl = new URL(`${supabaseUrl}/rest/v1/${this.table}`)

      if (this.method === 'GET' || this.method === 'HEAD') {
        requestUrl.searchParams.set('select', this.selectColumns)
      }

      if (this.onConflict) {
        requestUrl.searchParams.set('on_conflict', this.onConflict)
      }

      this.filters.forEach(([column, expression]) => {
        requestUrl.searchParams.append(column, expression)
      })

      const headers = buildHeaders()
      const preferHeaders = []

      if (this.wantExactCount) {
        preferHeaders.push('count=exact')
      }

      if (this.onConflict) {
        preferHeaders.push('resolution=merge-duplicates')
      }

      if (preferHeaders.length > 0) {
        headers.Prefer = preferHeaders.join(',')
      }

      if (this.method === 'POST') {
        headers['Content-Type'] = 'application/json'
      }

      const response = await fetch(requestUrl.toString(), {
        method: this.method,
        headers,
        body: this.method === 'POST' ? JSON.stringify(this.payload) : undefined,
      })

      const contentRange = response.headers.get('content-range') || ''
      const countMatch = contentRange.match(/\/(\d+)$/)
      const count = countMatch ? Number(countMatch[1]) : null

      if (!response.ok) {
        let errorPayload = null

        try {
          errorPayload = await response.json()
        } catch {
          errorPayload = { message: response.statusText }
        }

        return { data: null, count, error: errorPayload }
      }

      if (this.method === 'HEAD' || response.status === 204) {
        return { data: null, count, error: null }
      }

      const data = await response.json()

      if (this.singleMode === 'maybe-single') {
        if (Array.isArray(data)) {
          return { data: data[0] ?? null, count, error: null }
        }

        return { data: data ?? null, count, error: null }
      }

      return { data, count, error: null }
    }
  }

  return {
    from(table) {
      return new PostgrestQuery(table)
    },
  }
}

function getOrCreateDeviceId() {
  const key = 'device_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id =
      (window.crypto?.randomUUID && window.crypto.randomUUID())
      || `dev_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    localStorage.setItem(key, id)
  }
  return id
}

export const deviceId = getOrCreateDeviceId()

const env = globalThis?.process?.env || {}

const SUPABASE_URL =
  env.REACT_APP_SUPABASE_URL
  || ''

const SUPABASE_PUBLISHABLE_DEFAULT_KEY =
  env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  || env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT
  || ''

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    global: {
      headers: { 'x-device-id': deviceId },
    },
  },
)
