import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Love ❤ Locker</Link>
        </li>
        <li>
          <Link to="/viewer">Love ❤ Locker ❤ Viewer</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;