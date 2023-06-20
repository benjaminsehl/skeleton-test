import {Link, NavLink, useRouteLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

export default function Layout({children}) {
  const {shop, menu} = useRouteLoaderData('root');

  return (
    <>
      {/**
       * TODO: Display if current locale != predicted locale
       * Use `oxygen-buyer-country` to smartly suggest which country to switch to,
       * Use Accept-Language header to suggest language.
       * Match against `availableLanguages`.
       */}
      {/* <header>
        Choose another country or region to see content specific to your
        location and shop online.
        <form action="?language=en&country=us">
          <select>
            <option>Predicted Locale</option>
            <option>Other</option>
          </select>
          <button>Continue</button>
        </form>
      </header> */}
      <header className="sticky top-0 py-4">
        <section className="flex gap-4 justify-between">
          <nav className="flex gap-4 items-baseline">
            <NavLink to="/" end>
              <Logo shop={shop} />
            </NavLink>
            {menu.items.map((item) => (
              <NavLink key={item.to} to={item.to} target={item.target}>
                {item.title}
              </NavLink>
            ))}
          </nav>
          <nav className="flex gap-4 items-baseline">
            <form action="/search">
              <input placeholder="Search" name="query" type="search" />
            </form>
            <Link to={customer.isAuthenticated ? '/account' : '/account/login'}>
              Account
            </Link>
            <MiniCart />
          </nav>
        </section>
      </header>
      <main className="mx-auto max-w-screen-2xl">{children}</main>
    </>
  );
}

function Logo({shop}) {
  return shop.brand.logo ? (
    <Image width="8rem" data={shop.brand.logo.image} />
  ) : (
    shop.name
  );
}

function MiniCart() {
  const {cart} = useRouteLoaderData('root');
  return (
    <details className="minicart">
      <summary>Cart ({cart.totalQuantity})</summary>
      <ul className="drawer-right">
        {cart.lines.nodes.map((item) => (
          <li key={item.id}>
            <Link to={`/products/${item.merchandise.product.handle}`}>
              <Image width="auto" data={item.merchandise.image} />
              {item.merchandise.product.title}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

const customer = {
  isAuthenticated: false,
};

// Sample Output from Admin API for Markets
// const markets = {
//   nodes: [
//     {
//       name: 'European Union',
//       webPresence: {
//         rootUrls: [
//           {
//             locale: 'en',
//             url: 'https://defaultglobal.com/en-eu',
//           },
//           {
//             locale: 'es',
//             url: 'https://defaultglobal.com/es-eu',
//           },
//           {
//             locale: 'fr',
//             url: 'https://defaultglobal.com/fr-eu',
//           },
//         ],
//       },
//     },
//     {
//       name: 'Canada',
//       webPresence: {
//         rootUrls: [
//           {
//             locale: 'en',
//             url: 'https://defaultglobal.com/en-ca',
//           },
//           {
//             locale: 'fr',
//             url: 'https://defaultglobal.com/fr-ca',
//           },
//         ],
//       },
//     },
//     {
//       name: 'United States',
//       webPresence: {
//         rootUrls: [
//           {
//             locale: 'en',
//             url: 'https://defaultglobal.com/',
//           },
//           {
//             locale: 'es',
//             url: 'https://defaultglobal.com/es',
//           },
//         ],
//       },
//     },
//     {
//       name: 'United Kingdom',
//       webPresence: {
//         rootUrls: [
//           {
//             locale: 'en',
//             url: 'https://uk.defaultglobal.com/',
//           },
//         ],
//       },
//     },
//   ],
// };
