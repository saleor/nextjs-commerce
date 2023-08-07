[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fnextjs-commerce&env=COMPANY_NAME,TWITTER_CREATOR,TWITTER_SITE,SITE_NAME,SALEOR_INSTANCE_URL&project-name=saleor-nextjs-commerce&repository-name=saleor-nextjs-commerce&demo-title=Saleor%20Next.js%20Commerce&demo-description=Saleor%20%2B%20Next.js%2013%20%2B%20App%20Router-ready%20e-commerce%20template&demo-url=https%3A%2F%2Fsaleor-commerce.vercel.app%2F&demo-image=https%3A%2F%2Fsaleor-commerce.vercel.app%2Fscreenshot.png)

# Next.js Commerce

A Next.js 13 and App Router-ready e-commerce template featuring:

- Next.js App Router
- Optimized for SEO using Next.js's Metadata
- React Server Components (RSCs) and Suspense
- Server Actions for mutations
- Edge Runtime
- New fetching and caching paradigms
- Dynamic OG images
- Styling with Tailwind CSS
- Checkout and payments with Saleor
- Automatic light/dark mode based on system settings

<h3 id="v1-note"></h3>

> Note: Looking for Next.js Commerce v1? View the [code](https://github.com/vercel/commerce/tree/v1), [demo](https://commerce-v1.vercel.store), and [release notes](https://github.com/vercel/commerce/releases/tag/v1).

## Providers

Vercel is more than happy to partner and work with any commerce provider to help them get a similar template up and running and listed below. Alternative providers should be able to fork this repository and swap out the `lib/…` files with their own implementation while leaving the rest of the template mostly unchanged.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Saleor store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## How to configure your Saleor store for Next.js Commerce

Next.js Commerce requires a [Saleor account](https://saleor.io/).

### Add the Saleor URL to an environment variable

Create a `SALEOR_INSTANCE_URL` environment variable and use your Saleor GraphQL API URL as the value (ie. `https://yourinstance.saleor.cloud/graphql/`).

### Accessing the Saleor Storefront API

Next.js Commerce utilizes [Saleor's Storefront API](https://docs.saleor.io/docs/3.x/api-storefront/api-reference) to create unique customer experiences. The API offers a full range of commerce options making it possible for customers to control products, collections, menus, pages, cart, checkout, and more.

### Configure webhooks for on-demand incremental static regeneration (ISR)

Utilizing [Shopify's webhooks](https://shopify.dev/docs/apps/webhooks), and listening for select [Shopify webhook event topics](https://shopify.dev/docs/api/admin-rest/2022-04/resources/webhook#event-topics), we can use [Next'js on-demand revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#using-on-demand-revalidation) to keep data fetches indefinitely cached until certain events in the Shopify store occur.

Next.js is pre-configured to listen for the following Shopify webhook events and automatically revalidate fetches.

- `collections/create`
- `collections/delete`
- `collections/update`
- `products/create`
- `products/delete`
- `products/update` (this also includes when variants are added, updated, and removed as well as when products are purchased so inventory and out of stocks can be updated)

<details>
  <summary>Expand to view detailed walkthrough</summary>

#### Setup secret for secure revalidation

1. Create your own secret or [generate a random UUID](https://www.uuidgenerator.net/guid).
1. Create a [Vercel Environment Variable](https://vercel.com/docs/concepts/projects/environment-variables) named `SHOPIFY_REVALIDATION_SECRET` and use the value from above.

#### Configure Shopify webhooks

1. Navigate to `https://[your-shopify-store-subdomain].myshopify.com/admin/settings/notifications`.
1. Add webhooks for all six event topics listed above. You can add more sets for other preview urls, environments, or local development. Append `?secret=[SECRET]` to each url, where `[SECRET]` is the secret you created above.
   ![Shopify store webhooks](https://github.com/vercel/commerce/assets/446260/3d713fd7-b642-46e2-b2ce-f2b695ff6d2b)
   ![Shopify store add webhook](https://github.com/vercel/commerce/assets/446260/f0240a22-be07-42bc-bf6c-b97873868677)

#### Testing webhooks during local development

The easiest way to test webhooks while developing locally is to use [ngrok](https://ngrok.com).

1. [Install and configure ngrok](https://ngrok.com/download) (you will need to create an account).
1. Run your app locally, `npm run dev`.
1. In a separate terminal session, run `ngrok http 3000`.
1. Use the url generated by ngrok and add or update your webhook urls in Shopify.
   ![ngrok](https://github.com/vercel/commerce/assets/446260/5dc09c5d-0e48-479c-ab64-de8dc9a2c4b1)
   ![Shopify store edit webhook](https://github.com/vercel/commerce/assets/446260/13fd397d-4666-4e8d-b25f-4adc674345c0)
1. You can now make changes to your store and your local app should receive updates. You can also use the `Send test notification` button to trigger a generic webhook test.
   ![Shopify store webhook send test notification](https://github.com/vercel/commerce/assets/446260/e872e233-1663-446d-961f-8c9455358530)

</details>

### Using Saleor as a CMS

Next.js Commerce is fully powered by Saleor in a truly headless and data-driven way.

#### Products

`https://yourinstance.saleor.cloud/dashboard/products/`

Only `Active` products are shown. `Draft` products will not be shown until they are marked as `Active`.

Product options and option combinations are driven by Saleor options and variants. When selecting options on the product detail page, other options and variant combinations will be visually validated and verified for availability, as Amazon does.

Products that are active and "out of stock" are still shown on the site, but the ability to add the product to the cart is disabled.

#### Collections

`https://yourinstance.saleor.cloud/dashboard/collections/`

Create whatever collections you want and configure them however you want. All available collections will show on the search page as filters on the left, with one exception...

Any collection names that start with the word "hidden" will not show up on the headless front end. The Next.js Commerce theme comes pre-configured to look for two hidden collections. Collections were chosen for this over tags so that order of products could be controlled (collections allow for manual ordering).

Create the following collections:

- `Featured` -- Products in this collection are displayed in the three featured blocks on the homepage.
- `All Products` -- Products in this collection are displayed in the auto-scrolling carousel section on the homepage.

#### Pages

`https://yourinstance.saleor.cloud/dashboard/pages/`

Next.js Commerce contains a dynamic `[page]` route. It will use the value to look for a corresponding page in Saleor. If a page is found, it will display its rich content using Tailwind's prose. If a page is not found, a 404 page is displayed.

#### Navigation menus

`https://yourinstance.saleor.cloud/dashboard/navigation/`

Next.js Commerce's header and footer navigation is pre-configured to be controlled by Saleor navigation menus. This means you have full control over what links go here. They can be to collections, pages, external links, and more.

Create the following navigation menus:

- `navbar` -- Menu items to be shown in the headless frontend header.
- `footer` -- Menu items to be shown in the headless frontend footer.

#### SEO

Saleor's products, collections, pages, etc. allow you to create custom SEO titles and descriptions. Next.js Commerce is pre-configured to display these custom values but also comes with sensible default fallbacks if they are not provided.
