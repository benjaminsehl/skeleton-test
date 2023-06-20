import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';

export async function loader({context: {storefront}}) {
  const data = await storefront.query(POLICIES_QUERY);

  const policies = Object.values(data.shop || {});

  if (policies.length === 0) {
    throw new Response('Not found', {status: 404});
  }

  return json({
    policies,
  });
}

export default function PoliciesIndex() {
  const {policies} = useLoaderData();

  return (
    <>
      {policies.map((policy) => {
        return (
          policy && (
            <Link key={policy.id} to={`/policies/${policy.handle}`}>
              {policy.title}
            </Link>
          )
        );
      })}
    </>
  );
}

const POLICIES_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesQuery {
    shop {
      privacyPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
