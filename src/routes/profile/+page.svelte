<script lang="ts">
	export let data;
</script>

<h1>Profile:</h1>

<div class="card">

	{data.user?.telegramId}
	<br />
	*********
	<br />
	Created: {data.user?.createdAt}
	
</div>

<style>
	.card {
		border: 1px solid black;
		margin: 10px;
		padding: 10px;
		width: max-content;
	}
</style>
