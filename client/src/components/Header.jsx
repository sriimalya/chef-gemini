import ChefIcon from '../assets/chef-icon.png'
import {HistoryIcon, Bookmark} from 'lucide-react'

function Header() {
  return (
    <header>
      <div className='left-item'>
        <img src={ChefIcon} alt="logo"/>
        <p>Chef Gemini</p>
      </div>
      <div className='right-item'>
        <HistoryIcon/>
        <Bookmark/> 
        <button className='user-icon'></button>       
      </div>
    </header>
  )
}

export default Header