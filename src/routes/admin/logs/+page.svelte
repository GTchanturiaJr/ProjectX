<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Card, DataTable, Badge, Select } from '$lib/components/ui';
  import { formatDate } from '$lib/utils/helpers';
  import type { AuditLog } from '$lib/types';

  let logs: AuditLog[] = $state([]);
  let loading = $state(true);
  let actionFilter = $state('');

  const columns = [
    { key: 'created_at', label: 'Time', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'table_name', label: 'Table', sortable: true },
    { key: 'record_id', label: 'Record', sortable: false },
  ];

  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'create', label: 'Create' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
    { value: 'login', label: 'Login' },
  ];

  async function load() {
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    logs = data as AuditLog[] ?? [];
    loading = false;
  }

  let filtered = $derived(actionFilter ? logs.filter(l => l.action === actionFilter) : logs);

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
    <Select bind:value={actionFilter} options={actionOptions} placeholder="Filter by action" />
  </div>

  <Card>
    <DataTable {columns} rows={filtered} {loading} emptyMessage="No logs found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'created_at'}
          {formatDate(row.created_at)} {new Date(row.created_at).toLocaleTimeString()}
        {:else if col.key === 'action'}
          <Badge variant={row.action === 'create' ? 'success' : row.action === 'delete' ? 'error' : 'info'}>{row.action}</Badge>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>
</div>
