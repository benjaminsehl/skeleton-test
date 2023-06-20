import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import styles from './styles/app.css';
import hydrogenReset from './styles/h2.css';
import favicon from '../public/favicon.svg';
import Layout from './components/Layout';
import {parseMenu} from './utils';

export const links = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: hydrogenReset},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export async function loader({context}) {
  const cart = {
    id: 'gid://shopify/Cart/c1-1b11ffefbb7002d22ae06548b00c5351',
    checkoutUrl:
      'https://checkout.hydrogen.shop/cart/c/c1-1b11ffefbb7002d22ae06548b00c5351',
    totalQuantity: 1,
    buyerIdentity: {
      countryCode: 'US',
      customer: null,
      email: null,
      phone: null,
    },
    lines: {
      nodes: [
        {
          id: 'gid://shopify/CartLine/f7d4dd19-255c-4ee0-a53c-7d68bf5a03f2?cart=c1-1b11ffefbb7002d22ae06548b00c5351',
          quantity: 1,
          attributes: '[]',
          cost: {
            totalAmount: {
              amount: '749.95',
              currencyCode: 'USD',
            },
            amountPerQuantity: {
              amount: '749.95',
              currencyCode: 'USD',
            },
            compareAtAmountPerQuantity: null,
          },
          merchandise: {
            id: 'gid://shopify/ProductVariant/41007290482744',
            availableForSale: true,
            compareAtPrice: null,
            price: {
              currencyCode: 'USD',
              amount: '749.95',
            },
            requiresShipping: true,
            title: '154cm / Syntax',
            image: {
              id: 'gid://shopify/ProductImage/36705304051768',
              url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1655933474',
              altText: null,
              width: 3908,
              height: 3908,
            },
            product: {
              handle: 'the-full-stack',
              title: 'The Full Stack Snowboard',
              id: 'gid://shopify/Product/6730943823928',
            },
            selectedOptions: [
              {
                name: 'Size',
                value: '154cm',
              },
              {
                name: 'Color',
                value: 'Syntax',
              },
            ],
          },
        },
      ],
    },
    cost: {
      subtotalAmount: {
        currencyCode: 'USD',
        amount: '749.95',
      },
      totalAmount: {
        currencyCode: 'USD',
        amount: '749.95',
      },
      totalDutyAmount: null,
      totalTaxAmount: null,
    },
  };
  const {shop, menu} = await context.storefront.query(LAYOUT_QUERY);
  return {shop, menu: parseMenu(menu), cart};
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const title = {
    404: 'Not Found',
  };

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Layout>
            <section>
              <h1>
                {error.status ? title[error.status] : 'Something went wrong'}
              </h1>
              <p>{error.status}</p>
              <p>{error.data.message}</p>
            </section>
          </Layout>
          <Scripts />
        </body>
      </html>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error';
  // if (someConditionConfirmedTrue) {
  //   errorMessage = error.message;
  // }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <section>
            <h1>Something’s wrong</h1>
            <p>{errorMessage}</p>
          </section>
        </Layout>
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  fragment Image on MediaImage {
    image {
      altText
      height
      width
      url
    }
  }

  query Shop {
    shop {
      name
      brand {
        logo {
          ...Image
        }
        squareLogo {
          ...Image
        }
        slogan
        shortDescription
      }
    }
    menu(handle: "main-menu") {
      items {
        title
        url
        type
      }
    }
  }
`;
