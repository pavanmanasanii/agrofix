import { Component } from "react";
import Cookies from 'js-cookie';
import EachItem from '../EachItem';
import Navbar from "../Navbar";
import './index.css';
import Header from "../Header";

const apiconstants = {
    success: "SUCCESS",
    failure: "FAILURE",
    inprogress: "INPROGRESS",
    initial: "INITIAL"
};

class Home extends Component{
    state = {
        productsList: [],
        apistatus: apiconstants.initial
    }

    componentDidMount(){
        this.getProducts();
    }
    
    getProducts = async () => {
        this.setState({apistatus: apiconstants.inprogress});
        const url = "http://localhost:5000/api/products";
        const jwtToken = Cookies.get("jwt_token");
        console.log(jwtToken);
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${jwtToken}`
            },
        };
        try{
            const response = await fetch(url, options);
            const data = await response.json();
            if(response.ok === true){
                this.setState({productsList: data, apistatus: apiconstants.success});
            }
            else{
                this.setState({apistatus: apiconstants.failure});
            }
        }
        catch(error){
            console.log(error);
            this.setState({apistatus: apiconstants.failure});
        }
    }

    render(){
        const {productsList} = this.state;
        const {isAdmin} = this.props
        return(
            <div className="home-container">
                <Header />
                <Navbar isAdmin={isAdmin}/>
                <div className="products-container">
                    <ul className="products-list">
                        {productsList.map(eachProduct => (
                            <EachItem eachProduct={eachProduct} key={eachProduct.id}/> 
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Home;
