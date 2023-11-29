<h1 align="center">Faker Server</h1
<p align="center">Effortless GraphQL and REST API Mocking with Faker.js and Handlebars templates</p>

## GraphQL Mock Server

Elevate your development experience with an innovative mock server, seamlessly
powered by filesystem integration, dynamic
[Handlebars](https://handlebarsjs.com/) templating, and realistic data
generation with [Faker.js](https://fakerjs.dev/)

![Architecture](architecture.png "Architecture")

### Faker-Sever GraphQL vs Other Mock Servers

- **No code changes**. Just point your code to the mock server
- **File system based mocks**. Easily create, edit and version mocks alongside
  your code
- **Dynamic and complex mocks**. Use [handlebars](https://handlebarsjs.com/) to
  create dynamic and complex mocks
- **Realistic data**. Easily generate sample data using [fakerjs](https://fakerjs.dev/)
- **Zero configuration**. Just run `faker-server graphql -s schema.graphql`

### Quick Start

#### Using Local Schema

Quickly start the server with a simple hello world example.

```bash
# Create a simple graphql schema
echo type Query { hello: String } > schema.graphql

# Create a simple handlebars template
echo "Hello, {{faker 'person.firstName'}}" > hello.hbs

npm exec @raysca/faker-server graphql
```

The graphql server will be running on http://localhost:8080/api/graphql with a
playground to test it out.

#### Using Remote Schema

You can also use a remote schema by specifying the url to a graphql api. For example:
Using the [Shopify](https://mock.shop/api) reference GraphQL api.

```bash
npm exec @raysca/faker-server graphql -s  https://mock.shop/api
```

The graphql server will be running on `http://localhost:8080/api`

Create a simple `shop.hbs` mock file

```hbs
{
    "id": "{{fake "string.alphanumeric" 10}}",
    "name": "The coffee shop",
    "description": "The best coffee in the world",
    "primaryDomain": {
        "host": "coffee.com",
        "sslEnabled": true,
        "url": "https://coffee.com"
    }
}
```

and query the mock server

```graphql
query {
  shop {
    id
    name
    description
    primaryDomain {
      host
      sslEnabled
      url
    }
  }
}
```

### Faker-Server GraphQL Options

| Option           | Description                                                     | Default           |
| ---------------- | --------------------------------------------------------------- | ----------------- |
| `-s, --schema`   | Path to the graphql schema file.                                | current directory |
| `-m, --mocks`    | Path to the mocks directory containing `.hbs` or `.json` files. | current directory |
| `-p, --port`     | Port to run the server on.                                      | 8080              |
| `-e, --endpoint` | The graphql endpoint will be accessible from                    | /api/graphql      |
| `-w, --watch`    | Reload server if schema/mocks changes                           | false             |

```bash
Usage: faker-server graphql --help
```

### How it works

![How it works](how-it-works.png "How it works")

There is a one-to-one mapping between graphql operations and mock files. This makes mocking intuitive and easy to understand. No complex configuration or code changes are required.

The server will look for a mock file in the mocks directory that matches the requested graphql operation. For example, if the graphql operation is `getPerson` then the server will look for a file called `getPerson.hbs` or `getPerson.json` in the mocks directory.

### Examples

Here is an example graphql schema:

```graphql
type Query {
  getPerson: Person
  people: [Person]
}

type Person {
  name: String
  phone: String
}
```

Here is an example `mocks/getPerson.hbs` file:

```text
{
    "name": "{{faker 'person.firstName'}} {{faker 'person.lastName'}}",
    "phone": "{{faker 'phone.phoneNumber'}}"
}
```

Here is an example `mocks/people.hbs` file:

```text
[
{{#repeat 2}}
    {
        "name": "{{faker 'person.firstName'}} {{faker 'person.lastName'}}",
        "phone": "{{faker 'phone.phoneNumber'}}"
    }
{{/repeat}}
]
```

## Advance Templates and Helpers

Whilst `Fake GraphQL` supports simple JSON file based mocks, the power of the
server shines when combined with handlebars templates and helpers.

The `Fake GraphQL` server has a number of built-in helpers to make it easy to generate random
data and more complex mocks. Here are the built-in helpers:

### faker

`faker` is used to generate random sample data in templates . It takes the fakerjs method as a parameter for example:

```json
{
  "firstName": "{{faker 'person.firstName'}}",
  "lastName": "{{faker 'person.lastName'}}",
  "phone": "{{faker 'phone.number'}}",
  "email": "{{faker 'internet.email'}}",
  "weight": "{{faker 'number.float' min=100 max=200}}kg"
}
```

All the faker methods are supported. See the [fakerjs](https://fakerjs.dev/)

### random

The `random` helper is used to select a random value from a list of values. For
example:

```text
{{random 'a' 'b' 'c'}}
```

### repeat

The `repeat` helper is used to repeat a comma-separated block of code a number
of times. This is good for generating arrays of values For example:

```text
[
{{#repeat 2}}
    {
        "applicable": true,
        "code": "CODE-{{faker "string.alphanumeric" 5}}"
    }
{{/repeat}}
]
```

Also see the [examples](examples) directory for more examples.


## REST Mock Server

The `faker-server rest` command can be used to create a REST mock server. It