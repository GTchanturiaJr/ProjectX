<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, Modal, Input, ConfirmDialog, EmptyState } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Folder, Image, Trash, Copy, Pencil } from 'lucide-svelte';
  import { formatBytes } from '$lib/utils/helpers';
  import type { MediaFile, MediaFolder } from '$lib/types';

  let files: MediaFile[] = [];
  let folders: MediaFolder[] = [];
  let loading = true;
  let currentFolder: string | null = null;
  let uploadModal = false;
  let folderModal = false;
  let newFolderName = '';
  let renameFile: MediaFile | null = null;
  let renameValue = '';
  let renameModal = false;
  let deleteFileId: string | null = null;
  let fileInput: HTMLInputElement | null = null;

  async function load() {
    const { data: f } = await supabase.from('media_files').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    files = f as MediaFile[] ?? [];
    const { data: fld } = await supabase.from('media_folders').select('*').order('name');
    folders = fld as MediaFolder[] ?? [];
    loading = false;
  }

  async function createFolder() {
    if (!newFolderName) return;
    const { error } = await supabase.from('media_folders').insert({ name: newFolderName, parent_id: currentFolder });
    if (error) addToast(error.message, 'error');
    else { addToast('Folder created', 'success'); folderModal = false; newFolderName = ''; load(); }
  }

  async function handleUpload() {
    if (!fileInput?.files?.length) return;
    for (const file of fileInput.files) {
      const path = currentFolder ? `${currentFolder}/${file.name}` : file.name;
      const { data: up, error: upError } = await supabase.storage.from('media').upload(path, file, { upsert: true });
      if (upError) { addToast(upError.message, 'error'); continue; }
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
      const { error: dbError } = await supabase.from('media_files').insert({
        name: file.name,
        path,
        url: publicUrl,
        size: file.size,
        mime_type: file.type,
        folder_id: currentFolder,
      });
      if (dbError) addToast(dbError.message, 'error');
    }
    addToast('Upload complete', 'success');
    uploadModal = false;
    if (fileInput) fileInput.value = '';
    load();
  }

  async function deleteFile() {
    if (!deleteFileId) return;
    const { error } = await supabase.from('media_files').update({ deleted_at: new Date().toISOString() }).eq('id', deleteFileId);
    if (error) addToast(error.message, 'error');
    else { addToast('File deleted', 'success'); deleteFileId = null; load(); }
  }

  async function renameFileFn() {
    if (!renameFile || !renameValue) return;
    const { error } = await supabase.from('media_files').update({ name: renameValue }).eq('id', renameFile.id);
    if (error) addToast(error.message, 'error');
    else { addToast('File renamed', 'success'); renameFile = null; renameValue = ''; renameModal = false; load(); }
  }

  function openRename(file: MediaFile) {
    renameFile = file;
    renameValue = file.name;
    renameModal = true;
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    addToast('URL copied', 'success');
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
    <div class="flex gap-2">
      <Button variant="outline" on:click={() => folderModal = true}><Folder class="h-4 w-4" /> New Folder</Button>
      <Button on:click={() => uploadModal = true}><Plus class="h-4 w-4" /> Upload</Button>
    </div>
  </div>

  {#if folders.length > 0}
    <div class="flex gap-2">
      <button on:click={() => currentFolder = null} class="rounded-md px-3 py-1 text-sm {currentFolder === null ? 'bg-[rgb(var(--color-primary))] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}">All</button>
      {#each folders as f}
        <button on:click={() => currentFolder = f.id} class="rounded-md px-3 py-1 text-sm {currentFolder === f.id ? 'bg-[rgb(var(--color-primary))] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}">{f.name}</button>
      {/each}
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {#if loading}
      <p class="col-span-full text-gray-500">Loading...</p>
    {:else if files.filter(f => currentFolder ? f.folder_id === currentFolder : true).length === 0}
      <div class="col-span-full">
        <EmptyState title="No files" description="Upload your first image to get started." />
      </div>
    {:else}
      {#each files.filter(f => currentFolder ? f.folder_id === currentFolder : true) as file}
        <div class="group relative rounded-[var(--radius)] border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <div class="mb-2 aspect-square overflow-hidden rounded-[var(--radius)] bg-gray-100 dark:bg-gray-800">
            {#if file.mime_type.startsWith('image/')}
              <img src={file.url} alt={file.alt_text ?? ''} class="h-full w-full object-cover" />
            {:else}
              <div class="flex h-full items-center justify-center">
                <Image class="h-8 w-8 text-gray-400" />
              </div>
            {/if}
          </div>
          <p class="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
          <p class="text-xs text-gray-500">{formatBytes(file.size)}</p>
          <div class="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button on:click={() => copyUrl(file.url)} class="rounded bg-white p-1 shadow-sm dark:bg-gray-800" title="Copy URL"><Copy class="h-3 w-3" /></button>
            <button on:click={() => openRename(file)} class="rounded bg-white p-1 shadow-sm dark:bg-gray-800" title="Rename"><Pencil class="h-3 w-3" /></button>
            <button on:click={() => deleteFileId = file.id} class="rounded bg-white p-1 shadow-sm dark:bg-gray-800" title="Delete"><Trash class="h-3 w-3 text-red-500" /></button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<Modal title="Upload Files" bind:open={uploadModal}>
  <div class="space-y-4">
    <input type="file" multiple accept="image/*" bind:this={fileInput} class="w-full text-sm" />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => uploadModal = false}>Cancel</Button>
      <Button on:click={handleUpload}>Upload</Button>
    </div>
  </div>
</Modal>

<Modal title="New Folder" bind:open={folderModal}>
  <div class="space-y-4">
    <Input label="Folder Name" bind:value={newFolderName} required />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => folderModal = false}>Cancel</Button>
      <Button on:click={createFolder}>Create</Button>
    </div>
  </div>
</Modal>

<Modal title="Rename File" bind:open={renameModal}>
  <div class="space-y-4">
    <Input label="New Name" bind:value={renameValue} required />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => renameModal = false}>Cancel</Button>
      <Button on:click={renameFileFn}>Rename</Button>
    </div>
  </div>
</Modal>

{#if deleteFileId !== null}
  <ConfirmDialog open={true} title="Delete File" message="Move this file to trash?" confirmText="Delete" on:confirm={deleteFile} on:cancel={() => deleteFileId = null} />
{/if}
