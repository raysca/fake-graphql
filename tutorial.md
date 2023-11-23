# Mock GraphQL API

How can you quickly setup a mock GraphQL API for your frontend development without having to write any code, setup a database or massive changes to your existing codebase?

Other solutions like [Mock Service Worker](https://mswjs.io/) or [Mockoon](https://mockoon.com/) are great mocking tools, but they require you to write code or complex GUI setup.

In this tutorial we will use [Fake Graphql](https://github/raysca/fake-graphql) to setup a mock GraphQL API in seconds leveraging our filesystem. With Fake GraphQL you can create a mock GraphQL API by simply creating a folder structure and adding some files. Stay in your code editor and even version your mocks with your code.

## Setup

We will be using the shopify storefront GraphQL API as an example. You can find the documentation [here](https://shopify.dev/docs/storefront-api/reference).

We will start by starting the Fake GraphQL server and pointing it to the Shopify storefront GraphQL endpoint and the mocks folder.

```bash
npx fake-graphql -s  https://mock.shop/api -d mocks
```

The `-s` flag is used to specify the source GraphQL endpoint and the `-d` flag is used to specify the directory where the mock files are located. The server will now be running on `http://localhost:8080/api/graphql` with a GraphQL playground available at the same endpoint.

## Mocking

The biggest advantage of Fake GraphQL is that the server uses the filesystem to mock the GraphQL API. So let's create the `mocks` folder and start mocking.

Let's start by mocking the `shop` query. We will create a file called `shop.json` in the `mocks` folder. The file should contain the following JSON.

```json
    {
      "name": "Fake Shop",
      "description": "This is a fake shop",
      "currencyCode": "USD"
    }
```

Now if we go to the GraphQL playground and run the following query we should get the mocked data.

```graphql
query {
  shop {
    name
    description
    currencyCode
  }
}
```

The response should be the following.

```json
{
  "data": {
    "shop": {
      "name": "Fake Shop",
      "description": "This is a fake shop",
      "currencyCode": "USD"
    }
  }
}
```

and that is how easy it is to mock a GraphQL query with Fake GraphQL. Fake GraphQL will match the graphql operation name to the filename and return the contents of the file as the response. It is that simple. Only mock what you need and keep your mocks in your codebase.

See the Fake GraphQL documentation for more examples and features.

