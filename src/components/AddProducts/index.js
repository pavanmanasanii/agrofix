import {Component} from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import Navbar from '../Navbar';
import './index.css';

class AddProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: '',
      quantity: '',
      image_url: '',
      successMessage: '',
      errorMessage: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const {name, price, quantity, image_url } = this.state;
    const newProduct = { name, price, quantity, image_url };

    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        this.setState({
          successMessage: 'Product added successfully!',
          errorMessage: '',
          name: '',
          price: '',
          quantity: '',
          image_url: '',
        });
      } else {
        this.setState({
          errorMessage: 'Failed to add product.',
          successMessage: '',
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: 'Error occurred while adding the product.',
        successMessage: '',
      });
    }
  };

  render() {
    const { name, price, quantity, image_url, successMessage, errorMessage } = this.state;

    return (
      <div className="add-product-container">
        <Header />
        <div className="add-product-content">
          <Navbar />
          <div className="form-wrapper">
            <h1 className="form-title">Add New Product</h1>
            <form onSubmit={this.handleSubmit} className="product-form">
              <div className="form-field">
                <label htmlFor="name">Product Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="image_url">Image URL:</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={image_url}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Add Product</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default AddProducts;
