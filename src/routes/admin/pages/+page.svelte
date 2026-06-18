<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, ConfirmDialog, Badge } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, Eye, EyeOff } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { formatDate, slugify } from '$lib/utils/helpers';
  import type { Page } from '$lib/types';

  let pages: Page[] = [];
  let loading = true;
  let editPage: Partial<Page> | null = null;
  let deleteId: string | null = null;
  let modal = false;

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'published', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  onMount(load);

  async function load() {
    const { data } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
    pages = data as Page[] ?? [];
    loading = false;
  }

  function openModal(page: Page | null = null) {
    editPage = page ? { ...page } : { title: '', slug: '', published: false };
    modal = true;
  }

  async function save() {
    if (!editPage?.title) return;
    if (!editPage.slug) editPage.slug = slugify(editPage.title);
    if (editPage.id) {
      const { error } = await supabase.from('pages').update(editPage).eq('id', editPage.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Page updated', 'success'); modal = false; load(); }
    } else {
      const { error } = await supabase.from('pages').insert(editPage);
      if (error) addToast(error.message, 'error');
      else { addToast('Page created', 'success'); modal = false; load(); }
    }
  }

  async function togglePublished(id: string, published: boolean) {
    const { error } = await supabase.from('pages').update({ published: !published }).eq('id', id);
    if (error) addToast(error.message, 'error');
    else { addToast('Status updated', 'success'); load(); }
  }

  async function deletePage() {
    if (!deleteId) return;
    const { error } = await supabase.from('pages').delete().eq('id', deleteId);
    if (error) addToast(error.message, 'error');
    else { addToast('Page deleted', 'success'); deleteId = null; load(); }
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pages</h1>
    <Button on:click={() => openModal()}><Plus class="h-4 w-4" /> New Page</Button>
  </div>

  <Card>
    <DataTable {columns} rows={pages} {loading} emptyMessage="No pages found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'published'}
          <Badge variant={row.published ? 'success' : 'default'}>{row.published ? 'Published' : 'Draft'}</Badge>
        {:else if col.key === 'created_at'}
          {formatDate(row.created_at)}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => goto(`/admin/pages/${row.id}`)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Edit sections">
              <Pencil class="h-4 w-4" />
            </button>
            <button on:click={() => togglePublished(row.id, row.published)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Toggle published">
              {#if row.published}
                <Eye class="h-4 w-4" />
              {:else}
                <EyeOff class="h-4 w-4" />
              {/if}
            </button>
            <button on:click={() => openModal(row)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Edit details">
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

<Modal title={editPage?.id ? 'Edit Page' : 'Create Page'} bind:open={modal}>
  <div class="space-y-4">
    <Input label="Title" bind:value={editPage.title} required />
    <Input label="Slug" bind:value={editPage.slug} placeholder="Auto-generated from title" />
    <Input label="Description" rows={3} bind:value={editPage.description} />
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" bind:checked={editPage.published} class="rounded text-[rgb(var(--color-primary))]" />
      Published
    </label>
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => modal = false}>Cancel</Button>
      <Button on:click={save}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteId !== null}
  <ConfirmDialog open={true} title="Delete Page" message="This will delete the page and all its sections." confirmText="Delete" on:confirm={deletePage} on:cancel={() => deleteId = null} />
{/if}
