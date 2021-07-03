import { signedCookies } from '../src/index'
import { describe } from './helpers'
import { expect } from 'earljs'
import { suite } from 'uvu'

describe('signedCookies(obj, secret)', function (it) {
  it('should ignore non-signed strings', function () {
    expect(signedCookies({}, 'keyboard cat')).toEqual({})
    expect(signedCookies({ foo: 'bar' }, 'keyboard cat')).toEqual({})
  })

  it('should include tampered strings as false', function () {
    expect(signedCookies({ foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' }, 'keyboard cat')).toEqual({
      foo: false
    })
  })

  it('should include unsigned strings', function () {
    expect(signedCookies({ foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' }, 'keyboard cat')).toEqual({
      foo: 'foobar'
    })
  })

  it('should remove signed strings from original object', function () {
    const obj = {
      foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    } as any

    expect(signedCookies(obj, 'keyboard cat')).toEqual({ foo: 'foobar' })
    expect(obj).toEqual({})
  })

  it('should remove tampered strings from original object', function () {
    const obj = {
      foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    } as any

    expect(signedCookies(obj, 'keyboard cat')).toEqual({ foo: false })
    expect(obj).toEqual({})
  })

  it('should leave unsigned string in original object', function () {
    const obj = {
      fizz: 'buzz',
      foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    } as { fizz: string }

    expect(signedCookies(obj, 'keyboard cat')).toEqual({ foo: 'foobar' })
    expect(obj).toEqual({ fizz: 'buzz' })
  })
})

describe('signedCookies(obj, secret) > when secret is an array', function (it) {
  it('should include unsigned strings for matching secrets', function () {
    const obj = {
      buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
      fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88'
    }

    expect(signedCookies(obj, ['keyboard cat'])).toEqual({
      buzz: 'foobar',
      fizz: false
    })
  })

  it('should include unsigned strings for all secrets', function () {
    const obj = {
      buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
      fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88'
    }

    expect(signedCookies(obj, ['keyboard cat', 'nyan cat'])).toEqual({
      buzz: 'foobar',
      fizz: 'foobar'
    })
  })
})
