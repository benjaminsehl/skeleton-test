import {defer} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';

export async function loader({params: {handle}, context}) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  return defer({
    product,
  });
}

export default function Products() {
  const {product} = useLoaderData();
  const {title, vendor, descriptionHtml} = product;

  return (
    <>
      <h1>{title}</h1>
      <h2>{vendor}</h2>
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
    </>
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

const PRODUCT_QUERY = `#graphql
  query product_query(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      vendor
    }
  }
`;
