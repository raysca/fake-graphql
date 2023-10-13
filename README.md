# data-generator

A simple data generator for testing purposes. It uses [faker](https://fakerjs.dev/) to generate random data and [handlebars](https://handlebarsjs.com/) as a template engine.

## Quick Start

```bash
echo "Hello, {{faker 'person.firstName'}}" > hello.hbs

npm execute @raysca/data-gen -t hello.hbs -o hello.txt 
```

## Installation

```bash
npm install -g @raysca/data-gen
```

or if you prefer yarn:

```bash
yarn global add @raysca/data-gen
```


## Usage

```bash
data-generator --help
```

## Templates Helpers

`data-generator` uses [handlebars](https://handlebarsjs.com/) as a template engine. The following extra helpers are available to use in your templates:

### faker

```bash
    {{faker 'person.firstName'}}
```

### random

```text
    {{random 'a' 'b' 'c'}}
```

### repeat

```text
    {{repeat 10}}
        {{faker 'person.firstName'}}
    {{/repeat}}
```

### for

```text
    {{#for 0 10}}
        {{faker 'person.firstName'}}
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

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
