<script>
    export let description;
    export let banerImg;
    export let banerCircleImg
</script>

<div class="card">
    <div class="baner">
        <img
            class="baner-img"
            src={banerImg}
            alt="Baner img"
        />
    </div>
    <div class="circle-baner">
        <img
            class="circle-img"
            src={banerCircleImg}
            alt="Circle baner img"
        />
    </div>
    <div class="description">
        <h5 style="margin: auto;">{description}</h5>
    </div>
</div>

<style>
    .card {
        font-family: "Rajdhani", sans-serif;
        width: 200px;
        height: 350px;
        background-color: #44475a;
        margin: 7px;
        position: relative;
    }
    .baner,
    .baner-img {
        object-fit: cover;
        width: 100%;
        height: 280px;
        text-align: center;
    }
    .circle-baner {
        height: 100px;
        width: 100px;
        background-color: red;
        border-radius: 50%;
        display: inline-block;
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        outline-style: solid;
        outline-color: #6272a4;
    }
    .circle-img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .description {
        height: 100%;
        display: flex;
    }
</style>
