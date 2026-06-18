import { supabase } from '$lib/config/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { data: forms } = await supabase.from('forms').select('*').limit(1);
  const form = forms?.[0];

  if (form) {
    const { data: fields } = await supabase.from('form_fields').select('*').eq('form_id', form.id).order('sort_order');
    return { form, fields: fields ?? [] };
  }

  return { form: null, fields: [] };
};
