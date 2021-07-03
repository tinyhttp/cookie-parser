import { signedCookie } from '../src/index'
import { describe } from './helpers'
import { expect } from 'earljs'
import { suite } from 'uvu'

let it = suite('signedCookie(str, secret)')

it('should return undefined for non-string arguments', function () {
  expect(signedCookie(undefined, 'keyboard cat')).toEqual(undefined)
  expect(signedCookie(null, 'keyboard cat')).toEqual(undefined)
  expect(signedCookie(42, 'keyboard cat')).toEqual(undefined)
  expect(signedCookie({}, 'keyboard cat')).toEqual(undefined)
})

it('should pass through non-signed string', function () {
  expect(signedCookie('', 'keyboard cat')).toBeA('')
  expect(signedCookie('foo', 'keyboard cat')).toBeA('foo')
  expect(signedCookie('j:{}', 'keyboard cat')).toBeA('j:{}')
})

it('should return false for tampered signed string', function () {
  expect(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat')).toBeA(false)
})

it('should return unsigned value for signed string', function () {
  expect(signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat')).toBeA('foobar')
})

it.run()

describe('signedCookie(str, secret) > when secret is an array', function (it) {
  it('should return false for tampered signed string', function () {
    expect(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat'])).toBeA(
      false
    )
  })

  it('should return unsigned value for first secret', function () {
    expect(signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat'])).toBeA(
      'foobar'
    )
  })

  it('should return unsigned value for second secret', function () {
    expect(signedCookie('s:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88', ['keyboard cat', 'nyan cat'])).toBeA(
      'foobar'
    )
  })
})
