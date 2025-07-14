import { useState, useRef, useEffect } from "react";
import useAuth from "../auth/useAuth";

import ChefIcon from '../assets/chef-icon.png';
import { HistoryIcon, Bookmark, LogOutIcon } from 'lucide-react';

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
      <div className="left-item">
        <img src={ChefIcon} alt="logo" />
        <p>Chef Gemini</p>
      </div>
      <div className="right-item">
        <HistoryIcon className="icon" />
        <Bookmark className="icon" />

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-icon"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            {username.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="dropdown">
              <button className="logout-btn" onClick={logout}>Logout
                <LogOutIcon size={18}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
