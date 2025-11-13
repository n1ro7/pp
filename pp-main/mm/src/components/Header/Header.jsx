import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">资产管理系统</div>
      <div className="header-right">
        <span className="user-info">欢迎，管理员</span>
      </div>
    </header>
  );
};

export default Header;