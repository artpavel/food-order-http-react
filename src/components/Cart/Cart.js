import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Checkout from './Checkout';

const Cart = props => {
  // show goods
  const cartCtx = useContext(CartContext);
  // show form address
  const [isCheckout, setIsCheckout] = useState(false);
  // show request order to server
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const totalAmount = `$${ cartCtx.totalAmount.toFixed(2) }`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = item => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  // send cart on server
  const submitOrderHandler = async userData => {
    setIsSubmitting(true);

    await fetch('https://react-http-a33ab-default-rtdb.firebaseio.com/order.json', {
      method: 'POST',
      body: JSON.stringify({ user: userData, orderedItems: cartCtx.items })
    }).catch();

    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={ classes['cart-items'] }>
      { cartCtx.items.map(item => (
        <CartItem
          key={ item.id }
          name={ item.name }
          amount={ item.amount }
          price={ item.price }
          onRemove={ cartItemRemoveHandler.bind(null, item.id) }
          onAdd={ cartItemAddHandler.bind(null, item) }
        />
      )) }
    </ul>
  );

  // when click button ORDER
  const modalAction = (
    <div className={ classes.actions }>
      <button className={ classes['button--alt'] }
              onClick={ props.onClose }
      >
        Close
      </button>
      {
        hasItems &&
        <button className={ classes.button }
                onClick={ orderHandler }
        >Order</button>
      }
    </div>
  );

  // when send order to server
  const cartModalContent = (
    <>
      { cartItems }
      <div className={ classes.total }>
        <span>Total Amount</span>
        <span>{ totalAmount }</span>
      </div>

      {
        isCheckout
          ? <Checkout onConfirm={ submitOrderHandler }
                      onCancel={ props.onClose }
          />
          : modalAction
      }
    </>
  );

  const isSubmittingModalContent = <p>Sending order data ...</p>;
  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!</p>
      <div className={ classes.actions }>
        <button className={ classes.button }
                onClick={ props.onClose }
        >
          Close
        </button>
      </div>
    </>
  );

  return (
    <Modal onClose={ props.onClose }>
      { !isSubmitting && !didSubmit && cartModalContent }
      { isSubmitting && isSubmittingModalContent }
      { !isSubmitting && didSubmit && didSubmitModalContent }
    </Modal>
  );
};

export default Cart;
