<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	export let form: ActionData;
	let telegramId:string;
</script>

<h1>Log In</h1>

<form method="POST" action="?/login" use:enhance>
	<label for="telegramId">Telegram Id:</label>
	<div><input bind:value={telegramId} id="telegramId" type="text" name="telegramId" /></div>
	<label for="password">Password:</label>
	<div><input id="password" type="password" name="password" /></div>
	<div><button>Log in</button></div>
	<p class="red">{form?.error ?? ''}</p>
</form>

{#if form?.success}

	<Modal showModal buttonText="Cancel">

		<p>Please enter token:</p>

		<form method="POST" action="?/token" use:enhance>
			<input bind:value={telegramId} id="telegramId" type="text" name="telegramId" hidden />
			<label for="token">Token:</label>
			<div><input id="token" type="text" name="token" /></div>
			<div><button>Log in</button></div>
		</form>

	</Modal>

{/if}

{#if form?.newToken}
    <Modal showModal onClose={()=>goto("/profile")}>
		<p>The token has changed!</p>
        <p>Please copy and save the newtoken somewhere safe:</p>
         <p>{form?.newToken}</p>
        </Modal>
{/if}
