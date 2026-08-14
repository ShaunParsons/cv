#!/usr/bin/env node
// Fetch one URL through a real (headless) Chromium and print what rendered.
//
// The fallback for pages a plain HTTP fetch cannot read: bot walls that 403
// or hang a non-browser client, and client-rendered shells that return empty
// HTML. It is not a crawler - one URL per invocation, one page load, so its
// request rate is the caller's, which in this pipeline is a verifier working
// through a handful of leads.
//
//   node browser_fetch.mjs <url> [--timeout <ms>] [--headed]
//
// stdout on success: one JSON object -
//   { requestedUrl, finalUrl, status, title, text }
// where text is the rendered page's visible text. A non-200 status is still
// a success here - a rendered 404 page is an answer. Exit 1 with JSON
// { error } on stderr only when nothing rendered at all.
//
// Setup (once): npm install in this directory, then
// npx playwright install chromium. See SKILL.md.

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error(JSON.stringify({
    error: 'playwright is not installed - run: npm install in ' +
      new URL('.', import.meta.url).pathname +
      ' then: npx playwright install chromium',
  }))
  process.exit(1)
}

const argv = process.argv.slice(2)
const url = argv.find((a) => !a.startsWith('--'))
if (!url) {
  console.error(JSON.stringify({ error: 'usage: browser_fetch.mjs <url> [--timeout <ms>] [--headed]' }))
  process.exit(2)
}
const tIdx = argv.indexOf('--timeout')
const timeout = tIdx >= 0 ? Number(argv[tIdx + 1]) : 45_000
const headed = argv.includes('--headed')
const MAX_TEXT = 60_000

const browser = await chromium.launch({
  headless: !headed,
  args: ['--disable-blink-features=AutomationControlled'],
})

try {
  // Present the UA real Chrome would send from this OS: same Chromium major
  // as the bundled browser, in the reduced form Chrome itself uses, without
  // the Headless marker that trips the simpler bot walls.
  const major = browser.version().split('.')[0]
  const platform = process.platform === 'darwin'
    ? 'Macintosh; Intel Mac OS X 10_15_7'
    : process.platform === 'win32' ? 'Windows NT 10.0; Win64; x64' : 'X11; Linux x86_64'
  const context = await browser.newContext({
    userAgent: `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36`,
    viewport: { width: 1366, height: 900 },
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  })
  const page = await context.newPage()
  // Skip the heavy resources - the deliverable is text, and fewer requests
  // is both faster and politer.
  await page.route('**/*', (route) =>
    ['image', 'media', 'font'].includes(route.request().resourceType())
      ? route.abort()
      : route.continue())

  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout })
  // Let client-rendered pages finish; a page that never settles still gets
  // read as it stands rather than failing the fetch.
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  const text = await page.evaluate(() => document.body?.innerText ?? '')
  console.log(JSON.stringify({
    requestedUrl: url,
    finalUrl: page.url(),
    status: response?.status() ?? null,
    title: await page.title(),
    text: text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT)}\n[truncated at ${MAX_TEXT} characters]` : text,
  }))
} catch (err) {
  console.error(JSON.stringify({ error: String(err?.message ?? err), requestedUrl: url }))
  process.exitCode = 1
} finally {
  await browser.close()
}
