<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<h1>Sign Up</h1>
<form method="POST" use:enhance>
	<label for="telegramId">Telegram Id:</label>
	<div><input id="telegramId" type="text" name="telegramId" /></div>
	<label for="password">Password:</label>
	<div><input id="password" type="password" name="password" /></div>
	<div><button>Sign up</button></div>
	<p class="red">{form?.error ?? ''}</p>
</form>

<a href="/profile">Go to profile</a>

{#if form?.token}
	<Modal showModal>
		<p>Please copy and save this token somewhere safe:</p>
		<p id="token">{form?.token}</p>
	</Modal>
{/if}
