<script>
	import {Button} from 'sveltestrap'
	import page from 'page';

	import Header from './Components/Header.svelte';
	import About from './Pages/About.svelte';
	import Home from './Pages/Home.svelte'

	let current = Home;
	page('/', () => (current = Home));
	page('/about', () => (current = About));
	page.start();
</script>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

<main>
	<Header />
	<svelte:component this={current} />
  </main>
