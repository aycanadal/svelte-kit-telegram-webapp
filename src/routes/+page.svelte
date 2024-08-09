<script lang="ts">
    import { page } from "$app/stores";
    const firstName = $page.url.searchParams.get('firstName')
 </script>

<h1>Hello {firstName}</h1>
