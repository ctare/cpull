import test, { ExecutionContext } from 'ava'
import { Minit } from '../src/minit'
import fs from 'fs'
import path from 'path'

/**
 * clear tmp/*
 * 
 * rm -rf tmp
 * mkdir tmp
 */
function clearTmp() {
  const dir = path.resolve('tmp')
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }

  // create tmp directory
  fs.mkdirSync(dir)
}

function assertFileTypes(t: ExecutionContext, filename: string, stat: (stat: fs.Stats) => boolean): void {
  if (!fs.existsSync(filename)) {
    t.fail("file not found: " + filename)
  }

  if (!stat(fs.statSync(filename))) {
    t.fail("file type is not matched: " + filename)
  }

  t.pass()
}

function assertContainsAll(t: ExecutionContext, actual: string[], expected: string[]): void {
  // diff = expected - actual
  // 差分があれば失敗、残ったものを表示する
  const diff = expected.filter((value) => !actual.includes(value))
  if (diff.length > 0) {
    t.fail(`not contains all: ${diff}`)
  }

  t.pass()
}

function assertFile(t: ExecutionContext, filename: string): void {
  assertFileTypes(t, filename, (stat: fs.Stats) => stat.isFile())
}

function assertDir(t: ExecutionContext, dirname: string): void {
  assertFileTypes(t, dirname, (stat: fs.Stats) => stat.isDirectory())
}

test.before(_ => {
  clearTmp()
})

test.afterEach(_ => {
  clearTmp()
})

test.serial('file copy', t => {
  Minit.copyFile('templates/sample', 'tmp/')

  assertFile(t, 'tmp/main.cpp')

  assertDir(t, 'tmp/dirA')
  assertDir(t, 'tmp/dirA/recA')
  assertFile(t, 'tmp/dirA/recB/fileRecB')
})

test.serial('skip file copy', t => {
  const first = Minit.copyFile('templates/duplicate', 'tmp/')
  const second = Minit.copyFile('templates/sample', 'tmp/')

  const expected = ['/main.cpp', '/dirB/fileB']
  assertContainsAll(t, second.skipped, expected)
})

test.serial('save config file', async t => {
  const stores = Minit.loadStores('./tmp')

  // wait callback
  const promise = new Promise<void>((resolve, reject) => {
    stores.templateRoot.set('./templates', () => {
      resolve()
    })
  })

  await promise
  
  assertFile(t, 'tmp/config.json')
})

test.serial('load config file', async t => {
  const stores = Minit.loadStores('./tmp')

  // wait callback
  const promise = new Promise<void>((resolve, reject) => {
    stores.templateRoot.set('./templates', () => {
      resolve()
    })
  })

  await promise

  const stores2 = Minit.loadStores('./tmp')
  const path = stores2.templateRoot.get()
  const last = path.split('/').reverse()[0]

  t.is(last, 'templates')
})

test.serial('get templates', t => {
  const templates = Minit.getTemplates('templates')
  const expected = ['sample', 'sample2', 'duplicate']

  assertContainsAll(t, templates, expected)
})

test.serial('is dir', t => {
  t.true(Minit.isDir('templates'))
  t.false(Minit.isDir('templates/sample/input'))
})