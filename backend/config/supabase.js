import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const SUPABASE_ENABLED = Boolean(supabaseUrl && supabaseAnonKey);

// In-memory fallback store when Supabase env vars are not configured
const mockTables = {
  brand_data: [
    {
      id: 1,
      userId: 'local-dev-user',
      created_at: new Date().toISOString(),
      brand: {
        title: 'Adverra Studio',
        domain: 'adverra.studio',
        description: 'AI-powered creative marketing platform for high-converting brand visuals, campaigns, and audio.',
        slogan: 'One platform. Every asset type. Always on-brand.',
        logos: [],
        colors: [
          { hex: '#FFFFFF', name: 'Pure White' },
          { hex: '#111111', name: 'Obsidian' },
          { hex: '#3B82F6', name: 'Electric Blue' },
        ],
        backdrops: [],
      },
    },
  ],
  brand_assets: [],
  brand_audio: [],
  brand_campaigns: [],
};

let mockIdCounter = 100;
export const mockStorageFiles = new Map();

function createMockQueryBuilder(table) {
  if (!mockTables[table]) mockTables[table] = [];
  let mode = 'select';
  let insertPayload = null;
  let filters = [];
  let orderOpts = null;
  let returnSingle = false;

  const execute = () => {
    const rows = mockTables[table];
    if (mode === 'insert') {
      const items = Array.isArray(insertPayload) ? insertPayload : [insertPayload];
      const inserted = items.map((item) => ({
        id: ++mockIdCounter,
        created_at: new Date().toISOString(),
        ...item,
      }));
      rows.push(...inserted);
      return {
        data: returnSingle ? inserted[0] : inserted,
        error: null,
      };
    }

    if (mode === 'delete') {
      mockTables[table] = rows.filter((row) => !filters.every((fn) => fn(row)));
      return { data: [], error: null };
    }

    let result = rows.filter((row) => filters.every((fn) => fn(row)));
    if (orderOpts) {
      const { column, ascending } = orderOpts;
      result = [...result].sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }
    return {
      data: returnSingle ? result[0] ?? null : result,
      error: null,
    };
  };

  const builder = {
    select() {
      return builder;
    },
    insert(payload) {
      mode = 'insert';
      insertPayload = payload;
      return builder;
    },
    delete() {
      mode = 'delete';
      return builder;
    },
    eq(column, value) {
      filters.push((row) => row[column] === value);
      return builder;
    },
    in(column, values) {
      filters.push((row) => values.includes(row[column]));
      return builder;
    },
    order(column, opts = { ascending: true }) {
      orderOpts = { column, ascending: opts.ascending !== false };
      return builder;
    },
    single() {
      returnSingle = true;
      return builder;
    },
    then(resolve, reject) {
      try {
        resolve(execute());
      } catch (err) {
        if (reject) reject(err);
      }
    },
  };

  return builder;
}

const mockSupabase = {
  from: (table) => createMockQueryBuilder(table),
  storage: {
    from: (bucket) => ({
      upload: async (storagePath, buffer, options = {}) => {
        const key = `${bucket}/${storagePath}`;
        mockStorageFiles.set(key, {
          buffer,
          contentType: options.contentType || 'application/octet-stream',
        });
        return { data: { path: storagePath }, error: null };
      },
      getPublicUrl: (storagePath) => {
        const key = `${bucket}/${storagePath}`;
        return {
          data: {
            publicUrl: `/api/media/storage/${encodeURIComponent(key)}`,
          },
        };
      },
    }),
  },
  auth: {
    getUser: async () => ({
      data: { user: { id: 'local-dev-user', email: 'dev@adverra.local' } },
      error: null,
    }),
    signUp: async ({ email }) => ({
      data: { user: { id: 'local-dev-user', email }, session: { access_token: 'no-auth' } },
      error: null,
    }),
    signInWithPassword: async ({ email }) => ({
      data: { user: { id: 'local-dev-user', email }, session: { access_token: 'no-auth' } },
      error: null,
    }),
    session: async () => ({
      data: { session: { access_token: 'no-auth' } },
      error: null,
    }),
  },
};

if (!SUPABASE_ENABLED) {
  console.warn('[AI Studio] Supabase env vars missing — using in-memory database & storage stub');
}

export const supabase = SUPABASE_ENABLED
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
