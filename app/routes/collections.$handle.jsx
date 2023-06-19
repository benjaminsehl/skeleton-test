import {json} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import {
  Pagination__unstable as Pagination,
  getPaginationVariables__unstable as getPaginationVariables,
} from '@shopify/hydrogen';

export async function loader({params: {handle}, context, request}) {
  const paginationVariables = getPaginationVariables(request, {pageBy: 8});

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({collection});
}

export default function Collections() {
  const {collection} = useLoaderData();

  return (
    <>
      <h1>{collection.title}</h1>
      <Pagination connection={collection.products}>
        {({nodes, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>Load previous</PreviousLink>
            <div>
              {nodes.map((product) => (
                <Link key={product.id} to={`/products/${product.handle}`}>
                  {product.title}
                </Link>
              ))}
            </div>
            <NextLink>Load more</NextLink>
          </>
        )}
      </Pagination>
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

const COLLECTION_QUERY = `#graphql
  query collection_details(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes {
          title
          id
          handle
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
