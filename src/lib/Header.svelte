<script>
  import axios from "axios";
  import { matrixAuth, IsUserLogged } from "./../stores/MatrixStore.js";
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap";

  let isOpen = false;
  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  async function handleLogOut() {
    let base_url = $matrixAuth.base_url;
    let access_token = $matrixAuth.access_token;
    await axios
      .post(
        `${base_url}/_matrix/client/r0/logout?access_token=${access_token}`,
        null
      )
      .then((response) => console.log(response))
      .catch((error) => {
        alert("Something went wrong, sorry. Error: " + error);
      });
    matrixAuth.set("");
  }
</script>

<Navbar
  style="font-family: 'Koulen', cursive; font-size: 22px"
  class="header"
  dark
  expand="md"
>
  <Nav class="ms-auto">
    <NavLink style="color: #f8f8f2;" href="/">Matrix.me</NavLink>
  </Nav>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink href="/">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/Spaces">Spaces</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/About">About</NavLink>
      </NavItem>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>Account</DropdownToggle>
        <DropdownMenu end>
          {#if !$IsUserLogged}
            <DropdownItem>
              <NavLink style="color: black;" href="/Login">Log in</NavLink>
            </DropdownItem>
          {:else}
            <DropdownItem>
              <NavLink style="color: black;" href="/" on:click={handleLogOut}
                >Log out</NavLink
              >
            </DropdownItem>
          {/if}
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>
