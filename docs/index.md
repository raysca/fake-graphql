---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Fake GraphQL
  text: "Effortless GraphQL Mocking"
  tagline: Stop changing your code to mock your GraphQL API
  actions:
    - theme: brand
      text: Documentation
      link: /markdown-examples
    - theme: alt
      text: Examples
      link: /api-examples
  # image:
  #   src: /architecture.png
  #   alt: Architecture

features:
  - icon: 📝
    title: No Code Changes Required
    details: No code required to mock your GraphQL API. Just write your schema and you're good to go.
  - title: File System Based Mocks
    details: Mocks are stored in the file system. This makes it easy to create and manage mocks.
  - title: FakerJS & Handlebars Built In
    details: FakerJS and Handlebars are built in to make it easy to generate sample data.
---

## Quick Start

```bash
echo "Hello, {{faker 'person.firstName'}}" > hello.hbs
echo type Query { hello: String } > schema.graphql

npx @raysca/fake-graphql graphql
```

::: code-group

<<< @/snippets/home-schema.graphql

<<< @/snippets/home-template.hbs

:::