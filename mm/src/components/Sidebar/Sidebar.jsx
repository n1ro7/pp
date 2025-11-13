import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            系统概览
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/asset-holdings" className="nav-link">
            持仓数据
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;