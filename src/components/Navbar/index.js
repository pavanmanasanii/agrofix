import { Component } from "react";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import './index.css';

class Navbar extends Component {

  render() {
    const { isAdmin } = this.props;
    return (
      <div className="navbar-container">
        {isAdmin ?
          <div className="admin-links">
            <Link to="/home" className="navbar-link"><p>All Products</p></Link>
            <Link to="/allorders" className="navbar-link"><p>All Orders</p></Link>
            <Link to="/editproducts" className="navbar-link"><p>Edit Products</p></Link>
          </div> :
          <div className="user-links">
            <Link to="/home" className="navbar-link"><p>Products</p></Link>
            <Link to="/orderplacement" className="navbar-link"><p>Order Placement Form</p></Link>
            <Link to="/myorders" className="navbar-link"><p>My Orders</p></Link>
          </div>
        }
      </div>
    )
  }
}

export default Navbar;
