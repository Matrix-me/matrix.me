<script>
    import Card from "$lib/Card.svelte";
    import Search from "$lib/Search.svelte";
</script>

<Search />
<div class="results-container">
    <!-- these are temporary placeholder images for development time. -->
    <Card description="Best photography community" banerCircleImg="https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg?cs=srgb&dl=pexels-alex-andrews-1203803.jpg&fm=jpg" banerImg="https://images.pexels.com/photos/3587757/pexels-photo-3587757.jpeg?cs=srgb&dl=pexels-phil-desforges-3587757.jpg&fm=jpg"/>
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
