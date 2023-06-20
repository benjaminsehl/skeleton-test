import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

export async function loader({params: {handle}, context}) {
  if (!handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return json({page});
}

const seo = ({data}) => ({
  title: data?.page?.seo?.title,
  description: data?.page?.seo?.description,
});

export const handle = {
  seo,
};

export const meta = ({data}) => {
  const {title, description} = data?.page.seo ?? {};
  return [{title}, {name: 'description', content: description}];
};

export default function Pages() {
  const {page} = useLoaderData();

  return (
    <>
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </>
  );
}

const PAGE_QUERY = `#graphql
    query page_details($language: LanguageCode, $handle: String!)
    @inContext(language: $language) {
      page(handle: $handle) {
        id
        title
        body
        seo {
          description
          title
        }
      }
    }
  `;
