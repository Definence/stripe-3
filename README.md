This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Stripe Checkout is the fastest way to get started with payments. Included are some basic build and run scripts you can use to start up the application.

### Development

1. Build the application
```shell
$ npm install
```

2. _Optional_: download and run the [Stripe CLI](https://stripe.com/docs/stripe-cli)
```shell
$ stripe listen --forward-to localhost:4044/api/webhooks
```

3. Run the application
```shell
$ STRIPE_WEBHOOK_SECRET=$(stripe listen --print-secret) npm run dev
```

4. Go to [localhost:4044](http://localhost:4044)

### Production

1. Build the application
```shell
$ npm install

$ npm build
```

2. Run the application
```shell
$ npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
