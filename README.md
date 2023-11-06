
<h1 align="center">Fake Server</h1
<p align="center">Zero configuration, no code API mock server</p>

Fake Server is a simple graphql mock server. It uses [fakerjs](https://fakerjs.dev/) to generate random data and [handlebars](https://handlebarsjs.com/) as a template engine.

The goal is to make it easy to create a mock server with zero configuration and zero code. It is useful for mocking out a graphql server during development or testing.

## Features

- Zero configuration
- Zero code
- File system based configuration
- Generate random data using [fakerjs](https://fakerjs.dev/)
- Use [handlebars](https://handlebarsjs.com/) templates to generate data

## Quick Start

Quickly start the server with a simple hello world example.

```bash
echo "Hello, {{faker 'person.firstName'}}" > hello.hbs
echo type Query { hello: String } > schema.graphql

npx @raysca/fake-server graphql
```

## How it works

Each graphql operation is mapped to a file in the `mocks` directory. `Fake Server` matches the operation name to a file in the `mocks` directory. For example, if the operation name is `hello` then `Fake Server` will look for a file called `hello.hbs` in the `mocks` directory. If the file exists then it will be used to generate the response. If the file does not exist then a default response will be returned.

## Examples

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

## Installation

```bash
npm install -g @raysca/fake-server
```

or if you prefer yarn

```bash
yarn global add @raysca/fake-server
```

## Usage

```bash
faker-server graphql --help
```

Also see the [examples](examples) directory for more examples.

## Templates Helpers

`mock-generator` uses [handlebars](https://handlebarsjs.com/) as a template
engine. The following extra helpers are available to use in your handlebars
templates:

### faker

The `faker` helper is used to generate random data using
[fakerjs](https://fakerjs.dev/). It takes a single argument which is the name of
the faker method to call. For example:

```text
{{faker 'person.firstName'}}
{{faker 'lorem.lines' min=3 max=5 }}
{{faker "string.alphanumeric" 5}}
```

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

### for

The `for` helper is used to repeat a block of code a number of times. It is
useful for generating a list of of values For example:

```text
{{#for 0 10}}
   INSERT INTO test-table (id, name) VALUES ('{{faker "string.alphanumeric" 5}}', '{{faker 'person.firstName'}}')
{{/for}}
```

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.
