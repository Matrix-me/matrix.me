<script>
    import Card from "./../Components/Card.svelte";
    import Search from "./../Components/Search.svelte";
</script>

<Search />
<div class="results-container">
    <Card />
</div>

<style>
    .results-container {
        font-family: "Rajdhani", sans-serif;
        text-align: center;
        color: #f8f8f2;
        width: 80%;
        margin: auto;
        margin-top: 5%;
        display: flex;
        flex-basis: auto;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
