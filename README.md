# agency-website

Agency-vertical demo project for **Aperture & Ink**, a fictional independent
creative studio in DUMBO, Brooklyn. Forked from `ray-website` (CLO-41) as
the agency vertical migration of the Ray template, with:

- An entirely fictional persona (Reese Okonkwo, Founder & ECD) and content.
- A rich, public, **login-less client portal** that walks through Tide & Tonic's
  brand identity + packaging + launch-campaign build.

Deployed to [agency.clockless.ai](https://agency.clockless.ai) via Cloudflare
Pages (project: `agency-website`).

## Stack

- Static HTML landing + subpages (`/`, `/about/`, `/services/`,
  `/testimonials/`, `/contact/`)
- Vite + React 19 SPA at `/portal/`
- Single shared design system in `src/styles/site.css` and `public/site.css`

## Develop

```bash
npm install
npm run dev        # vite dev server on :5173
npm run build      # outputs dist/
npm run preview    # serve the dist/ build locally
```

## Deploy

A push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm run build` and deploys `dist/` to the `agency-website` Cloudflare
Pages project. The custom domain `agency.clockless.ai` is attached to
that project in the Cloudflare dashboard.
