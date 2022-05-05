<script>
    import { Input } from "sveltestrap";
</script>

<div class="container">
    <input placeholder="Foss space..." class="space-input" type="text">
</div>

<style>
    .container {
        font-family: "Rajdhani", sans-serif;
        text-align: center;
        color: #f8f8f2;
        width: 80%;
        margin: auto;
        margin-top: 10%;
    }
    .space-input,
    .space-input:focus {
        border: none;
        outline: none;
        background-color: transparent;
        color: white;
        border-bottom: 1px white solid;
        font-size: 22px;
        text-align: center;
        top: 30%;
        left: 50%;
        font-weight: 100;
        width: 70%;
    }
    .space-input::placeholder {
        font-weight: 100;
        color: rgba(255, 255, 255, 0.2);
    }
</style>
