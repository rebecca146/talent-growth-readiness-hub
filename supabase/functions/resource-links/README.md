# resource-links

Supabase Edge Function that returns 2-3 "free resources" links for each roadmap recommendation in the assessment. It proxies Firecrawl search so the Firecrawl key never reaches the browser.

This folder is a copy of what is deployed in the `talent-growth-readiness-hub` Supabase project (deployed version 4, Nov 10, 2026). If you change the code here, redeploy it for the change to go live.

## Dependencies

- **Firecrawl API, v2** (`POST https://api.firecrawl.dev/v2/search`). The old v1 API is removed on Dec 10, 2026.
- **`FIRECRAWL_API_KEY`** secret, set in the Supabase dashboard (Project Settings > Edge Functions). Never put it in this repo.

## Request / response

Callers must send the project's publishable (anon) key in the `Authorization` header (`verify_jwt` is on).

```json
// POST /functions/v1/resource-links
{ "query": "free leadership development course" }

// 200 response
{ "results": [ { "title": "...", "url": "https://...", "description": "..." } ] }
```

Errors: `400` if `query` is missing, `500` if the key isn't set, `502` if Firecrawl returns an error (its message is in `detail`).

## Deploy

```bash
npx supabase functions deploy resource-links --project-ref rmdgobeswwyfauuuhhbn
```
