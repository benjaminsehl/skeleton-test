/**
 * @TODO: Add a 404 page
 * Should just contain a very basic message…
 * though one thing that could be nice is using the `pathname` to
 * do a `predictiveSearch` lookup and provide a "Did you mean" suggestion
 * to show how you can do cool stuff w/ Hydrogen
 **/

export const meta = () => {
  return [{title: '404 Not Found'}];
};

export async function loader() {
  throw new Response(null, {
    status: 404,
    statusText: 'Not Found',
  });
}

export default function NotFound() {
  return <></>;
}
