import HeaderMenu from "./HeaderMenu";

import "./Header.css";

const Header = () => {
    return (
        <div className="header-contents">
            <div>
                <h1 className="header-title">SQL Viewer</h1>
            </div>
            <div>
                <HeaderMenu />
            </div>
        </div>
    );
};

export default Header;
