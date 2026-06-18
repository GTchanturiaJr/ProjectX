<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, Select, ConfirmDialog } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, Eye } from 'lucide-svelte';
  import { formatDate } from '$lib/utils/helpers';
  import type { Form, FormField, FormSubmission } from '$lib/types';

  let forms: Form[] = [];
  let loading = true;
  let editForm: Partial<Form> | null = null;
  let formModal = false;
  let deleteFormId: string | null = null;
  let selectedForm: string | null = null;
  let submissions: FormSubmission[] = [];
  let fields: FormField[] = [];
  let fieldModal = false;
  let editField: Partial<FormField> | null = null;
  let deleteFieldId: string | null = null;

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'submissions', label: 'Submissions', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: f } = await supabase.from('forms').select('*');
    forms = f as Form[] ?? [];
    loading = false;
  }

  function openForm(form: Form | null = null) {
    editForm = form ? { ...form } : { name: '', slug: '' };
    formModal = true;
  }

  async function saveForm() {
    if (!editForm?.name || !editForm?.slug) return;
    if (!editForm.id) {
      const { error } = await supabase.from('forms').insert(editForm);
      if (error) addToast(error.message, 'error');
      else { addToast('Form created', 'success'); formModal = false; load(); }
    } else {
      const { error } = await supabase.from('forms').update(editForm).eq('id', editForm.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Form updated', 'success'); formModal = false; load(); }
    }
  }

  async function deleteForm() {
    if (!deleteFormId) return;
    const { error } = await supabase.from('forms').delete().eq('id', deleteFormId);
    if (error) addToast(error.message, 'error');
    else { addToast('Form deleted', 'success'); deleteFormId = null; load(); }
  }

  async function loadFormDetail(id: string) {
    selectedForm = id;
    const { data: s } = await supabase.from('form_submissions').select('*').eq('form_id', id).order('created_at', { ascending: false });
    submissions = s as FormSubmission[] ?? [];
    const { data: fld } = await supabase.from('form_fields').select('*').eq('form_id', id).order('sort_order');
    fields = fld as FormField[] ?? [];
  }

  function openField(field: FormField | null = null) {
    editField = field ? { ...field } : { form_id: selectedForm!, label: '', field_type: 'text', required: false, sort_order: 0 };
    fieldModal = true;
  }

  async function saveField() {
    if (!editField?.label || !editField?.field_type) return;
    if (!editField.id) {
      const { error } = await supabase.from('form_fields').insert(editField);
      if (error) addToast(error.message, 'error');
      else { addToast('Field added', 'success'); fieldModal = false; if (selectedForm) loadFormDetail(selectedForm); }
    } else {
      const { error } = await supabase.from('form_fields').update(editField).eq('id', editField.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Field updated', 'success'); fieldModal = false; if (selectedForm) loadFormDetail(selectedForm); }
    }
  }

  async function deleteField() {
    if (!deleteFieldId) return;
    const { error } = await supabase.from('form_fields').delete().eq('id', deleteFieldId);
    if (error) addToast(error.message, 'error');
    else { addToast('Field deleted', 'success'); deleteFieldId = null; if (selectedForm) loadFormDetail(selectedForm); }
  }

  async function exportSubmissions() {
    if (!submissions.length) return;
    const keys = Object.keys(submissions[0].data);
    const headers = ['id', 'created_at', ...keys];
    const rows = submissions.map(s => [s.id, s.created_at, ...keys.map(k => (s.data as Record<string, unknown>)[k])]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => String(c).includes(',') ? `"${String(c).replace(/"/g, '""')}"` : String(c)).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${selectedForm}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Exported', 'success');
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forms</h1>
    <Button on:click={() => openForm()}><Plus class="h-4 w-4" /> New Form</Button>
  </div>

  <Card>
    <DataTable {columns} rows={forms} {loading} emptyMessage="No forms found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'submissions'}
          {#await supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('form_id', row.id) then { count }}{count ?? 0}{/await}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => { openForm(row); }} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Pencil class="h-4 w-4" /></button>
            <button on:click={() => loadFormDetail(row.id)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Details"><Eye class="h-4 w-4" /></button>
            <button on:click={() => deleteFormId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash class="h-4 w-4" /></button>
          </div>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>

  {#if selectedForm}
    <Card title="Form Fields">
      <div class="mb-4 flex items-center justify-between">
        <Button on:click={() => openField()}><Plus class="h-4 w-4" /> Add Field</Button>
        <button on:click={() => selectedForm = null} class="text-sm text-gray-500">Close</button>
      </div>
      <div class="space-y-2">
        {#each fields as field}
          <div class="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2 dark:border-gray-800">
            <div>
              <span class="font-medium text-gray-900 dark:text-white">{field.label}</span>
              <span class="ml-2 text-xs text-gray-500">{field.field_type}{field.required ? ' (required)' : ''}</span>
            </div>
            <div class="flex gap-2">
              <button on:click={() => openField(field)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Pencil class="h-4 w-4" /></button>
              <button on:click={() => deleteFieldId = field.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash class="h-4 w-4" /></button>
            </div>
          </div>
        {:else}
          <p class="text-sm text-gray-500">No fields</p>
        {/each}
      </div>
    </Card>

    <Card title="Submissions ({submissions.length})">
      <div class="mb-4 flex items-center justify-between">
        <Button variant="outline" on:click={exportSubmissions}>Export CSV</Button>
        <button on:click={() => selectedForm = null} class="text-sm text-gray-500">Close</button>
      </div>
      <div class="space-y-3">
        {#each submissions as sub}
          <div class="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs text-gray-400">{formatDate(sub.created_at)}</span>
              <button on:click={async () => { await supabase.from('form_submissions').delete().eq('id', sub.id); loadFormDetail(selectedForm!); }} class="text-xs text-red-500">Delete</button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              {#each Object.entries(sub.data as Record<string, unknown>) as [k, v]}
                <div><span class="font-medium text-gray-700 dark:text-gray-300">{k}:</span> <span class="text-gray-600 dark:text-gray-400">{String(v)}</span></div>
              {/each}
            </div>
          </div>
        {:else}
          <p class="text-sm text-gray-500">No submissions</p>
        {/each}
      </div>
    </Card>
  {/if}
</div>

<Modal title={editForm?.id ? 'Edit Form' : 'Create Form'} bind:open={formModal}>
  <div class="space-y-4">
    <Input label="Name" bind:value={editForm.name} required />
    <Input label="Slug" bind:value={editForm.slug} required />
    <Input label="Description" rows={3} bind:value={editForm.description} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => formModal = false}>Cancel</Button>
      <Button on:click={saveForm}>Save</Button>
    </div>
  </div>
</Modal>

<Modal title={editField?.id ? 'Edit Field' : 'Add Field'} bind:open={fieldModal}>
  <div class="space-y-4">
    <Input label="Label" bind:value={editField.label} required />
    <Select label="Type" bind:value={editField.field_type} options={[{value:'text',label:'Text'},{value:'email',label:'Email'},{value:'textarea',label:'Textarea'},{value:'number',label:'Number'},{value:'select',label:'Select'},{value:'checkbox',label:'Checkbox'},{value:'radio',label:'Radio'},{value:'date',label:'Date'}]} />
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <input type="checkbox" bind:checked={editField.required} class="rounded text-[rgb(var(--color-primary))]" />
      Required
    </label>
    <Input type="number" label="Sort Order" bind:value={editField.sort_order} />
    <Input label="Options (comma separated)" bind:value={editField.options} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => fieldModal = false}>Cancel</Button>
      <Button on:click={saveField}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteFormId !== null}
  <ConfirmDialog open={true} title="Delete Form" message="This will delete the form and all submissions." confirmText="Delete" on:confirm={deleteForm} on:cancel={() => deleteFormId = null} />
{/if}

{#if deleteFieldId !== null}
  <ConfirmDialog open={true} title="Delete Field" message="Remove this field?" confirmText="Delete" on:confirm={deleteField} on:cancel={() => deleteFieldId = null} />
{/if}
