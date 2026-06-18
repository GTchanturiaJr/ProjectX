<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, Select, Badge } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-svelte';
  import type { SEOSetting, Page } from '$lib/types';

  let settings: SEOSetting[] = [];
  let pages: Page[] = [];
  let loading = true;
  let editSetting: Partial<SEOSetting> | null = null;
  let modal = false;
  let deleteId: string | null = null;

  const robotsOptions = [
    { value: 'index,follow', label: 'Index, Follow' },
    { value: 'index,nofollow', label: 'Index, No Follow' },
    { value: 'noindex,follow', label: 'No Index, Follow' },
    { value: 'noindex,nofollow', label: 'No Index, No Follow' },
  ];

  const columns = [
    { key: 'page_id', label: 'Page', sortable: true },
    { key: 'meta_title', label: 'Title', sortable: true },
    { key: 'robots', label: 'Robots', sortable: false },
    { key: 'issues', label: 'Issues', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: p } = await supabase.from('pages').select('*');
    pages = p as Page[] ?? [];
    const { data: s } = await supabase.from('seo_settings').select('*');
    settings = s as SEOSetting[] ?? [];
    loading = false;
  }

  function getPageTitle(pageId: string | null) {
    if (!pageId) return 'Global';
    return pages.find(p => p.id === pageId)?.title ?? 'Unknown';
  }

  function checkIssues(s: SEOSetting): string[] {
    const issues: string[] = [];
    if (!s.meta_title) issues.push('Missing title');
    if (!s.meta_description) issues.push('Missing description');
    if (!s.og_image) issues.push('Missing OG image');
    return issues;
  }

  function openModal(setting: SEOSetting | null = null) {
    editSetting = setting ? { ...setting } : { global: false, robots: 'index,follow' };
    modal = true;
  }

  async function save() {
    if (!editSetting) return;
    if (editSetting.id) {
      const { error } = await supabase.from('seo_settings').update(editSetting).eq('id', editSetting.id);
      if (error) addToast(error.message, 'error');
      else { addToast('SEO updated', 'success'); modal = false; load(); }
    } else {
      const { error } = await supabase.from('seo_settings').insert(editSetting);
      if (error) addToast(error.message, 'error');
      else { addToast('SEO created', 'success'); modal = false; load(); }
    }
  }

  async function deleteSetting() {
    if (!deleteId) return;
    const { error } = await supabase.from('seo_settings').delete().eq('id', deleteId);
    if (error) addToast(error.message, 'error');
    else { addToast('SEO deleted', 'success'); deleteId = null; load(); }
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">SEO Settings</h1>
    <Button on:click={() => openModal()}><Plus class="h-4 w-4" /> Add SEO</Button>
  </div>

  <Card>
    <DataTable {columns} rows={settings} {loading} emptyMessage="No SEO settings">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'page_id'}
          {getPageTitle(row.page_id)}
        {:else if col.key === 'robots'}
          <Badge variant={row.robots.includes('noindex') ? 'warning' : 'success'}>{row.robots}</Badge>
        {:else if col.key === 'issues'}
          {@const issues = checkIssues(row)}
          {#if issues.length > 0}
            <div class="flex items-center gap-1 text-amber-600">
              <AlertCircle class="h-4 w-4" />
              <span class="text-xs">{issues.length} issues</span>
            </div>
          {:else}
            <div class="flex items-center gap-1 text-green-600">
              <CheckCircle class="h-4 w-4" />
            </div>
          {/if}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => openModal(row)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <Pencil class="h-4 w-4" />
            </button>
            <button on:click={() => deleteId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash class="h-4 w-4" />
            </button>
          </div>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>
</div>

<Modal title={editSetting?.id ? 'Edit SEO' : 'Add SEO'} bind:open={modal}>
  <div class="space-y-4">
    <Select label="Page" bind:value={editSetting.page_id} options={[{ value: null, label: 'Global' }, ...pages.map(p => ({ value: p.id, label: p.title }))]} placeholder="Select page" />
    <Input label="Meta Title" bind:value={editSetting.meta_title} />
    <Input label="Meta Description" rows={3} bind:value={editSetting.meta_description} />
    <Input label="Meta Keywords" bind:value={editSetting.meta_keywords} />
    <Input label="OG Image URL" bind:value={editSetting.og_image} />
    <Select label="Robots" bind:value={editSetting.robots} options={robotsOptions} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => modal = false}>Cancel</Button>
      <Button on:click={save}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteId !== null}
  <ConfirmDialog open={true} title="Delete SEO Setting" message="Remove this SEO configuration?" confirmText="Delete" on:confirm={deleteSetting} on:cancel={() => deleteId = null} />
{/if}
