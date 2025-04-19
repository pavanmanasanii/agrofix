import {Component} from 'react';
import Cookies from "js-cookie"
import Header from '../Header';
import Navbar from '../Navbar';
import './index.css'

class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProductId: '',
      name: '',
      price: '',
      quantity: '',
      image_url: ''
    };
  }

  componentDidMount() {
    const jwtToken = Cookies.get("jwt_token")
    const options = {
        method: 'GET',
        headers: {
         Authorization: `Bearer ${jwtToken}`
        }
        
    }
    fetch('http://localhost:5000/api/products',options)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ products: data });
      })
      .catch((err) => console.error('Fetch error:', err));
  }

  handleSelectChange = (e) => {
    const id = e.target.value;
    const selected = this.state.products.find((p) => p.id === parseInt(id));
    if (selected) {
      this.setState({
        selectedProductId: selected.id,
        name: selected.name,
        price: selected.price,
        quantity: selected.quantity,
        image_url: selected.image_url
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const jwtToken = Cookies.get("jwt_token")
    const { selectedProductId, name, price, quantity, image_url } = this.state;

    fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        name,
        price,
        quantity,
        image_url
      })
    })
      .then((res) => {
        if (res.ok) {
          alert('Product updated successfully');
        } else {
          alert('Failed to update product');
        }
      })
      .catch((err) => console.error('Update error:', err));
  };

  render() {
    return (
        <div className="edit-product-container">
            <Header />
            <div className="edit-product-content">
                <Navbar />
                <div className="edit-product-form-container">
                    <h2 className="edit-product-title">Edit Product</h2>
                    <select className="product-select" onChange={this.handleSelectChange} value={this.state.selectedProductId}>
                        <option value="">Select a product</option>
                        {this.state.products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>

                    {this.state.selectedProductId && (
                        <form className="product-form" onSubmit={this.handleSubmit}>
                            <input
                                className="product-input"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                                required
                            />
                            <input
                                className="product-input"
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={this.state.price}
                                onChange={this.handleChange}
                                required
                            />
                            <input
                                className="product-input"
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={this.state.quantity}
                                onChange={this.handleChange}
                                required
                            />
                            <input
                                className="product-input"
                                type="text"
                                name="image_url"
                                placeholder="Image URL"
                                value={this.state.image_url}
                                onChange={this.handleChange}
                                required
                            />
                            <button className="submit-button" type="submit">Update Product</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
  }
}

export default EditProduct;
