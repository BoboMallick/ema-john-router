import React from 'react';
import { Link } from 'react-router-dom';

const Cart = (props) => {
    const cart = props.cart;
    // const total = cart.reduce((total, prd) => total + prd.price, 0);
    let total = 0;
    for (let i = 0; i <cart.length; i++) {
        const product = cart[i];
        total = total + product.price;
    }


    let shipping = 0;
    if(total > 35){
        shipping = 0;
    }
    else if(total > 15){
        shipping = 4.99;

    }else if(total > 0){
        shipping = 12.99;
    }

    const tax = total / 10;
    const formatNumber = num => {
        const precision = num.toFixed(2);
        return Number(precision);
    }


    return (
        <div>
            <h3>Order Summary</h3>
            <p>Items Ordered: {cart.length}</p>
            <p>Prodduct Price: {formatNumber (total)}</p>
            <p><small>shipping Cost: {formatNumber (shipping)}</small></p>
            <p><small>Tax + VAT: {formatNumber (tax)}</small></p>
            <p>Total Price: {formatNumber (total + shipping + tax)}</p>
            <Link to="/review">
            <button className="main-button">Review Order</button>
            </Link>
        </div>
    );
};

export default Cart;