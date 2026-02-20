function createClient(url, key, options = {}) {
  const supabaseUrl = (url || '').replace(/\/$/, '');
  const supabaseAnonKey = key || '';

  const globalHeaders = options.global?.headers || {};

  // Encode seguro para filtros PostgREST (evita quebrar com espaços/símbolos)
  const encodeFilterValue = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return '';
    // PostgREST aceita valores "crus", mas URL precisa estar segura
    // Mantém vírgulas escapadas no in(), e aqui encode normal.
    return encodeURIComponent(String(value));
  };

  const buildHeaders = () => ({
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    Accept: 'application/json',
    ...globalHeaders,
  });

  class PostgrestQuery {
    constructor(table, method = 'GET') {
      this.table = table;
      this.method = method;

      this.selectColumns = '*';
      this.filters = [];
      this.head = false;
      this.wantExactCount = false;

      this.payload = null;

      this.onConflict = '';
      this.singleMode = null;

      // Para update no futuro
      this.isPatch = false;
    }

    select(columns = '*', optionsArg = {}) {
      this.selectColumns = columns;
      this.head = optionsArg.head === true;
      this.wantExactCount = optionsArg.count === 'exact';
      this.method = this.head ? 'HEAD' : 'GET';
      return this;
    }

    insert(payload) {
      this.method = 'POST';
      this.payload = payload;
      return this;
    }

    upsert(payload, optionsArg = {}) {
      this.method = 'POST';
      this.payload = payload;
      this.onConflict = optionsArg.onConflict || '';
      return this;
    }

    update(payload) {
      this.method = 'PATCH';
      this.payload = payload;
      this.isPatch = true;
      return this;
    }

    delete() {
      this.method = 'DELETE';
      return this;
    }

    eq(column, value) {
      // eq.<value> precisa ter o value seguro na URL
      this.filters.push([column, `eq.${encodeFilterValue(value)}`]);
      return this;
    }

    in(column, values = []) {
      // PostgREST: in.(a,b,c) — precisa escapar vírgula dentro de valores
      const encoded = values
        .map((v) => String(v).replace(/,/g, '\\,'))
        .join(',');
      this.filters.push([column, `in.(${encoded})`]);
      return this;
    }

    limit(value) {
      this.filters.push(['limit', `${Number(value)}`]);
      return this;
    }

    maybeSingle() {
      this.singleMode = 'maybe-single';
      this.limit(1);
      return this;
    }

    then(resolve, reject) {
      return this.execute().then(resolve, reject);
    }

    async execute() {
      if (!supabaseUrl || !supabaseAnonKey) {
        return {
          data: null,
          count: null,
          error: {
            message:
              'Supabase não configurado. Defina REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY.',
          },
        };
      }

      const requestUrl = new URL(`${supabaseUrl}/rest/v1/${this.table}`);

      // SELECT/HEAD precisam do select=
      if (this.method === 'GET' || this.method === 'HEAD') {
        requestUrl.searchParams.set('select', this.selectColumns);
      }

      // on_conflict do upsert
      if (this.onConflict) {
        requestUrl.searchParams.set('on_conflict', this.onConflict);
      }

      // filtros (eq, in, limit)
      this.filters.forEach(([column, expression]) => {
        requestUrl.searchParams.append(column, expression);
      });

      const headers = buildHeaders();
      const preferHeaders = [];

      // count=exact para HEAD + count
      if (this.wantExactCount) {
        preferHeaders.push('count=exact');
      }

      // upsert merge + retorno
      if (this.onConflict) {
        preferHeaders.push('resolution=merge-duplicates');
        preferHeaders.push('return=representation');
      }

      // update/insert também pode querer retorno (opcional)
      // (deixe ligado só se você precisar do payload de volta)
      // if (this.method === 'PATCH') preferHeaders.push('return=representation');

      if (preferHeaders.length > 0) {
        headers.Prefer = preferHeaders.join(',');
      }

      if (this.method === 'POST' || this.method === 'PATCH') {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(requestUrl.toString(), {
        method: this.method,
        headers,
        body:
          this.method === 'POST' || this.method === 'PATCH'
            ? JSON.stringify(this.payload)
            : undefined,
      });

      // count vem no Content-Range quando Prefer: count=exact
      const contentRange = response.headers.get('content-range') || '';
      const countMatch = contentRange.match(/\/(\d+)$/);
      const count = countMatch ? Number(countMatch[1]) : null;

      if (!response.ok) {
        let errorPayload = null;
        try {
          errorPayload = await response.json();
        } catch {
          errorPayload = { message: response.statusText };
        }
        return { data: null, count, error: errorPayload };
      }

      // HEAD ou 204 (no content)
      if (this.method === 'HEAD' || response.status === 204) {
        return { data: null, count, error: null };
      }

      const data = await response.json();

      // maybeSingle: retorna o primeiro item do array ou objeto
      if (this.singleMode === 'maybe-single') {
        if (Array.isArray(data)) {
          return { data: data[0] ?? null, count, error: null };
        }
        return { data: data ?? null, count, error: null };
      }

      return { data, count, error: null };
    }
  }

  return {
    from(table) {
      return new PostgrestQuery(table);
    },
  };
}

function getOrCreateDeviceId() {
  const key = 'device_id';
  let id = localStorage.getItem(key);

  if (!id) {
    id =
      (window.crypto?.randomUUID && window.crypto.randomUUID()) ||
      `dev_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;

    localStorage.setItem(key, id);
  }

  return id;
}

export const deviceId = getOrCreateDeviceId();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Ajuda a diagnosticar env vars faltando no deploy
if (!isSupabaseConfigured) {
  console.error('Supabase env vars missing:', { supabaseUrl, hasKey: !!supabaseAnonKey });
}

// IMPORTANTÍSSIMO para sua RLS:
// mande x-device-id (principal) + fallbacks (caso sua função procure outro nome)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-device-id': deviceId,
      'x-device_id': deviceId,
      'device-id': deviceId,
      'device_id': deviceId,
    },
  },
});
