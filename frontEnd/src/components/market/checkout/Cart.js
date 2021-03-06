import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { handleStripeToken } from "../../../ReduxCycle/actions/stripe";
import isEmpty from "../../../utilis/isEmpty";
import Stripe from "react-stripe-checkout";
import { addNewOrder } from "../../../ReduxCycle/actions/ordersAction";
import { useNavigate } from "react-router-dom";

function Cart({ cart, loading, selectedProduct, phone }) {
  let AddNewOrder = bindActionCreators(addNewOrder, useDispatch());
  let navigate = useNavigate();

  const HandleStripeToken = bindActionCreators(
    handleStripeToken,
    useDispatch()
  );
  const stripeTokenHandler = (token) => {
    token["phone"] = phone;
    HandleStripeToken({
      token: token.id,
      amount: cart.totalPrice,
      cartProducts: selectedProduct,
    });
    const orderData = {
      phone,
      cart: selectedProduct,
      email: token.email,
      name: token.card.name,
      paymentId: token.id,
      address: `city: ${token.card.address_city} country: ${token.card.addresscountry}`,
    };
    AddNewOrder(orderData, navigate);
  };

  return isEmpty(cart) && loading ? (
    <div className="spinner-border my-4" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  ) : selectedProduct.length > 0 ? (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-cart-arrow-down"></i> Cart{" "}
        <span className="badge bg-secondary float-right">{cart.totalQty}</span>
      </div>
      <ul className="list-group list-group-flush">
        {selectedProduct.map((pro) => (
          <li
            key={pro._id}
            className="list-group-item d-flex justify-content-between lh-sm"
          >
            <div>
              <h6 className="my-0">{pro.name}</h6>
              <small className="text-muted">Brief description</small>
            </div>
            <span className="text-muted">${pro.price}</span>
          </li>
        ))}
      </ul>
      <div className="card-footer border-info">
        {phone.length > 10 && !isNaN(phone) ? (
          <Stripe
            name="React E-commerce"
            // image="https://www.vidhub.co/assets/logos/vidhub-icon-2e5c629f64ced5598a56387d4e3d0c7c.png"
            stripeKey="pk_test_wpsaZLzicJCvZLC0yZMd6QHf00yOyDoak5"
            amount={cart.totalPrice * 100}
            token={stripeTokenHandler}
            description={`Your total amount $${cart.totalPrice}`}
            shippingAddress
            billingAddress
          >
            <button type="submit" className="btn btn-block btn-info text-white">
              Pay Now <strong>${cart.totalPrice}</strong>
            </button>
          </Stripe>
        ) : null}
      </div>
    </div>
  ) : (
    <strong className="text-danger">
      {" "}
      <i className="fas fa-exclamation-circle"></i> There is no items
    </strong>
  );
}

export default Cart;
