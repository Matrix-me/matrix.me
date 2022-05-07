<script>
    import axios from "axios";
    import { Form, FormGroup, Input, Label, Button } from "sveltestrap";
    import { matrixAuth } from "../stores/MatrixStore.js";
    let base_url;
    let credentials = { instance: "", username: "", password: "" };

    const login = async (e) => {
        e.preventDefault();
        //make sure the instance url is a valid domain
        const regex = new RegExp(
            "^((?!-)[A-Za-z0-9-]" + "{1,63}(?<!-)\\.)" + "+[A-Za-z]{2,6}"
        );

        if (!regex.test(credentials.instance)) {
            alert("That's not valid instance domain");
            return;
        } else if (credentials.username.includes("@")) {
            alert("Type just username, without @");
        }
        //we are (maybe) temporary fetching the api because of issue in matrix-js-sdk
        //we have to get the server endpoint
        await axios
            .get(`https://${credentials.instance}/.well-known/matrix/client`)
            .then((response) => response.data)
            .then((data) => {
                base_url = data["m.homeserver"].base_url;
            })
            .catch((error) => {
                alert("Something went wrong: " + error);
            });

        //next we can authenticate our user and eventualy save auth data in store for future use
        axios
            .post(`${base_url}/_matrix/client/r0/login`, {
                type: "m.login.password",
                user: credentials.username,
                password: credentials.password,
            })
            .then((response) => {
                matrixAuth.set({
                    user_id: response.data.user_id,
                    access_token: response.data.access_token,
                    home_server: response.data.home_server,
                    device_id: response.data.device_id,
                });
                alert("Login succesful")
            })
            .catch((error) => {
                alert("Something went wrong, sorry. Error: " + error);
            });
    };

    matrixAuth.subscribe(data => {
        console.log(data)
    })

</script>

<div class="container">
    <Form on:submit={(e) => login(e)}>
        <FormGroup>
            <Label>Your Matrix instance</Label>
            <Input
                type="text"
                name="instance"
                id="instance"
                placeholder="e.g. Matrix.org"
                bind:value={credentials.instance}
            />
        </FormGroup>
        <FormGroup>
            <Label>Your username</Label>
            <Input
                type="text"
                name="username"
                id="username"
                placeholder="e.g. johndoe"
                bind:value={credentials.username}
            />
        </FormGroup>
        <FormGroup>
            <Label>Your password</Label>
            <Input
                type="password"
                name="password"
                id="password"
                placeholder="Super password!"
                bind:value={credentials.password}
            />
        </FormGroup>
        <Button type="submit">Log in</Button>
    </Form>
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
</style>
