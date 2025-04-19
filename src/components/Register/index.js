import { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    errorMsg: '',
    successMsg: '',
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async event => {
    event.preventDefault()
    const { name, email, password } = this.state
    const jwtToken = Cookies.get("jwt_token")
    const userDetails = { name, email, password }
    const url = 'http://localhost:5000/register/'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
     console.log(response)
    if (response.ok) {
      this.setState({ successMsg: data.message || 'Registered successfully', errorMsg: '' })
      const {history} = this.props
      history.replace('/login')
    } else {
      this.setState({ errorMsg: data.error || 'Registration failed', successMsg: '' })
    }
  }

  render() {
    const jwtToken = Cookies.get("jwt_token")
    if(jwtToken !== undefined){
        return <Redirect to="/home"/>
    }
    const { name, email, password, errorMsg, successMsg } = this.state

    return (
      <div>
        <h2>Buyer Registration</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Name"
            onChange={this.handleChange}
          />
          <br />
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={this.handleChange}
          />
          <br />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={this.handleChange}
          />
          <br />
          <button type="submit">Register</button>
        </form>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      </div>
    )
  }
}

export default Register
