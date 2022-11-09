import { signedCookie } from '../src/index'
import { describe } from './helpers'
import { suite } from 'uvu'
import * as assert from 'node:assert/strict'

const it = suite('signedCookie(str, secret)')

it('should return undefined for non-string arguments', function () {
  assert.equal(signedCookie(undefined, 'keyboard cat'), undefined)
  assert.equal(signedCookie(null, 'keyboard cat'), undefined)
  assert.equal(signedCookie(42, 'keyboard cat'), undefined)
  assert.equal(signedCookie({}, 'keyboard cat'), undefined)
})

it('should pass through non-signed string', function () {
  assert.equal(signedCookie('', 'keyboard cat'), '')
  assert.equal(signedCookie('foo', 'keyboard cat'), 'foo')
  assert.equal(signedCookie('j:{}', 'keyboard cat'), 'j:{}')
})

it('should return false for tampered signed string', function () {
  assert.equal(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat'), false)
})

it('should return false when invalid secret is passed', function () {
  assert.equal(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ''), false)
})

it('should return unsigned value for signed string', function () {
  assert.equal(signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat'), 'foobar')
})

it.run()

describe('signedCookie(str, secret) > when secret is an array', function (it) {
  it('should return false for tampered signed string', function () {
    assert.equal(
      signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat']),
      false
    )
  })

  it('should return unsigned value for first secret', function () {
    assert.equal(
      signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat']),
      'foobar'
    )
  })

  it('should return unsigned value for second secret', function () {
    assert.equal(
      signedCookie('s:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88', ['keyboard cat', 'nyan cat']),
      'foobar'
    )
  })
})
