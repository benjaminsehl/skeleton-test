/**
 * @TODO: List out collctions in a route, each collection
 * will have a title, and a link to the collection
 * p2
 **/

import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Pagination__unstable as Pagination,
  getPaginationVariables__unstable as getPaginationVariables,
} from '@shopify/hydrogen';

export async function loader({context, request}) {
  const paginationVariables = getPaginationVariables(request, {pageBy: 8});

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  if (!collections) {
    throw new Response(null, {status: 404});
  }

  return json({collections});
}

export default function Collections() {
  const {collections} = useLoaderData();

  return (
    <>
      <h1>Collections</h1>
      <Pagination connection={collections}>
        {({nodes, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>Load previous</PreviousLink>
            <ul>
              {nodes.map((collection) => (
                <li key={collection.id}>
                  <Link to={`/collections/${collection.handle}`}>
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
            <NextLink>Load more</NextLink>
          </>
        )}
      </Pagination>
    </>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query collection_index(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
`;
