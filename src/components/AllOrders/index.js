// AllOrders.js
import { Component } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import Navbar from '../Navbar';
import './index.css';

class AllOrders extends Component {
  state = { orders: [], loading: true };

  componentDidMount() {
    this.getOrders();
  }

  getOrders = async () => {
    const token = Cookies.get("jwt_token");
    const res = await fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) this.setState({ orders: data, loading: false });
  };

  updateStatus = async (id, status) => {
    const token = Cookies.get("jwt_token");
    const order = this.state.orders.find(o => o.id === id);
    const updated = { ...order, status };

    const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) this.getOrders();
  };

  render() {
    const { orders, loading } = this.state;
    if (loading) return <p className="loading">Loading...</p>;

    return (
      <div className="orders-container">
        <Header />
        <Navbar />
        <h1 className="orders-heading">All Orders</h1>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Buyer</th><th>Contact</th><th>Address</th>
              <th>Items</th><th>Status</th><th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.buyer_name}</td>
                <td>{o.buyer_contact}</td>
                <td>{o.delivery_address}</td>
                <td>
                  <ul className="item-list">
                    {o.items.map((i, idx) => (
                      <li key={idx}>{i.name} - {i.quantity} x ₹{i.price}</li>
                    ))}
                  </ul>
                </td>
                <td className="status-cell">{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    className="status-dropdown"
                    onChange={e => this.updateStatus(o.id, e.target.value)}
                  >
                    {['Pending', 'Packed', 'Shipped', 'Delivered'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AllOrders;
