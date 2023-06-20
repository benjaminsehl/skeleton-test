import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  Image,
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
    throw new Response(null, {status: 404, statusText: 'Not found'});
  }

  return json({collection});
}

export default function Collections() {
  const {collection} = useLoaderData();

  return (
    <section className="grid gap-8">
      <h1>{collection.title}</h1>
      <Pagination connection={collection.products}>
        {({nodes, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>Load previous</PreviousLink>
            <div className="product-grid gap-8">
              {nodes.map((product) => (
                <Link key={product.id} to={`/products/${product.handle}`}>
                  <Image
                    sizes="(min-width: 60em) 25vw, (min-width: 40em) 33vw, 50vw"
                    aspectRatio="4/5"
                    data={product.featuredImage}
                  />
                  {product.title}
                </Link>
              ))}
            </div>
            <NextLink>Load more</NextLink>
          </>
        )}
      </Pagination>
    </section>
  );
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
          featuredImage {
            altText
            height
            width
            url
          }
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
