<script lang="ts">
    import { page } from "$app/stores";
    const firstName = $page.url.searchParams.get('firstName')
 </script>

<h1>Hello {firstName}</h1>

<a href="/signup">Sign Up Page</a>
test
