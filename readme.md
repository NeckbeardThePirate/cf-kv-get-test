# Cloudflare KV Invalid GET Triggerer 9000

This is a test of the CF KV `.get()` method and wether or not Cloudflare treats `.get()` calls that don't hit a valid KV value that as a billed read or not. I assumed they would but this is to test that. On my personal Cloudflare account with no other KV traffic I observed the following results:

when I ran the test (originally with 10k) I got several thousand nulls back. Then between 7500-7750 calls after a few seconds I got this:

7500
[
  { status: 'fulfilled', value: null },
  ... (41 more lines like this)
  { status: 'fulfilled', value: null },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  ...(4 Identical responses)
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  { status: 'fulfilled', value: null },
  { status: 'fulfilled', value: null },
  { status: 'fulfilled', value: null },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  { status: 'fulfilled', value: null },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  { status: 'fulfilled', value: null },
  {
    status: 'rejected',
    reason: [Error: KV GET failed: 500 Internal Server Error]
  },
  { status: 'fulfilled', value: null },
  {
    status: 'rejected',
    reason: Error: internal error; reference = 0abtb855rncldl1s2ctop0l4
        at [object Object]
        at async Object.fetch (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/src/index.ts:28:20)
        at async jsonError (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts:22:10)
        at async drainBody (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts:5:10) {
      remote: true
    }
  },
  ...(many such cases)
  {
    status: 'rejected',
    reason: Error: internal error; reference = vvi2a0mm1jru41uc424g6h9u
        at [object Object]
        at async Object.fetch (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/src/index.ts:28:20)
        at async jsonError (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts:22:10)
        at async drainBody (file:///C:/Users/JudahHellandSr/projects/public/cf-kv-test/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts:5:10) {
      remote: true
    }
  },
  ... 150 more items
]
7750
⎔ Shutting down local server...
⎔ Shutting down remote connection...
Terminate batch job (Y/N)?


For obvious reasons (please don't hate me cloudflare) I shut it down at this point.


In round two I ran it with some writes and reads of values that ARE there so I can know once those metrics show up whether they counted the... 10k or so misses that I threw at it.