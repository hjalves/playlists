import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const Sidebar = () => (
  <nav className="col-sm-3 col-md-2 d-none d-sm-block sidebar">
    <Nav vertical pills>
      <NavItem>
        <RouterNavLink exact className="nav-link" to='/'>
          <FontAwesome name="desktop" fixedWidth />{' '}
          Overview
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact className="nav-link" to='/songs'>
          <FontAwesome name="music" fixedWidth />{' '}
          Music
        </RouterNavLink>
      </NavItem>
      <NavItem>
        <RouterNavLink exact className="nav-link" to='/users'>
          <FontAwesome name="user-o" fixedWidth />{' '}
          Users
        </RouterNavLink>
      </NavItem>
    </Nav>

    <Nav vertical pills>
      <NavItem>
        <NavLink href="/api/v1/" target="_blank">
          <FontAwesome name="book" fixedWidth />{' '}
          API Doc
        </NavLink>
        <NavLink href="https://github.com/hjalves/playlists" target="_blank">
          <FontAwesome name="github" fixedWidth />{' '}
          GitHub
        </NavLink>
      </NavItem>
    </Nav>
  </nav>
);

export default Sidebar;
