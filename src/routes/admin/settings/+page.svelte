<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, Input } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Save } from 'lucide-svelte';
  import type { SiteSetting } from '$lib/types';

  let settings: SiteSetting[] = [];
  let loading = true;
  let saving = false;

  const defaultSettings = [
    { key: 'site_name', label: 'Site Name', type: 'string' },
    { key: 'site_description', label: 'Site Description', type: 'string' },
    { key: 'primary_color', label: 'Primary Color (RGB)', type: 'string' },
    { key: 'secondary_color', label: 'Secondary Color (RGB)', type: 'string' },
    { key: 'accent_color', label: 'Accent Color (RGB)', type: 'string' },
    { key: 'font_family', label: 'Font Family', type: 'string' },
    { key: 'border_radius', label: 'Border Radius', type: 'string' },
    { key: 'contact_email', label: 'Contact Email', type: 'string' },
    { key: 'social_facebook', label: 'Facebook URL', type: 'string' },
    { key: 'social_twitter', label: 'Twitter/X URL', type: 'string' },
    { key: 'social_instagram', label: 'Instagram URL', type: 'string' },
    { key: 'social_linkedin', label: 'LinkedIn URL', type: 'string' },
    { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'string' },
    { key: 'google_tag_manager_id', label: 'Google Tag Manager ID', type: 'string' },
    { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'boolean' },
  ];

  onMount(async () => {
    const { data } = await supabase.from('site_settings').select('*');
    settings = data as SiteSetting[] ?? [];
    loading = false;
  });

  function getValue(key: string): string {
    const s = settings.find(s => s.key === key);
    return s?.value ?? '';
  }

  function setValue(key: string, value: string) {
    const existing = settings.find(s => s.key === key);
    if (existing) {
      existing.value = value;
      settings = [...settings];
    } else {
      settings = [...settings, { id: crypto.randomUUID(), key, value, type: 'string' } as SiteSetting];
    }
  }

  async function save() {
    saving = true;
    for (const s of settings) {
      if (s.id.includes('-') && s.id.length > 20) {
        await supabase.from('site_settings').upsert({ key: s.key, value: s.value });
      } else {
        await supabase.from('site_settings').update({ value: s.value }).eq('id', s.id);
      }
    }
    addToast('Settings saved', 'success');
    saving = false;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
    <Button on:click={save} disabled={saving}><Save class="h-4 w-4" /> Save Settings</Button>
  </div>

  {#if loading}
    <p class="text-gray-500">Loading...</p>
  {:else}
    <div class="grid gap-6 lg:grid-cols-2">
      <Card title="Site Information">
        <div class="space-y-4">
          {#each defaultSettings.filter(s => ['site_name', 'site_description', 'contact_email'].includes(s.key)) as setting}
            <Input label={setting.label} value={getValue(setting.key)} on:input={(e) => setValue(setting.key, (e.target as HTMLInputElement).value)} />
          {/each}
        </div>
      </Card>

      <Card title="Theme Settings">
        <div class="space-y-4">
          {#each defaultSettings.filter(s => ['primary_color', 'secondary_color', 'accent_color', 'font_family', 'border_radius'].includes(s.key)) as setting}
            <Input label={setting.label} value={getValue(setting.key)} placeholder="e.g. 59 130 246" on:input={(e) => setValue(setting.key, (e.target as HTMLInputElement).value)} />
          {/each}
        </div>
      </Card>

      <Card title="Social Links">
        <div class="space-y-4">
          {#each defaultSettings.filter(s => s.key.startsWith('social_')) as setting}
            <Input label={setting.label} value={getValue(setting.key)} on:input={(e) => setValue(setting.key, (e.target as HTMLInputElement).value)} />
          {/each}
        </div>
      </Card>

      <Card title="Analytics & Tools">
        <div class="space-y-4">
          {#each defaultSettings.filter(s => ['google_analytics_id', 'google_tag_manager_id', 'maintenance_mode'].includes(s.key)) as setting}
            <Input label={setting.label} value={getValue(setting.key)} on:input={(e) => setValue(setting.key, (e.target as HTMLInputElement).value)} />
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>
