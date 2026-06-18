import { supabase } from '$lib/config/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { data: pages } = await supabase.from('pages').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1);
  const home = pages?.[0];

  if (home) {
    const { data: sections } = await supabase.from('page_sections').select('*').eq('page_id', home.id).eq('visible', true).order('sort_order');
    return { page: home, sections: sections ?? [] };
  }

  return { page: null, sections: [] };
};
