import { suite } from 'uvu'
import http from 'http'
import { cookieParser, JSONCookie, signedCookie, signedCookies } from '../src/index'
import * as signature from '@tinyhttp/cookie-signature'
import type { Request, Response } from '@tinyhttp/app'
import { makeFetch } from 'supertest-fetch'
import { describe } from './helpers'

function createServer(secret?: any) {
  const _parser = cookieParser(secret)
  return http.createServer((req, res) => {
    _parser(req as Request, res as Response, (err) => {
      if (err) {
        res.statusCode = 500
        res.end(err.message)
        return
      }

      const cookies = req.url === '/signed' ? (req as Request).signedCookies : (req as Request).cookies
      res.end(JSON.stringify(cookies))
    })
  })
}

describe('when no cookies are sent', function (it) {
  it('should default req.cookies to {}', async () => {
    await makeFetch(createServer('keyboard cat'))('/').expect(200, '{}')
  })

  it('should default req.signedCookies to {}', async () => {
    await makeFetch(createServer('keyboard cat'))('/signed').expect(200, '{}')
  })
})
describe('when cookies are sent', function (it) {
  it('should populate req.cookies', async () => {
    await makeFetch(createServer('keyboard cat'))('/', {
      headers: {
        Cookie: 'foo=bar; bar=baz'
      }
    }).expect(200, '{"foo":"bar","bar":"baz"}')
  })

  it('should inflate JSON cookies', async () => {
    await makeFetch(createServer('keyboard cat'))('/', {
      headers: {
        Cookie: 'foo=j:{"foo":"bar"}'
      }
    }).expect(200, '{"foo":{"foo":"bar"}}')
  })

  it('should not inflate invalid JSON cookies', async () => {
    await makeFetch(createServer('keyboard cat'))('/', {
      headers: {
        Cookie: 'foo=j:{"foo":'
      }
    }).expect(200, '{"foo":"j:{\\"foo\\":"}')
  })
})

describe('when req.cookies exists', function (it) {
  it('should do nothing', async () => {
    const server = http.createServer((req, res) => {
      const r = req as Request

      r.cookies = { fizz: 'buzz' }

      cookieParser()(r, res as Response, (err) => {
        if (err) {
          res.statusCode = 500
          res.end(err.message)
          return
        }

        res.end(JSON.stringify(r.cookies))
      })
    })

    await makeFetch(server)('/', {
      headers: {
        Cookie: 'foo=bar; bar=baz'
      }
    }).expect(200, '{"fizz":"buzz"}')
  })
})

describe('when a secret is given', function (it) {
  const val = signature.sign('foobarbaz', 'keyboard cat')
  // TODO: "bar" fails...

  it('should populate req.signedCookies', async () => {
    await makeFetch(createServer('keyboard cat'))('/signed', {
      headers: {
        Cookie: 'foo=s:' + val
      }
    }).expect(200, '{"foo":"foobarbaz"}')
  })

  it('should remove the signed value from req.cookies', async () => {
    await makeFetch(createServer('keyboard cat'))('/', {
      headers: {
        Cookie: 'foo=s:' + val
      }
    }).expect(200, '{}')
  })

  it('should omit invalid signatures', async () => {
    const server = createServer('keyboard cat')

    await makeFetch(server)('/signed', {
      headers: {
        Cookie: `foo=${val}3`
      }
    }).expect(200, '{}')

    await makeFetch(server)('/', {
      headers: {
        Cookie: `foo=${val}3`
      }
    }).expect(200, '{"foo":"foobarbaz.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3"}')
  })
})

describe('when multiple secrets are given', function (it) {
  it('should populate req.signedCookies', async () => {
    await makeFetch(createServer(['keyboard cat', 'nyan cat']))('/signed', {
      headers: {
        Cookie:
          'buzz=s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE; fizz=s:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88'
      }
    }).expect(200, '{"buzz":"foobar","fizz":"foobar"}')
  })
})

/*  describe('when no secret is given', function () {
  let server: http.Server

  beforeEach(() => (server = createServer()))

  it('should populate req.cookies', async () => {
    await makeFetch(server).get('/').set('Cookie', 'foo=bar; bar=baz').expect(200, '{"foo":"bar","bar":"baz"}', done)
  })

  it('should not populate req.signedCookies', async () => {
    var val = signature.sign('foobarbaz', 'keyboard cat')
    await makeFetch(server)
      .get('/signed')
      .set('Cookie', 'foo=s:' + val)
      .expect(200, '{}', done)
  })
}) */
