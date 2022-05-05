<script>
	import Spaces from './Spaces.svelte';
    import { Col, Row } from "sveltestrap";
</script>

<div class="container">
    <h1 class="title">What is Matrix?</h1>
    <p class="title">
        "Matrix is an open source project that publishes the Matrix open
        standard for secure, decentralised, real-time communication, and its
        Apache licensed reference implementations." ~ Matrix.org
    </p>
    <div
        style="webkit-border-radius: 25px;-moz-border-radius: 25px;border-radius: 25px;width:560px;margin:0 auto;overflow:hidden; margin-top: 40px;"
    >
        <iframe
            title="Intro Video by. DenshiVideo"
            id="odysee-iframe"
            width="560"
            height="315"
            src="https://odysee.com/$/embed/just-use-matrix./4155d8d8c49addd0ad0790295ee70363cf1e4f98?r=BMDJh1LPjdxukf2yaYSsH71azMkXJefp"
            allowfullscreen
        />
    </div>
</div>

<div class="container">
    <Row>
        <Col xs="6">
            <div class="spaces">
                <img
                    class="photo"
                    src="images/space-screen.png"
                    alt="spaces-in-element"
                />
            </div>
        </Col>
        <Col xs="6" class="vertical-text">
            <h2 style="position:absolute">Matrix Spaces</h2>
            <div class="spaces">
                <p style="margin: auto;">
                    Spaces are concept simmilar to Discord servers. It's a
                    collection of rooms tied toghether as Space. You can create
                    your own Spaces or join existing one. Unlike Discord, Matrix
                    respects your privacy - rooms can be encrypted, as well as
                    your direct messages.
                </p>
            </div>
        </Col>
    </Row>
</div>

<Spaces />

<style>
    .container {
        font-family: "Rajdhani", sans-serif;
        text-align: center;
        color: #f8f8f2;
        width: 80%;
        margin: auto;
        margin-top: 10%;
    }
    .spaces {
        display: flex;
        height: 100%;
    }

    .photo {
        width: 100%;
    }
</style>
