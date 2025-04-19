import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/" className="website-logo-link">
          <img
            className="website-logo"
            src="https://media-hosting.imagekit.io/45606436064d43bf/download.png?Expires=1839580417&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=b2Dl-0mlIyU9txYVvvuXUhIGoPRc1cG982lCYQ2y7JSQTfRGzQvTeANx13HNpzGICQ0BCMhGb90oFui004tNnmspxpxVw1kzJj42nfFOgjirowWBv5NTihbiPbv8CbTOAsC3SP1dJjjY2IxvwmS3pdClx6GhHLO3Nid0dMhKxto1BcgqIK4r8XNbvfxPBiN04RivNImW5ah6E0OaQVLS58Tf5wLySwLaSkmSI6efM~60KsG6eXSgXEmtwqwl2p4Cdg137kjoeMq~fmpnx91W2cjcXsSp52g1aEdh7Z3ZUk3t5chgijG3I4lN~LOAhy9zl7c3Cgi1XD1M-JNWqik5dQ__"
            alt="website logo"
          />
        </Link>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
