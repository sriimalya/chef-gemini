import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import useAuth from "../auth/useAuth";

import ChefIcon from "../assets/chef-icon.png";
import { Bookmark, LogOutIcon } from "lucide-react";

function Header() {
  const { user, logout } = useAuth();
  const username = user.username;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header>
      <Link to="/" className="left-link">
        <div className="left-item">
          <img src={ChefIcon} alt="logo" />
          <p>Chef Gemini</p>
        </div>
      </Link>
      <nav className="right-item">
        {/* <HistoryIcon className="icon" /> */}

        <Link to="/bookmarks">
          <Bookmark className="icon" />
        </Link>

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-icon"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {username.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="dropdown">
              <button className="logout-btn" onClick={logout}>
                Logout
                <LogOutIcon size={18} />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
