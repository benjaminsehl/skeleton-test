/**
 * @TODO: Add a 404 page
 * Should just contain a very basic message…
 * though one thing that could be nice is using the `pathname` to
 * do a `predictiveSearch` lookup and provide a "Did you mean" suggestion
 * to show how you can do cool stuff w/ Hydrogen
 **/

import {Link} from '@remix-run/react';

export default function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Continue shopping</Link>
    </div>
  );
}
