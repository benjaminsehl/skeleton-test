import {useRouteError, isRouteErrorResponse} from '@remix-run/react';

/**
 * @TODO: Homepage
 * - Display first available collection
 * - Display top 8 products in a grid
 */
export default function Index() {
  return (
    <p>
      Edit this route in <em>app/routes/index.tsx</em>.
    </p>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error.status, error.statusText, error.data);
    return <div>Route Error</div>;
  } else {
    console.error(error.message);
    return <div>Thrown Error</div>;
  }
}
