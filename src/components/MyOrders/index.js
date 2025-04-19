import {Component} from 'react';
import Cookies from 'js-cookie';
import './index.css';

class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    const jwtToken = Cookies.get("jwt_token");
    const options = {
        method: 'GET',
        headers: {
         Authorization: `Bearer ${jwtToken}`,
        }     
    };
    fetch(`http://localhost:5000/api/orders/${id}`, options)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => this.setState({ orders: data, loading: false }))
      .catch((error) => this.setState({ error, loading: false }));
  }

  render() {
    const { orders, loading, error } = this.state;
    if (loading) return <p className="loading-message">Loading orders...</p>;
    if (error) return <p className="error-message">Error: {error.message}</p>;

    return (
      <div className="orders-container">
        <h2 className="orders-header">My Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders-message">No orders found.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.id} className="order-item">
                <strong className="order-id-label">Order ID:</strong> {order.id}<br />
                <strong className="order-buyer-label">Buyer:</strong> {order.buyer_name}<br />
                <strong className="order-contact-label">Contact:</strong> {order.buyer_contact}<br />
                <strong className="order-address-label">Address:</strong> {order.delivery_address}<br />
                <strong className="order-status-label">Status:</strong> {order.status}<br />
                <strong className="order-items-label">Items:</strong>
                <ul className="order-items-list">
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item-name">{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default MyOrders;
