import {redirect} from '@shopify/remix-oxygen';

export async function loader({params: {handle}}) {
  if (!handle) {
    throw new Error('Missing page handle');
  }
  return redirect(`/${handle}`, 301);
}
