
# introduction

Hello fellow developers, Let me introduce you to Faker-Server, a simple and powerful tool to mock your GraphQL APIs. Faker-Server is a command line tool that mocks your GraphQL APIs using the file system. It is built on top of the popular Faker-JS library and supports all the features of Faker-JS.

Unlike other Graphql mocking tools that requires you to write complex setup code or interact with complex graphical user interfaces, Faker-Server uses the file system entirely to mock your GraphQL operations.

This mocking approach keeps your mock data in sync with your codebase and that makes it easy to share your mock data with your team. Using faker-server's approach of mocking also keeps your workflow in your code editor without the need for any external tools. Let's get started.

So in this example, we will mock out the Shopify GraphQL API by simply starting faker-server using the Graphql command and pointing it to the shopify GraphQL endpoint at mock dot shop slash API. faker-server will automatically download the remote schema and setup a local GraphQL server using that schema. The server will be started on port 8080 and will be accessible at the same endpoint at which the remote server is accessed from, in this case is slash API. Do note that faker-server also supports local GraphQL schemas. So you can use it to mock your local GraphQL schemas as well.

Now that we have our mock server running, we can start making queries to it. Let's start by making a simple query to get the shop name. Right now we get an error because we have not yet defined the shop mock file. Let's go ahead and create the shop mock file. We will call it shop.hbs because we want to use fakerjs to generate some sample data. Faker server also supports json files. So you can use json files if you prefer. Now let's go ahead and create the shop object.

We only partially mock the bits of the shop object that we need. so we will mock the name and the primary domain. Here we are using the built-in fakerjs helpers to generate random data. You can lookup the fake server documentation to see all the available helpers. so now query the shop name and the primary domain. Voila! we have mocked the shop name and the primary domain. We did not have to write any code to do this or unnecessary complex configuration. We simply pointed the fake server to the remote schema and created a mock file for the shop object.

I hope you found this video useful. If you did, have a look at the fake server documentation to see all the available features. Thank you for watching.