# mock-generator

A simple mock data generator for testing and development purposes. It uses
[fakerjs](https://fakerjs.dev/) to generate random data and
[handlebars](https://handlebarsjs.com/) as a template engine.

## Quick Start

### Generate Mock Data

```bash
echo "Hello, {{faker 'person.firstName'}}" > hello.hbs

npm execute @raysca/data-gen -t hello.hbs -o hello.txt
```

#### Routing

The routing is filesystem based. For example, if you have a file called
`todos/[id].hbs` and you make a request to `/todos/123` then the template will
be used to generate the response. The path parameters are available in the
template as `params`. For example:

```text
{
    "id": "{{params.id}}",
    "name": "{{faker 'person.firstName'}}"
}
```

#### Mock Definition

Example

```hbs
{
    "status": 200,
    "headers": {
        "Content-Type": "application/json"
    },
    "body": {
        "id": "{{context.params.id}}",
        "name": "{{faker 'person.firstName'}}"
    }
}
```

#### Mock Context

The mock context is available in the template as `context`. It contains the
following properties:

| Property  | Description          |
| --------- | -------------------- |
| `params`  | The path parameters  |
| `query`   | The query parameters |
| `body`    | The request body     |
| `headers` | The request headers  |
| `method`  | The request method   |
| `url`     | The request url      |

See the [mocks](mocks) directory for more mock examples.

### Serving Mocks

```bash
mkdir -p mocks/todos

echo '{ "body": "{{faker \'person.firstName\' }}" }' > mocks/todos/\[id\].hbs

npm execute @raysca/data-gen -p 8080
```

### Mocking Server

```bash
npm execute @raysca/data-gen -d path/to/templates -p 8080
```

## Installation

```bash
npm install -g @raysca/data-gen
```

or if you prefer yarn

```bash
yarn global add @raysca/data-gen
```

## Usage

```bash
mock-generator --help
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
