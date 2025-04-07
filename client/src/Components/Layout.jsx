// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* <Navbar /> */}
      <Outlet /> 
    </div>
  );
}

export default Layout;
