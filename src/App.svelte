<script>
	import {Button} from 'sveltestrap'
	import page from 'page';

	import Header from './Components/Header.svelte';
	import About from './Pages/About.svelte';
	import Home from './Pages/Home.svelte'
	import Spaces from './Pages/Spaces.svelte'

	let current = Home;
	page('/', () => (current = Home));
	page('/about', () => (current = About));
	page('/spaces', () => (current = Spaces));

	page.start();
</script>

<style lang="scss" global>
	@import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
	@import url('https://fonts.googleapis.com/css2?family=Koulen&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Koulen&family=Rajdhani:wght@300;400&display=swap');
	:global(body){
		margin: 0;
		padding: 0;
		background-color: #282a36;
	}
</style>

<main>
	<Header />
	<svelte:component this={current} />
</main>
