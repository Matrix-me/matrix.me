<script>
  import { isLoggedIn } from "./../stores/MatrixStore.js";
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
  let isLogged;
  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  isLoggedIn.subscribe((data) => {
    isLogged = data;
  });
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
          {#if !isLogged}
            <DropdownItem>
              <NavLink style="color: black;" href="/Login">Login</NavLink>
            </DropdownItem>
          {/if}
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>
