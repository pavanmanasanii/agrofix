import { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';

class OrderPlacementForm extends Component {
  state = {
    buyer_name: '',
    buyer_contact: '',
    delivery_address: '',
    items: [], // [{id, name, price, quantity}]
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch('http://localhost:5000/api/products', options);
      const data = await response.json();
      const itemsWithQuantity = data.map(product => ({
        ...product,
        Bulkquantity: 0,
      }));
      this.setState({ items: itemsWithQuantity, loading: false });
    } catch (error) {
      this.setState({ error: 'Failed to load products', loading: false });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  decrementQuantity = id => {
    const updatedItems = this.state.items.map(item => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    this.setState({ items: updatedItems });
  };

  incrementQuantity = id => {
    const updatedItems = this.state.items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    this.setState({ items: updatedItems });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { buyer_name, buyer_contact, delivery_address, items } = this.state;
    const selectedItems = items.filter(item => item.quantity > 0);

    const orderPayload = {
      buyer_name,
      buyer_contact,
      delivery_address,
      items: JSON.stringify(selectedItems),
    };

    try {
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        alert('Order placed successfully');
        this.setState({
          buyer_name: '',
          buyer_contact: '',
          delivery_address: '',
          items: this.state.items.map(i => ({ ...i, quantity: 0 })),
        });
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  render() {
    const { buyer_name, buyer_contact, delivery_address, items, loading, error } = this.state;

    return (
      <div className="order-placement-form">
        <h2 className="form-title">Place Order</h2>
        <form onSubmit={this.handleSubmit} className="order-form">
          <input
            type="text"
            name="buyer_name"
            placeholder="Buyer Name"
            value={buyer_name}
            onChange={this.handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="buyer_contact"
            placeholder="Contact Number"
            value={buyer_contact}
            onChange={this.handleChange}
            required
            className="form-input"
          />
          <textarea
            name="delivery_address"
            placeholder="Delivery Address"
            value={delivery_address}
            onChange={this.handleChange}
            required
            className="form-textarea"
          />
          <h3 className="items-title">Available Items</h3>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul className="items-list">
              {items.map(item => (
                <li key={item.id} className="item">
                  <span className="item-name">{item.name} - ₹{item.price}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => this.decrementQuantity(item.id)} className="quantity-btn">
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button type="button" onClick={() => this.incrementQuantity(item.id)} className="quantity-btn">
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button type="submit" className="submit-btn">Submit Order</button>
        </form>
      </div>
    );
  }
}

export default OrderPlacementForm;
