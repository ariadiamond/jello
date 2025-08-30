## Getting Started

To run this application:

```bash
./setup.sh
npm install
npm run build
npm run start
```

This should then start a server on localhost:3000, which you can navigate to in your browser to interact with this.

## Architectural Limitations
- Currently the Database Schema is located in a [setup script](./setup.sh), which does not allow for migrations. It's likely that as this project grows the schema will change (it already has), and just making those updates manually is not a sustainable solution.
- I feel very unsure of the [SQL sanitization](https://github.com/ariadiamond/jello/blob/b70ebd65b8ebc8fead5c30c5a6dd9d27769a39f3/src/api/factoryBuild.ts#L32).
- [ ] Join Queries
- [ ] Typeaheads + Searching + Filtering + Limits (especially if these lists get longer)

## Sources
- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
