This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Billing Hub

The private billing tool lives at `/billing`.

Set these environment variables in Vercel before using it:

- `BILLING_HUB_PASSWORD`: password required to open the Billing Hub.
- `BILLING_HUB_SESSION_SECRET`: long random value used to sign the login session.
- `MS_TENANT_ID`: Microsoft Entra tenant ID for the billing audit app.
- `MS_CLIENT_ID`: Microsoft Entra app/client ID.
- `MS_CLIENT_SECRET`: Microsoft Entra client secret.

The Billing Hub currently stores working invoice, quote, payment, and Microsoft 365 audit data in the browser after login. Use the built-in backup button before changing browsers or machines.

## Client Portal

The private client portal lives at `/portal`. It reuses the Billing Hub login session and includes support tickets, Microsoft 365 requests, billing, and service audits. Ticket intake pulls NinjaOne organizations for the ticket client dropdown and creates tickets in NinjaOne automatically when saved.

NinjaOne ticket creation uses these environment variables:

- `NINJAONE_CLIENT_ID`: NinjaOne API client ID.
- `NINJAONE_CLIENT_SECRET`: NinjaOne API client secret.
- `NINJAONE_OAUTH_CLIENT_ID`: optional NinjaOne regular web application client ID for ticket writes and comments. If omitted, the portal falls back to `NINJAONE_CLIENT_ID`.
- `NINJAONE_OAUTH_CLIENT_SECRET`: optional NinjaOne regular web application client secret for ticket writes and comments. If omitted, the portal falls back to `NINJAONE_CLIENT_SECRET`.
- `NINJAONE_ACCESS_TOKEN`: optional user-context OAuth access token for NinjaOne ticket creation.
- `NINJAONE_REFRESH_TOKEN`: optional user-authorized OAuth refresh token. NinjaOne may require this for ticket creation even when client credentials can read organizations and service audits.
- `NINJAONE_TICKET_FORM_ID`: optional default ticket form ID. If omitted, the first active ticket form is used.
- `NINJAONE_TICKET_STATUS`: optional default NinjaOne status ID/name. Defaults to `1000`.
- `NINJAONE_API_ROOT`: optional NinjaOne API root. Defaults to `https://us2.ninjarmm.com`.
- `NINJAONE_OAUTH_REDIRECT_URI`: optional OAuth redirect URI for the regular web application. Defaults to `/api/ninjaone-oauth-callback` on the current host.
- `NINJAONE_REDIRECT_URI`: legacy OAuth redirect URI fallback.

To create the user-context token for ticket creation, create a NinjaOne regular web application with Authorization Code and Refresh Token enabled, add this redirect URI to that web app, set the `NINJAONE_OAUTH_*` variables, and visit `/api/ninjaone-oauth-login` locally or in production.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
