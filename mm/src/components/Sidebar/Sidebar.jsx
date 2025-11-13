import React from 'react';
import { NavLink } from 'react-router-dom';
import { t } from '../../utils/i18n';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" end>
            {t('systemOverview')}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/asset-holdings" className="nav-link">
            {t('assetHoldings')}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;