# Node Intro Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the node purchase popup's API-provided introduction with two index-mapped, locally maintained HTML introductions translated into every currently enabled UI language.

**Architecture:** A focused `nodeIntro.ts` module owns static HTML by locale and exposes a typed lookup function with a Simplified Chinese locale fallback. `Node.vue` observes the global Vue I18n locale and the existing picker index, then renders the lookup result while retaining API data for every other node field.

**Tech Stack:** Vue 3 Composition API, TypeScript 5.7, Vue I18n 9, Node test runner through the existing `tsx` dev dependency, Vite 6.

## Global Constraints

- Index `0` maps to Visa卡业务分红节点; index `1` maps to AI量化手机节点.
- Supported locales are exactly `en`, `ko`, `ja`, `ru`, `hi`, `ma`, `id`, `vi`, `hk`, and `zh`.
- Unknown locales fall back to Simplified Chinese.
- Invalid node indexes return an empty string.
- Static HTML may use headings, paragraphs, lists, and emphasis, but may not contain interface or user-provided data.
- The API remains responsible for node names, images, prices, inventory, IDs, and purchase data.

---

### Task 1: Typed Node Introduction Data and Lookup

**Files:**
- Create: `src/views/home/components/nodeIntro.ts`
- Create: `src/views/home/components/nodeIntro.test.ts`

**Interfaces:**
- Consumes: locale strings from Vue I18n and the existing zero-based `pickerCurrent` number.
- Produces: `getNodeIntro(locale: string, nodeIndex: number): string` and `NODE_INTRO_LOCALES`, a readonly locale list.

- [ ] **Step 1: Write the failing lookup test**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { getNodeIntro, NODE_INTRO_LOCALES } from './nodeIntro'

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
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npx tsx --test src/views/home/components/nodeIntro.test.ts`

Expected: FAIL because `./nodeIntro` does not exist.

- [ ] **Step 3: Add the typed lookup and complete translated HTML dataset**

Create `nodeIntro.ts` with this public shape, filling `NODE_INTROS` with complete HTML translations of both DOCX sections for every declared locale:

```ts
export const NODE_INTRO_LOCALES = ['en', 'ko', 'ja', 'ru', 'hi', 'ma', 'id', 'vi', 'hk', 'zh'] as const

type NodeIntroLocale = (typeof NODE_INTRO_LOCALES)[number]
type NodeIntroPair = readonly [visa: string, aiPhone: string]

const NODE_INTROS: Record<NodeIntroLocale, NodeIntroPair> = {
  en: [EN_VISA_HTML, EN_AI_PHONE_HTML],
  ko: [KO_VISA_HTML, KO_AI_PHONE_HTML],
  ja: [JA_VISA_HTML, JA_AI_PHONE_HTML],
  ru: [RU_VISA_HTML, RU_AI_PHONE_HTML],
  hi: [HI_VISA_HTML, HI_AI_PHONE_HTML],
  ma: [MS_VISA_HTML, MS_AI_PHONE_HTML],
  id: [ID_VISA_HTML, ID_AI_PHONE_HTML],
  vi: [VI_VISA_HTML, VI_AI_PHONE_HTML],
  hk: [ZH_HANT_VISA_HTML, ZH_HANT_AI_PHONE_HTML],
  zh: [ZH_HANS_VISA_HTML, ZH_HANS_AI_PHONE_HTML],
}

const isNodeIntroLocale = (locale: string): locale is NodeIntroLocale =>
  NODE_INTRO_LOCALES.includes(locale as NodeIntroLocale)

export const getNodeIntro = (locale: string, nodeIndex: number): string => {
  if (nodeIndex !== 0 && nodeIndex !== 1) return ''
  const resolvedLocale = isNodeIntroLocale(locale) ? locale : 'zh'
  return NODE_INTROS[resolvedLocale][nodeIndex]
}
```

Each HTML constant must preserve the source document's section headings, numbered conditions, monetary amounts, dates, percentages, and risk statements. Use `<section>`, `<h3>`, `<h4>`, `<p>`, `<ol>`, `<ul>`, `<li>`, and `<strong>` only.

- [ ] **Step 4: Run the lookup tests**

Run: `npx tsx --test src/views/home/components/nodeIntro.test.ts`

Expected: 4 tests pass with 0 failures.

- [ ] **Step 5: Commit the data module and tests when Git write access is available**

```bash
git add src/views/home/components/nodeIntro.ts src/views/home/components/nodeIntro.test.ts
git commit -m "feat: add localized node introductions"
```

### Task 2: Node Popup Integration and Presentation

**Files:**
- Modify: `src/views/home/components/Node.vue`
- Test: `src/views/home/components/nodeIntro.test.ts`

**Interfaces:**
- Consumes: `getNodeIntro(locale: string, nodeIndex: number): string` from Task 1, `i18n.global.locale`, and `pickerCurrent`.
- Produces: reactive `currentIntro` HTML used solely by the purchase introduction popup.

- [ ] **Step 1: Add a source-level regression assertion before changing the component**

Append this test to `nodeIntro.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

test('Node popup renders the local introduction instead of the API intro', () => {
  const componentPath = fileURLToPath(new URL('./Node.vue', import.meta.url))
  const source = readFileSync(componentPath, 'utf8')
  assert.match(source, /v-html="currentIntro"/)
  assert.doesNotMatch(source, /currentPicker\?\.intro/)
})
```

- [ ] **Step 2: Run the test and verify the component assertion fails**

Run: `npx tsx --test src/views/home/components/nodeIntro.test.ts`

Expected: the new component integration test FAILS because `Node.vue` still binds `currentPicker?.intro`.

- [ ] **Step 3: Integrate the local lookup into `Node.vue`**

Add the imports and computed value:

```ts
import { i18n, t } from '@/locale'
import { getNodeIntro } from './nodeIntro'

const currentIntro = computed(() =>
  getNodeIntro(i18n.global.locale.value, pickerCurrent.value),
)
```

Replace the popup binding:

```vue
<div class="noticecontent mt30 size28" v-html="currentIntro"></div>
```

Add scoped rich-text spacing using `:deep()` so injected HTML receives styles:

```scss
.noticecontent {
  line-height: 1.65;

  :deep(h3),
  :deep(h4) {
    margin: 24px 0 12px;
    line-height: 1.4;
  }

  :deep(h3:first-child) {
    margin-top: 0;
  }

  :deep(p),
  :deep(ol),
  :deep(ul) {
    margin: 12px 0;
  }

  :deep(ol),
  :deep(ul) {
    padding-left: 36px;
  }

  :deep(li + li) {
    margin-top: 8px;
  }
}
```

- [ ] **Step 4: Run the complete focused test file**

Run: `npx tsx --test src/views/home/components/nodeIntro.test.ts`

Expected: 5 tests pass with 0 failures.

- [ ] **Step 5: Run production verification**

Run: `npm run build`

Expected: `vue-tsc -b` and `vite build` both exit with status 0.

- [ ] **Step 6: Audit critical content and removed API usage**

Run: `rg -n "currentPicker\?\.intro|Visa卡业务分红节点|AI量化手机节点|2026年12月31日|2000 USDT|12,000 USDT" src/views/home/components`

Expected: no `currentPicker?.intro` match; Simplified Chinese data contains both titles, the Visa principal commitment, and the AI-phone minimum earnings clause.

- [ ] **Step 7: Commit the popup integration when Git write access is available**

```bash
git add src/views/home/components/Node.vue src/views/home/components/nodeIntro.test.ts
git commit -m "feat: use localized node intro content"
```

