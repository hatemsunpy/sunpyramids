import fs from 'node:fs'
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const p = d.categories.performance
console.log('Performance score', p.score)
const a = d.audits
const get = (k) => {
  const v = a[k]
  return v ? { score: v.score, value: v.numericValue, display: v.displayValue } : null
}
console.log({
  LCP: get('largest-contentful-paint'),
  FCP: get('first-contentful-paint'),
  TBT: get('total-blocking-time'),
  TTI: get('interactive'),
  CLS: get('cumulative-layout-shift'),
})
const items = a['network-requests']?.details?.items || []
const scripts = items.filter((i) => i.resourceType === 'Script')
console.log('Total requests', items.length)
console.log('Scripts', scripts.length)
console.log('Script URLs:')
scripts.forEach((i) => console.log(`  ${i.url.slice(0, 120)} ${(i.transferSize / 1024).toFixed(1)}KB`))
