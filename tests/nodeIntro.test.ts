import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { getNodeIntro, NODE_INTRO_LOCALES } from '../src/views/home/components/nodeIntro'

test('maps indexes 0 and 1 to the two Chinese node introductions', () => {
  assert.match(getNodeIntro('zh', 0), /Visa卡业务分红节点/)
  assert.match(getNodeIntro('zh', 1), /AI量化手机节点/)
})

test('falls back to Simplified Chinese for an unknown locale', () => {
  assert.equal(getNodeIntro('unknown', 0), getNodeIntro('zh', 0))
})

test('returns empty content for an invalid node index', () => {
  assert.equal(getNodeIntro('zh', -1), '')
  assert.equal(getNodeIntro('zh', 2), '')
})

test('provides both introductions for every enabled locale', () => {
  assert.deepEqual(NODE_INTRO_LOCALES, ['en', 'ko', 'ja', 'ru', 'hi', 'ma', 'id', 'vi', 'hk', 'zh'])
  for (const locale of NODE_INTRO_LOCALES) {
    assert.notEqual(getNodeIntro(locale, 0), '')
    assert.notEqual(getNodeIntro(locale, 1), '')
  }
})

test('Node popup renders the local introduction instead of the API intro', () => {
  const componentPath = fileURLToPath(new URL('../src/views/home/components/Node.vue', import.meta.url))
  const source = readFileSync(componentPath, 'utf8')
  assert.match(source, /v-html="currentIntro"/)
  assert.doesNotMatch(source, /currentPicker\?\.intro/)
})
