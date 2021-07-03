import { suite } from 'uvu'

export function describe(name: string, fn: (...args: any[]) => void) {
  const s = suite(name)
  fn(s)
  s.run()
}
