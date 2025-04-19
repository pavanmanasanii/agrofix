import { Component, isValidElement } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register';
import Home from './components/Home';
import AllOrders from './components/AllOrders';
import EditProduct from './components/EditProduct';
import OrderPlacementForm from './components/OrderPlacementForm';
import MyOrders from './components/MyOrders'
import ProtectedRoute from './components/ProtectectedRoute';
import './App.css';

class App extends Component {
  state = {isAdmin: false}

  checkUser = (value) => {
    this.setState({isAdmin: value})
  }

  render(){
    const {isAdmin} = this.state
    return (
      <BrowserRouter>
      <Switch>
          <Route exact path="/login" component={Login} isAdmin={isAdmin} checkUser={this.checkUser}/>
          <Route exact path="/register" component={Register} />
          <ProtectedRoute exact path="/home" component={Home} isAdmin={isAdmin} />
          <ProtectedRoute exact path="/allorders" component={AllOrders}/>
          <ProtectedRoute exact path="/editproducts" component={EditProduct}/>
          <ProtectedRoute exact path="/orderplacement" component={OrderPlacementForm}/>
          <ProtectedRoute exact path="/myorders/:id" component={MyOrders}/>
          <ProtectedRoute />
      </Switch>
      </BrowserRouter>
    );
  }
  
}

export default App;
