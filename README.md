<div align="center">

# @tinyhttp/cookie-parser

[![NPM][npm-badge]][npm-url] [![NPM][dl-badge]][npm-url] [![GitHub Workflow Status][actions-img]][github-actions] [![Coverage][cov-img]][cov-url]

</div>

> A rewrite of [cookie-parser](https://github.com/expressjs/cookie-parser) module.

A middleware to parse `Cookie` header and populate `req.cookies` with an object keyed by the
cookie names. Optionally you may enable signed cookie support by passing a
`secret` string, which assigns `req.secret` so it may be used by other
middleware.

## Install

```sh
pnpm i @tinyhttp/cookie-parser
```

## API

```ts
import { cookieParser, JSONCookie, JSONCookies, signedCookie, signedCookies } from '@tinyhttp/cookie-parser'
```

### `cookieParser(secret, options)`

Create a new cookie parser middleware function using the given `secret` and
`options`.

- `secret` a string or array used for signing cookies. This is optional and if
  not specified, will not parse signed cookies. If a string is provided, this
  is used as the secret. If an array is provided, an attempt will be made to
  unsign the cookie with each secret in order.
- `options` an object that is passed to `cookie.parse` as the second option. See
  [cookie](https://www.npmjs.org/package/cookie) for more information.
  - `decode` a function to decode the value of the cookie

The middleware will parse the `Cookie` header on the request and expose the
cookie data as the property `req.cookies` and, if a `secret` was provided, as
the property `req.signedCookies`. These properties are name value pairs of the
cookie name to cookie value.

When `secret` is provided, this module will unsign and validate any signed cookie
values and move those name value pairs from `req.cookies` into `req.signedCookies`.
A signed cookie is a cookie that has a value prefixed with `s:`. Signed cookies
that fail signature validation will have the value `false` instead of the tampered
value.

In addition, this module supports special "JSON cookies". These are cookie where
the value is prefixed with `j:`. When these values are encountered, the value will
be exposed as the result of `JSON.parse`. If parsing fails, the original value will
remain.

### `JSONCookie(str)`

Parse a cookie value as a JSON cookie. This will return the parsed JSON value
if it was a JSON cookie, otherwise, it will return the passed value.

### `JSONCookies(cookies)`

Given an object, this will iterate over the keys and call `JSONCookie` on each
value, replacing the original value with the parsed value. This returns the
same object that was passed in.

### `signedCookie(str, secret)`

Parse a cookie value as a signed cookie. This will return the parsed unsigned
value if it was a signed cookie and the signature was valid. If the value was
not signed, the original value is returned. If the value was signed but the
signature could not be validated, `false` is returned.

The `secret` argument can be an array or string. If a string is provided, this
is used as the secret. If an array is provided, an attempt will be made to
unsign the cookie with each secret in order.

### `signedCookies(cookies, secret)`

Given an object, this will iterate over the keys and check if any value is a
signed cookie. If it is a signed cookie and the signature is valid, the key
will be deleted from the object and added to the new object that is returned.

The `secret` argument can be an array or string. If a string is provided, this
is used as the secret. If an array is provided, an attempt will be made to
unsign the cookie with each secret in order.

## Example

```ts
import { App } from '@tinyhttp/app'
import { cookieParser } from '@tinyhttp/cookie-parser'

new App()
  .use(cookieParser())
  .get('/', (req, res) => {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
  })
  .listen(3000)

// curl command that sends an HTTP request with two cookies
// curl http://127.0.0.1:8080 --cookie "Cho=Kim;Greet=Hello"
```

[npm-badge]: https://img.shields.io/npm/v/@tinyhttp/cookie-parser?style=for-the-badge&color=hotpink&label=&logo=npm
[npm-url]: https://npmjs.com/package/@tinyhttp/cookie-parser
[dl-badge]: https://img.shields.io/npm/dt/@tinyhttp/cookie-parser?style=for-the-badge&color=hotpink
[actions-img]: https://img.shields.io/github/actions/workflow/status/tinyhttp/cookie-parser/main.yml?style=for-the-badge&logo=github&label=&color=hotpink
[github-actions]: https://github.com/tinyhttp/cookie-parser/actions
[cov-img]: https://img.shields.io/coveralls/github/tinyhttp/cookie-parser?style=for-the-badge&color=hotpink&a
[cov-url]: https://coveralls.io/github/tinyhttp/cookie-parser
