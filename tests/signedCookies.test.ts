import { signedCookies } from '../src/index'
import { describe } from './helpers'
import * as assert from 'node:assert'

describe('signedCookies(obj, secret)', (it) => {
  it('should ignore non-signed strings', () => {
    assert.deepEqual(signedCookies({}, 'keyboard cat'), {})
    assert.deepEqual(signedCookies({ foo: 'bar' }, 'keyboard cat'), {})
  })

  it('should include tampered strings as false', () => {
    assert.deepEqual(signedCookies({ foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' }, 'keyboard cat'), {
      foo: false
    })
  })

  it('should include unsigned strings', () => {
    assert.deepEqual(signedCookies({ foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE' }, 'keyboard cat'), {
      foo: 'foobar'
    })
  })

  it('should remove signed strings from original object', () => {
    const obj = {
      foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    }

    assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: 'foobar' })
    assert.deepEqual(obj, {})
  })

  it('should remove tampered strings from original object', () => {
    const obj = {
      foo: 's:foobaz.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    }

    assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: false })
    assert.deepStrictEqual(obj, {})
  })

  it('should leave unsigned string in original object', () => {
    const obj = {
      fizz: 'buzz',
      foo: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE'
    }

    assert.deepEqual(signedCookies(obj, 'keyboard cat'), { foo: 'foobar' })
    assert.deepEqual(obj, { fizz: 'buzz' })
  })
})

describe('signedCookies(obj, secret) > when secret is an array', (it) => {
  it('should include unsigned strings for matching secrets', () => {
    const obj = {
      buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
      fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88'
    }

    assert.deepEqual(signedCookies(obj, ['keyboard cat']), {
      buzz: 'foobar',
      fizz: false
    })
  })

  it('should include unsigned strings for all secrets', () => {
    const obj = {
      buzz: 's:foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE',
      fizz: 's:foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88'
    }

    const expected = Object.create(null)

    expected.buzz = 'foobar'
    expected.fizz = 'foobar'

    assert.deepEqual(signedCookies(obj, ['keyboard cat', 'nyan cat']), expected)
  })
})
