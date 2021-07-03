import { signedCookie } from '../src/index'
import { describe } from './helpers'
import expect from 'expect'
import { suite } from 'uvu'

const it = suite('signedCookie(str, secret)')

it('should return undefined for non-string arguments', function () {
  expect(signedCookie(undefined, 'keyboard cat')).toStrictEqual(undefined)
  expect(signedCookie(null, 'keyboard cat')).toStrictEqual(undefined)
  expect(signedCookie(42, 'keyboard cat')).toStrictEqual(undefined)
  expect(signedCookie({}, 'keyboard cat')).toStrictEqual(undefined)
})

it('should pass through non-signed string', function () {
  expect(signedCookie('', 'keyboard cat')).toBe('')
  expect(signedCookie('foo', 'keyboard cat')).toBe('foo')
  expect(signedCookie('j:{}', 'keyboard cat')).toBe('j:{}')
})

it('should return false for tampered signed string', function () {
  expect(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat')).toBe(false)
})

it('should return unsigned value for signed string', function () {
  expect(signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat')).toBe('foobar')
})

it.run()

describe('signedCookie(str, secret) > when secret is an array', function (it) {
  it('should return false for tampered signed string', function () {
    expect(signedCookie('s:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat'])).toBe(
      false
    )
  })

  it('should return unsigned value for first secret', function () {
    expect(signedCookie('s:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', ['keyboard cat', 'nyan cat'])).toBe(
      'foobar'
    )
  })

  it('should return unsigned value for second secret', function () {
    expect(signedCookie('s:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88', ['keyboard cat', 'nyan cat'])).toBe(
      'foobar'
    )
  })
})
