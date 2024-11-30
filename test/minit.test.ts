import test from 'ava'
import { Minit } from '../src/minit'

test('sample', t => {
  t.pass()
})

test("loadStore", t => {
  const store = Minit.loadStore("./tmp")
  store["key"] = "value"
  t.deepEqual(store, { "key": "value" })
})

test("f", t => {
  t.pass()
})

