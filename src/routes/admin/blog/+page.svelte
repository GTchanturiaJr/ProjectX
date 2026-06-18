<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, Select, ConfirmDialog, Badge } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, Eye, EyeOff } from 'lucide-svelte';
  import { formatDate, slugify } from '$lib/utils/helpers';
  import type { BlogPost, BlogCategory } from '$lib/types';

  let posts: BlogPost[] = [];
  let categories: BlogCategory[] = [];
  let loading = true;
  let editPost: Partial<BlogPost> | null = null;
  let postModal = false;
  let deleteId: string | null = null;

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'published', label: 'Status', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: p } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    posts = p as BlogPost[] ?? [];
    const { data: c } = await supabase.from('blog_categories').select('*');
    categories = c as BlogCategory[] ?? [];
    loading = false;
  }

  function openModal(post: BlogPost | null = null) {
    editPost = post ? { ...post } : { title: '', slug: '', content: '', published: false };
    postModal = true;
  }

  async function save() {
    if (!editPost?.title) return;
    if (!editPost.slug) editPost.slug = slugify(editPost.title);
    if (editPost.id) {
      const { error } = await supabase.from('blog_posts').update(editPost).eq('id', editPost.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Post updated', 'success'); postModal = false; load(); }
    } else {
      const { error } = await supabase.from('blog_posts').insert(editPost);
      if (error) addToast(error.message, 'error');
      else { addToast('Post created', 'success'); postModal = false; load(); }
    }
  }

  async function togglePublished(id: string, published: boolean) {
    const { error } = await supabase.from('blog_posts').update({ published: !published }).eq('id', id);
    if (error) addToast(error.message, 'error');
    else { addToast('Status updated', 'success'); load(); }
  }

  async function deletePost() {
    if (!deleteId) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteId);
    if (error) addToast(error.message, 'error');
    else { addToast('Post deleted', 'success'); deleteId = null; load(); }
  }

  function getCategoryName(id: string | null) {
    if (!id) return '-';
    return categories.find(c => c.id === id)?.name ?? '-';
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
    <Button on:click={() => openModal()}><Plus class="h-4 w-4" /> New Post</Button>
  </div>

  <Card>
    <DataTable {columns} rows={posts} {loading} emptyMessage="No posts found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'category'}
          {getCategoryName(row.category_id)}
        {:else if col.key === 'published'}
          <Badge variant={row.published ? 'success' : 'default'}>{row.published ? 'Published' : 'Draft'}</Badge>
        {:else if col.key === 'created_at'}
          {formatDate(row.created_at)}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => togglePublished(row.id, row.published)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              {#if row.published}
                <Eye class="h-4 w-4" />
              {:else}
                <EyeOff class="h-4 w-4" />
              {/if}
            </button>
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

<Modal title={editPost?.id ? 'Edit Post' : 'Create Post'} bind:open={postModal}>
  <div class="space-y-4">
    <Input label="Title" bind:value={editPost.title} required />
    <Input label="Slug" bind:value={editPost.slug} placeholder="Auto-generated" />
    <Input label="Excerpt" bind:value={editPost.excerpt} />
    <Input label="Content" rows={8} bind:value={editPost.content} />
    <Input label="Cover Image URL" bind:value={editPost.cover_image} />
    <Select label="Category" bind:value={editPost.category_id} options={[{ value: null, label: 'None' }, ...categories.map(c => ({ value: c.id, label: c.name }))]} />
    <Input label="Meta Title" bind:value={editPost.meta_title} />
    <Input label="Meta Description" bind:value={editPost.meta_description} />
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" bind:checked={editPost.published} class="rounded text-[rgb(var(--color-primary))]" />
      Published
    </label>
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => postModal = false}>Cancel</Button>
      <Button on:click={save}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteId !== null}
  <ConfirmDialog open={true} title="Delete Post" message="Are you sure you want to delete this post?" confirmText="Delete" on:confirm={deletePost} on:cancel={() => deleteId = null} />
{/if}
