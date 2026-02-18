const DEVICE_ID_STORAGE_KEY = 'device_id'

function createDeviceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `dev_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

function getOrCreateDeviceId() {
  if (typeof window === 'undefined') {
    return 'server-device'
  }

  try {
    const storedDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY)
    if (storedDeviceId) {
      return storedDeviceId
    }

    const nextDeviceId = createDeviceId()
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, nextDeviceId)
    return nextDeviceId
  } catch {
    return createDeviceId()
  }
}

const env = globalThis?.process?.env || {}

const supabaseUrl = (
  env.REACT_APP_SUPABASE_URL
  || env.VITE_SUPABASE_URL
  || import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.REACT_APP_SUPABASE_URL
  || ''
).replace(/\/$/, '')

const supabaseAnonKey = (
  env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  || env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  || ''
)

export const deviceId = getOrCreateDeviceId()

console.log('deviceId:', deviceId)
console.log('SUPABASE URL:', env.REACT_APP_SUPABASE_URL || env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL)
console.log('SUPABASE KEY:', (env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '').slice(0, 20))

const buildHeaders = () => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'x-device-id': deviceId,
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

  select(columns = '*', options = {}) {
    this.selectColumns = columns
    this.head = options.head === true
    this.wantExactCount = options.count === 'exact'
    this.method = this.head ? 'HEAD' : 'GET'
    return this
  }

  insert(payload) {
    this.method = 'POST'
    this.payload = payload
    return this
  }

  upsert(payload, options = {}) {
    this.method = 'POST'
    this.payload = payload
    this.onConflict = options.onConflict || ''
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
          message: 'Supabase não configurado. Defina VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ou REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY.',
        },
      }
    }

    const url = new URL(`${supabaseUrl}/rest/v1/${this.table}`)

    if (this.method === 'GET' || this.method === 'HEAD') {
      url.searchParams.set('select', this.selectColumns)
    }

    if (this.onConflict) {
      url.searchParams.set('on_conflict', this.onConflict)
    }

    this.filters.forEach(([column, expression]) => {
      url.searchParams.append(column, expression)
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

    const response = await fetch(url.toString(), {
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

      return {
        data: null,
        count,
        error: errorPayload,
      }
    }

    if (this.method === 'HEAD' || response.status === 204) {
      return { data: null, count, error: null }
    }

    const data = await response.json()

    if (this.singleMode === 'maybe-single') {
      if (Array.isArray(data)) {
        return {
          data: data[0] ?? null,
          count,
          error: null,
        }
      }

      return {
        data: data ?? null,
        count,
        error: null,
      }
    }

    return { data, count, error: null }
  }
}

export const supabase = {
  from(table) {
    return new PostgrestQuery(table)
  },
}
