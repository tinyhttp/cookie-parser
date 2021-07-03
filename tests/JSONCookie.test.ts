import { JSONCookie } from '../src/index'
import { describe } from './helpers'
import expect from 'expect'

describe('cookieParser.JSONCookie(str)', (it) => {
  it('should return undefined for non-string arguments', function () {
    expect(JSONCookie()).toStrictEqual(undefined)
    expect(JSONCookie(undefined)).toStrictEqual(undefined)
    expect(JSONCookie(null)).toStrictEqual(undefined)
    expect(JSONCookie(42)).toStrictEqual(undefined)
    expect(JSONCookie({})).toStrictEqual(undefined)
  })

  it('should return undefined for non-JSON cookie string', function () {
    expect(JSONCookie('')).toStrictEqual(undefined)
  })

  it('should return object for JSON cookie string', function () {
    expect(JSONCookie('j:{"foo":"bar"}')).toStrictEqual({ foo: 'bar' })
  })

  it('should return undefined on invalid JSON', function () {
    expect(JSONCookie('j:{foo:"bar"}')).toStrictEqual(undefined)
  })
})
