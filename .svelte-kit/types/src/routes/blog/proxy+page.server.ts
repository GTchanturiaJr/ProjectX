// @ts-nocheck
import { supabase } from '$lib/config/supabase';
import type { PageServerLoad } from './$types';

export const load = async () => {
  const { data: posts } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
  return { posts: posts ?? [] };
};
;null as any as PageServerLoad;