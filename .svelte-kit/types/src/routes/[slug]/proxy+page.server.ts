// @ts-nocheck
import { supabase } from '$lib/config/supabase';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const { data: page } = await supabase.from('pages').select('*').eq('slug', params.slug).eq('published', true).single();

  if (!page) {
    throw error(404, 'Page not found');
  }

  const { data: sections } = await supabase.from('page_sections').select('*').eq('page_id', page.id).eq('visible', true).order('sort_order');

  return { page, sections: sections ?? [] };
};
