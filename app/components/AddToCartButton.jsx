import {CartForm__unstable as CartForm} from '@shopify/hydrogen';

export default function AddToCartButton({lines}) {
  return (
    <CartForm action={CartForm.ACTIONS.LinesAdd} inputs={{lines}}>
      <button>Add to cart</button>
    </CartForm>
  );
}
