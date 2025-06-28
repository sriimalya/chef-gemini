import ChefIcon from '../assets/chef-icon.png'

function Header() {
  return (
    <header>
        <img src={ChefIcon} alt="logo"/>
        <p>Chef Gemini</p>
    </header>
  )
}

export default Header