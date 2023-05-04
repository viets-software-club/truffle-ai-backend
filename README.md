# Truffle-AI-Backend

## Setup

```bash
git clone git@github.com:jst-seminar-rostlab-tum/truffle-ai-backend.git
npm install
npm run prepare
npx @fastify/secure-session > secret-key
npm run dev
```

`git clone git@github.com:jst-seminar-rostlab-tum/truffle-ai-frontend.git` clones the repository

`npm install` installs the packages

`npm run prepare` installs the precommit hook, that will run Eslint and Prettier before you commit anything.

`npx @fastify/secure-session > secret-key` Create secret key for session encryption

`npm run dev` check [Graphiql](http://localhost:3000/graphiql) with your browser to test the GraphQL server.
