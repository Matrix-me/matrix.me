<div class="card">
    <div class="baner">
        <!-- these are temporary placeholder images for development time. -->
        <img
            class="baner-img"
            src="https://images.pexels.com/photos/3587757/pexels-photo-3587757.jpeg?cs=srgb&dl=pexels-phil-desforges-3587757.jpg&fm=jpg"
            alt=""
        />
    </div>
    <div class="circle-baner">
        <img
            class="circle-img"
            src="https://images.pexels.com/photos/1203803/pexels-photo-1203803.jpeg?cs=srgb&dl=pexels-alex-andrews-1203803.jpg&fm=jpg"
            alt=""
        />
    </div>
    <div class="description">
        <h5 style="margin: auto;">Photography space</h5>
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
