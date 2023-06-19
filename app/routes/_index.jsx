import {json} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {
  useLoaderData,
  Link,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';

export async function loader({context}) {
  const {collection} = await context.storefront.query(HOME_QUERY, {
    variables: {
      handle: 'freestyle',
    },
  });

  if (!collection) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return json({collection});
}

/**
 * @TODO: Homepage
 * - Display first available collection
 * - Display top 8 products in a grid
 */
export default function Index() {
  const {collection} = useLoaderData();
  return (
    <>
      <section>
        <Link to={`/collections/${collection.handle}`}>
          <Image
            style={{height: 'auto'}} // This shouldn't be required
            aspectRatio="16/9"
            data={collection.image}
          />
          <h1>{collection.title}</h1>
        </Link>
      </section>
      <section>
        {collection.products.nodes.map((product) => (
          <div key={product.id}>
            <Image
              style={{height: 'auto'}} // This shouldn't be required
              aspectRatio="4/5"
              data={product.featuredImage}
            />
            <h3>{product.title}</h3>
          </div>
        ))}
      </section>
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

const HOME_QUERY = `#graphql
  query home(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        altText
        height
        width
        url
      }
      products(first: 8) {
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
      }
    }
  }
  `;
