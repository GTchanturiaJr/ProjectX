<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, Select, ConfirmDialog, Badge } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, ArrowUp, ArrowDown } from 'lucide-svelte';
  import { formatDate } from '$lib/utils/helpers';
  import type { NavigationMenu, NavigationItem } from '$lib/types';

  let menus: NavigationMenu[] = [];
  let items: NavigationItem[] = [];
  let loading = true;
  let editMenu: Partial<NavigationMenu> | null = null;
  let editItem: Partial<NavigationItem> | null = null;
  let deleteItemId: string | null = null;
  let deleteMenuId: string | null = null;
  let menuModal = false;
  let itemModal = false;
  let selectedMenu: string | null = null;

  const locationOptions = [
    { value: 'navbar', label: 'Navbar' },
    { value: 'footer', label: 'Footer' },
    { value: 'sidebar', label: 'Sidebar' },
  ];

  const menuColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'items', label: 'Items', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const itemColumns = [
    { key: 'label', label: 'Label', sortable: true },
    { key: 'url', label: 'URL', sortable: true },
    { key: 'sort_order', label: 'Order', sortable: true },
    { key: 'visible', label: 'Visible', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: m } = await supabase.from('navigation_menus').select('*');
    menus = m as NavigationMenu[] ?? [];
    const { data: i } = await supabase.from('navigation_items').select('*').order('sort_order');
    items = i as NavigationItem[] ?? [];
    loading = false;
  }

  function openMenu(m: NavigationMenu | null = null) {
    editMenu = m ? { ...m } : { name: '', location: 'navbar' };
    menuModal = true;
  }

  function openItem(menuId: string, item: NavigationItem | null = null) {
    editItem = item ? { ...item } : { menu_id: menuId, label: '', url: '', sort_order: 0, visible: true };
    itemModal = true;
  }

  async function saveMenu() {
    if (!editMenu?.name) return;
    if (!editMenu.id) {
      const { error } = await supabase.from('navigation_menus').insert(editMenu);
      if (error) addToast(error.message, 'error');
      else { addToast('Menu created', 'success'); menuModal = false; load(); }
    } else {
      const { error } = await supabase.from('navigation_menus').update(editMenu).eq('id', editMenu.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Menu updated', 'success'); menuModal = false; load(); }
    }
  }

  async function saveItem() {
    if (!editItem?.label || !editItem?.url) return;
    if (!editItem.id) {
      const { error } = await supabase.from('navigation_items').insert(editItem);
      if (error) addToast(error.message, 'error');
      else { addToast('Item added', 'success'); itemModal = false; load(); }
    } else {
      const { error } = await supabase.from('navigation_items').update(editItem).eq('id', editItem.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Item updated', 'success'); itemModal = false; load(); }
    }
  }

  async function deleteMenu() {
    if (!deleteMenuId) return;
    const { error } = await supabase.from('navigation_menus').delete().eq('id', deleteMenuId);
    if (error) addToast(error.message, 'error');
    else { addToast('Menu deleted', 'success'); deleteMenuId = null; load(); }
  }

  async function deleteItem() {
    if (!deleteItemId) return;
    const { error } = await supabase.from('navigation_items').delete().eq('id', deleteItemId);
    if (error) addToast(error.message, 'error');
    else { addToast('Item deleted', 'success'); deleteItemId = null; load(); }
  }

  async function moveItem(id: string, dir: 'up' | 'down') {
    const menuItems = items.filter(i => i.menu_id === selectedMenu);
    const idx = menuItems.findIndex(i => i.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= menuItems.length) return;
    const a = menuItems[idx];
    const b = menuItems[swapIdx];
    const temp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = temp;
    await supabase.from('navigation_items').update({ sort_order: a.sort_order }).eq('id', a.id);
    await supabase.from('navigation_items').update({ sort_order: b.sort_order }).eq('id', b.id);
    items = [...items];
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Navigation</h1>
    <Button on:click={() => openMenu()}><Plus class="h-4 w-4" /> New Menu</Button>
  </div>

  <Card title="Menus">
    <DataTable columns={menuColumns} rows={menus} {loading} emptyMessage="No menus found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'items'}
          {items.filter(i => i.menu_id === row.id).length}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => { selectedMenu = row.id; }} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="View items">
              <Pencil class="h-4 w-4" />
            </button>
            <button on:click={() => deleteMenuId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
              <Trash class="h-4 w-4" />
            </button>
          </div>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>

  {#if selectedMenu}
    {@const menu = menus.find(m => m.id === selectedMenu)}
    <Card title="Items: {menu?.name ?? ''}">
      <div class="mb-4 flex items-center justify-between">
        <Button on:click={() => openItem(selectedMenu)}><Plus class="h-4 w-4" /> Add Item</Button>
        <button on:click={() => selectedMenu = null} class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">Close</button>
      </div>
      <DataTable columns={itemColumns} rows={items.filter(i => i.menu_id === selectedMenu)} loading={false} emptyMessage="No items found">
        <svelte:fragment slot="cell" let:col let:row>
          {#if col.key === 'visible'}
            <Badge variant={row.visible ? 'success' : 'default'}>{row.visible ? 'Yes' : 'No'}</Badge>
          {:else if col.key === 'actions'}
            <div class="flex items-center gap-2">
              <button on:click={() => moveItem(row.id, 'up')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowUp class="h-4 w-4" /></button>
              <button on:click={() => moveItem(row.id, 'down')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowDown class="h-4 w-4" /></button>
              <button on:click={() => openItem(selectedMenu, row)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Pencil class="h-4 w-4" /></button>
              <button on:click={() => deleteItemId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash class="h-4 w-4" /></button>
            </div>
          {:else}
            {row[col.key] ?? '-'}
          {/if}
        </svelte:fragment>
      </DataTable>
    </Card>
  {/if}
</div>

<Modal title={editMenu?.id ? 'Edit Menu' : 'Create Menu'} bind:open={menuModal}>
  <div class="space-y-4">
    <Input label="Name" bind:value={editMenu.name} required />
    <Select label="Location" bind:value={editMenu.location} options={locationOptions} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => menuModal = false}>Cancel</Button>
      <Button on:click={saveMenu}>Save</Button>
    </div>
  </div>
</Modal>

<Modal title={editItem?.id ? 'Edit Item' : 'Add Item'} bind:open={itemModal}>
  <div class="space-y-4">
    <Input label="Label" bind:value={editItem.label} required />
    <Input label="URL" bind:value={editItem.url} required />
    <Input type="number" label="Sort Order" bind:value={editItem.sort_order} />
    <Input label="Visible" type="checkbox" bind:value={editItem.visible} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => itemModal = false}>Cancel</Button>
      <Button on:click={saveItem}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteMenuId !== null}
  <ConfirmDialog open={true} title="Delete Menu" message="This will delete the menu and all its items." confirmText="Delete" on:confirm={deleteMenu} on:cancel={() => deleteMenuId = null} />
{/if}

{#if deleteItemId !== null}
  <ConfirmDialog open={true} title="Delete Item" message="Remove this navigation item?" confirmText="Delete" on:confirm={deleteItem} on:cancel={() => deleteItemId = null} />
{/if}
