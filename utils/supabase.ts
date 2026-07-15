import { createClient } from '@supabase/supabase-js';

// 强制获取密钥，如果没有，就塞一个假格式给它，防止引擎直接崩溃自杀
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-url-prevent-crash.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

if (supabaseUrl.includes('dummy')) {
  console.error("🚨 致命警告：系统没有读到 .env.local 里的密钥！");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);