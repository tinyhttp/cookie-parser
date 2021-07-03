import { JSONCookie } from '../src/index'
import { describe } from './helpers'
import { expect } from 'earljs'

describe('cookieParser.JSONCookie(str)', (it) => {
  it('should return undefined for non-string arguments', function () {
    expect(JSONCookie()).toEqual(undefined)
    expect(JSONCookie(undefined)).toEqual(undefined)
    expect(JSONCookie(null)).toEqual(undefined)
    expect(JSONCookie(42)).toEqual(undefined)
    expect(JSONCookie({})).toEqual(undefined)
  })

  it('should return undefined for non-JSON cookie string', function () {
    expect(JSONCookie('')).toEqual(undefined)
  })

  it('should return object for JSON cookie string', function () {
    expect(JSONCookie('j:{"foo":"bar"}')).toEqual({ foo: 'bar' })
  })

  it('should return undefined on invalid JSON', function () {
    expect(JSONCookie('j:{foo:"bar"}')).toEqual(undefined)
  })
})
