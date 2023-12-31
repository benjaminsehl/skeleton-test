import {json} from '@shopify/remix-oxygen';
import {Image} from '@shopify/hydrogen';
import {useLoaderData, Link} from '@remix-run/react';

export async function loader({context}) {
  const {collection} = await context.storefront.query(HOME_QUERY, {
    variables: {
      handle: 'winter',
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
 * - [x] Display first available collection
 * - [x] Display top 8 products in a grid (currently unstyled)
 */
export default function Index() {
  const {collection} = useLoaderData();
  return (
    <>
      <section>
        <Link to={`/collections/${collection.handle}`}>
          <Image
            style={{height: 'auto'}} // @TODO: This shouldn't be here/required
            aspectRatio="2/1"
            data={collection.image}
          />
          <h1>{collection.title}</h1>
        </Link>
      </section>
      <section className="product-grid gap-4 md:gap-8">
        {collection.products.nodes.map((product) => (
          <Link key={product.id} to={`/products/${product.handle}`}>
            <Image
              style={{height: 'auto'}} // @TODO: This shouldn't be here/required
              aspectRatio="4/5"
              data={product.featuredImage}
            />
            <h4>{product.title}</h4>
          </Link>
        ))}
      </section>
    </>
  );
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
