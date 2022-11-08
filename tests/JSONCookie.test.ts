import { JSONCookie } from '../src/index'
import { describe } from './helpers'
import * as assert from 'node:assert/strict'

describe('cookieParser.JSONCookie(str)', (it) => {
  it('should return undefined for non-string arguments', function () {
    assert.equal(JSONCookie(), undefined)
    assert.equal(JSONCookie(undefined), undefined)
    assert.equal(JSONCookie(null), undefined)
    assert.equal(JSONCookie(42), undefined)
    assert.equal(JSONCookie({}), undefined)
  })

  it('should return undefined for non-JSON cookie string', function () {
    assert.equal(JSONCookie(''), undefined)
  })

  it('should return object for JSON cookie string', function () {
    assert.deepEqual(JSONCookie('j:{"foo":"bar"}'), { foo: 'bar' })
  })

  it('should return undefined on invalid JSON', function () {
    assert.equal(JSONCookie('j:{foo:"bar"}'), undefined)
  })
})
