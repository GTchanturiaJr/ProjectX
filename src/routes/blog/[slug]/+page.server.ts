import { supabase } from '$lib/config/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).eq('published', true).single();

  if (!post) {
    throw error(404, 'Post not found');
  }

  return { post };
};
