<script>
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink,
      Dropdown,
      DropdownToggle,
      DropdownMenu,
      DropdownItem
    } from 'sveltestrap';
    
    let isOpen = false;
  
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>

  <Navbar style="font-family: 'Koulen', cursive; font-size: 22px" class="header" dark expand="md">
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
          <NavLink href="/about">About</NavLink>
        </NavItem>
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Account</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Log in</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Collapse>
  </Navbar>