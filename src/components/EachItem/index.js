import {Component} from 'react'
import './index.css'

class EachItem extends Component{
    render(){
        const {eachProduct} = this.props
        const {id,name,price,quantity,image_url} = eachProduct
        return(
          <li key={id}>
            <img src={image_url} />
            <div>
                <p>{name}</p>
                <p>min quantity: {quantity}</p>
                <p>Wholesale Price:{price}</p>
            </div>
          </li>
        )
    }
}

export default EachItem