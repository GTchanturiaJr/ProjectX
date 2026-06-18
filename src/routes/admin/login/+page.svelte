<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/config/supabase';
  import { Button, Input, Card } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { user, userRoles, isLoading } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let isSignUp = false;
  let loading = false;

  onMount(() => {
    if (!$isLoading && $user) {
      redirectBasedOnRoles();
    }
  });

  function redirectBasedOnRoles() {
    if ($userRoles.length > 0 && !$userRoles.includes('customer')) {
      goto('/admin/dashboard');
    } else {
      goto('/');
    }
  }

  async function submit() {
    loading = true;
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) addToast(error.message, 'error');
        else addToast('Check your email to confirm your account', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) addToast(error.message, 'error');
        else {
          const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', (await supabase.auth.getUser()).data.user?.id);
          if (roles && roles.length > 0 && !roles.some(r => r.role === 'customer')) {
            goto('/admin/dashboard');
          } else {
            addToast('Access denied. Admin role required.', 'error');
            await supabase.auth.signOut();
          }
        }
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
  <Card className="w-full max-w-md">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
      <p class="text-sm text-gray-500 mt-2">{isSignUp ? 'Create an admin account' : 'Sign in to access the admin panel'}</p>
    </div>

    <form on:submit|preventDefault={submit} class="space-y-4">
      <Input label="Email" type="email" bind:value={email} required />
      <Input label="Password" type="password" bind:value={password} required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
    </form>

    <div class="mt-4 text-center">
      <button on:click={() => isSignUp = !isSignUp} class="text-sm text-[rgb(var(--color-primary))] hover:underline">
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </div>

    <p class="mt-4 text-xs text-center text-gray-500">
      Note: After sign up, you need to be assigned an admin role via Supabase.
    </p>
  </Card>
</div>
