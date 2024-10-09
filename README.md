# Next JS + FastAPI Streaming Example

This example demonstrates how to stream text and objects from a FastAPI backend to a Next.js frontend with 3 different approaches:
 - Text stream with [Vercel AI SDK](https://sdk.vercel.ai/docs) `useChat` hook
 - Object stream as text with `useObject` hook
 - Partial json object stream with custom hook implementation

Original application taken from: https://github.com/vercel-labs/ai-sdk-preview-use-object

Backend FastAPI client library uses my [Simple AI Agents](https://github.com/timlrx/simple-ai-agents) library but the text streaming example can be replaced with any other API and the object stream examples could be replaced with [Instructor](https://github.com/jxnl/instructor) patched client.

The FastAPI server is served from the `/api` directory and `next.config.mjs` is configured to rewrite requests to `/api/:path*`.

On local development, the FastAPI server is served on localhost:8000. I deployed the FastAPI backend to a standalone server using the `Dockerfile` and `docker-compose.yml` files. Alternatively, when deployed to Vercel, the FastAPI server is deployed as [Python serverless functions](https://vercel.com/docs/functions/runtimes/python) - though there seems to be an issue with the streaming responses.

## Demo


https://github.com/user-attachments/assets/573f8041-dc52-4b19-906a-dff845e47e07

https://github.com/user-attachments/assets/037562d2-aab5-4762-95b1-995f85dd4d22

https://github.com/user-attachments/assets/ab1cf15a-2cd3-4281-86b3-42be2f27a90c


## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-use-object&env=OPENAI_API_KEY&envDescription=API%20keys%20needed%20for%20application&envLink=platform.openai.com)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/timlrx/next-fastapi-object-stream
```

```bash
yarn create next-app --example https://github.com/timlrx/next-fastapi-object-stream
```

```bash
pnpm create next-app --example https://github.com/timlrx/next-fastapi-object-stream
```

To run the example locally you need to:

1. Sign up for API key with OpenAI or Github. Thanks to [LiteLLM](https://github.com/BerriAI/litellm) 100+ models are supported, but not all providers support object streaming.
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env`.
4. `npm install` and `pip install -r requirements.txt` to install the required dependencies.
5. `npm run dev` to launch the development server.
