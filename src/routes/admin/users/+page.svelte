<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Pencil, Search } from 'lucide-svelte';
  import { formatDate } from '$lib/utils/helpers';
  import type { Profile, Role } from '$lib/types';

  interface UserRow extends Profile {
    roles: Role[];
  }

  let users: UserRow[] = $state([]);
  let loading = $state(true);
  let search = $state('');
  let editUser: Partial<UserRow> | null = $state(null);
  let editRoles: Role[] = $state([]);
  let userModal = $state(false);
  let allRoles: Role[] = ['super_admin', 'admin', 'editor', 'seo_manager', 'media_manager', 'viewer', 'customer'];

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'roles', label: 'Roles', sortable: false },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const roleMap: Record<string, Role[]> = {};
    if (roles) {
      for (const r of roles) {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role as Role);
      }
    }
    users = (profiles ?? []).map(p => ({ ...p as Profile, roles: roleMap[p.id] ?? [] }));
    loading = false;
  }

  function openModal(user: UserRow | null = null) {
    if (user) {
      editUser = { ...user };
      editRoles = [...user.roles];
    } else {
      editUser = null;
      editRoles = [];
    }
    userModal = true;
  }

  async function saveRoles() {
    if (!editUser?.id) return;
    await supabase.from('user_roles').delete().eq('user_id', editUser.id);
    for (const role of editRoles) {
      await supabase.from('user_roles').insert({ user_id: editUser.id, role });
    }
    addToast('Roles updated', 'success');
    userModal = false;
    load();
  }

  async function updateName() {
    if (!editUser?.id || !editUser.full_name) return;
    const { error } = await supabase.from('profiles').update({ full_name: editUser.full_name }).eq('id', editUser.id);
    if (error) addToast(error.message, 'error');
    else { addToast('Name updated', 'success'); userModal = false; load(); }
  }

  let filtered = $derived(users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false)
  ));

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
    <div class="flex items-center gap-3">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" bind:value={search} placeholder="Search users..." class="rounded-[var(--radius)] border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-600 dark:bg-gray-800" />
      </div>
    </div>
  </div>

  <Card>
    <DataTable {columns} rows={filtered as Record<string, unknown>[]} {loading} emptyMessage="No users found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'roles'}
          <div class="flex flex-wrap gap-1">
            {#each (row.roles as Role[] ?? []) as role}
              <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">{role}</span>
            {/each}
          </div>
        {:else if col.key === 'created_at'}
          {formatDate(row.created_at)}
        {:else if col.key === 'actions'}
          <button onclick={() => openModal(row as UserRow)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Pencil class="h-4 w-4" />
          </button>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>
</div>

{#if editUser}
  <Modal title="Edit User" bind:open={userModal}>
    <div class="space-y-4">
      <Input label="Email" value={editUser.email} disabled />
      <Input label="Full Name" bind:value={editUser.full_name} />
      <div>
        <label for="roles-checklist" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Roles</label>
        <div id="roles-checklist" class="flex flex-wrap gap-2">
          {#each allRoles as role}
            <label class="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 dark:border-gray-700">
              <input type="checkbox" value={role} checked={editRoles.includes(role)} onchange={() => {
                if (editRoles.includes(role)) editRoles = editRoles.filter(r => r !== role);
                else editRoles = [...editRoles, role];
              }} class="rounded text-[rgb(var(--color-primary))]" />
              <span class="text-sm text-gray-700 dark:text-gray-300">{role}</span>
            </label>
          {/each}
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <Button variant="ghost" onclick={() => userModal = false}>Cancel</Button>
        <Button onclick={() => { updateName(); saveRoles(); }}>Save</Button>
      </div>
    </div>
  </Modal>
{/if}
