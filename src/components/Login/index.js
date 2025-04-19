import { Component } from 'react'
import Cookies from 'js-cookie'
import { Redirect, Link } from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isAdmin: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onSubmitSuccess = jwtToken => {
    const { history } = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/home')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({ showSubmitError: true, errorMsg })
  }

  submitForm = async event => {
    event.preventDefault()
    const { username, password } = this.state
    const {checkUser} = this.props;
    const {isAdmin} = this.state
    const userDetails = { username, password }
    if (username==="AGROADMIN"){
      this.setState({isAdmin: true})
    }
    else{
      this.setState({isAdmin: false})
    }
    // checkUser(isAdmin)
    localStorage.setItem("userDetails", userDetails)
    const url = 'http://localhost:5000/login'
    console.log(userDetails)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    console.log(JSON.stringify(userDetails))
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwtToken)   
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const { password } = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const { username } = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const { showSubmitError, errorMsg } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://media-hosting.imagekit.io/45606436064d43bf/download.png?Expires=1839580417&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=b2Dl-0mlIyU9txYVvvuXUhIGoPRc1cG982lCYQ2y7JSQTfRGzQvTeANx13HNpzGICQ0BCMhGb90oFui004tNnmspxpxVw1kzJj42nfFOgjirowWBv5NTihbiPbv8CbTOAsC3SP1dJjjY2IxvwmS3pdClx6GhHLO3Nid0dMhKxto1BcgqIK4r8XNbvfxPBiN04RivNImW5ah6E0OaQVLS58Tf5wLySwLaSkmSI6efM~60KsG6eXSgXEmtwqwl2p4Cdg137kjoeMq~fmpnx91W2cjcXsSp52g1aEdh7Z3ZUk3t5chgijG3I4lN~LOAhy9zl7c3Cgi1XD1M-JNWqik5dQ__"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://media-hosting.imagekit.io/45606436064d43bf/download.png?Expires=1839580417&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=b2Dl-0mlIyU9txYVvvuXUhIGoPRc1cG982lCYQ2y7JSQTfRGzQvTeANx13HNpzGICQ0BCMhGb90oFui004tNnmspxpxVw1kzJj42nfFOgjirowWBv5NTihbiPbv8CbTOAsC3SP1dJjjY2IxvwmS3pdClx6GhHLO3Nid0dMhKxto1BcgqIK4r8XNbvfxPBiN04RivNImW5ah6E0OaQVLS58Tf5wLySwLaSkmSI6efM~60KsG6eXSgXEmtwqwl2p4Cdg137kjoeMq~fmpnx91W2cjcXsSp52g1aEdh7Z3ZUk3t5chgijG3I4lN~LOAhy9zl7c3Cgi1XD1M-JNWqik5dQ__"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
        <p>New User</p>
        <Link to="/register">
          <p>Register</p>
        </Link>
      </div>
    )
  }
}

export default Login
