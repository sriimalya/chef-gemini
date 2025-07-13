import useAuth from "../auth/useAuth";

import ChefIcon from '../assets/chef-icon.png'
import {HistoryIcon, Bookmark} from 'lucide-react'

function Header() {
  const { user } = useAuth();
  const username = user.username
  return (
    <header>
      <div className='left-item'>
        <img src={ChefIcon} alt="logo"/>
        <p>Chef Gemini</p>
      </div>
      <div className='right-item'>
        <HistoryIcon className="icon"/>
        <Bookmark className="icon"/> 
        <button className='user-icon'>{username.charAt(0).toUpperCase()}</button>       
      </div>
    </header>
  )
}

export default Header