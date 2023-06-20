import {Await, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import {flattenConnection} from '@shopify/hydrogen';

export async function action() {
  /**
   * @TODO: Add all default cart actions
   * */
}

// TODO: Add default loader

export default function Cart() {
  const [root] = useMatches();

  /**
   * @TODO:
   * - [ ] Display line items: Title, Image, Price, Quantity, Add, Subtract, Remove
   * - [ ] Discount field
   * - [ ] Subtotal
   * - [ ] Continue to checkout link
   * - [ ] Shop Pay button
   */

  return (
    <Suspense fallback="loading">
      <Await
        resolve={root.data?.cart}
        errorElement={<div>An error occurred</div>}
      >
        {(cart) => {
          const linesCount = Boolean(cart?.lines?.edges?.length || 0);
          if (!linesCount) {
            return (
              <p>Looks like you haven&rsquo;t added anything to your cart.</p>
            );
          }

          const cartLines = cart?.lines ? flattenConnection(cart?.lines) : [];

          return (
            <>
              <h1>Cart</h1>
              <ul>
                {cartLines.map((line) => (
                  <div key={line.id}>
                    <h2>{line?.merchandise?.title}</h2>
                  </div>
                ))}
              </ul>
            </>
          );
        }}
      </Await>
    </Suspense>
  );
}
