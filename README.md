# AI RAG Chat

A Next.js-based conversational AI application with Retrieval Augmented Generation (RAG) capabilities powered by Google Gemini and Convex backend.

## Overview

AI RAG Chat is an intelligent chat application that combines large language models with a knowledge base. Users can:

- Chat with an AI assistant powered by Google's Gemini model
- Add resources and knowledge to a persistent knowledge base
- Retrieve relevant information from the knowledge base to enhance AI responses
- Get context-aware answers based on your custom knowledge base

## Features

- **Real-time Chat Interface**: Interactive chat UI built with React and Tailwind CSS
- **Vector Embeddings**: Automatic text embedding using Google's embedding models for semantic search
- **RAG Implementation**: Retrieve relevant documents before generating responses
- **Persistent Storage**: Convex backend for storing documents and embeddings
- **Tool-based Architecture**: AI tools for adding resources and retrieving information
- **Streaming Responses**: Real-time response streaming for improved UX
- **TypeScript Support**: Full TypeScript support for type-safe development

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org) with React 19
- **Backend**: [Convex](https://www.convex.dev) - serverless backend with real-time database
- **AI/ML**:
  - [Google Generative AI](https://ai.google.dev) - Gemini LLM
  - [Vercel AI SDK](https://sdk.vercel.ai) - unified AI framework
  - Vector embeddings with Google Embedding models
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Package Manager**: [pnpm](https://pnpm.io)
- **Validation**: [Zod](https://zod.dev)

## Project Structure

```
├── app/                           # Next.js app directory
│   ├── page.tsx                  # Main chat interface
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint with RAG logic
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── ConvexClientProvider.tsx  # Convex provider
├── convex/                        # Convex backend
│   ├── schema.ts                 # Database schema with vector index
│   └── documents.ts              # Document management functions
├── lib/
│   └── ai/
│       └── embedding.ts          # Embedding generation utilities
├── public/                        # Static assets
└── .env                          # Environment configuration
```

## Setup & Installation

### Prerequisites

- Node.js 18+ (with pnpm)
- Google Generative AI API key
- Convex account

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-rag-chat
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create or update `.env` file with:
   ```env
   # Convex deployment configuration
   CONVEX_DEPLOYMENT=dev:your-deployment-id
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

   # Google Generative AI API
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
   ```

4. **Start Convex backend**
   ```bash
   npx convex dev
   ```

5. **Run development server** (in another terminal)
   ```bash
   pnpm dev
   ```

6. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### Chat Flow

1. **User Message**: User enters a message in the chat interface
2. **Tool Invocation**: The AI system can invoke tools:
   - **addResource**: Add knowledge to the knowledge base with automatic embedding
   - **getInformation**: Retrieve relevant documents based on semantic similarity
3. **RAG Processing**: 
   - Text is split into chunks and converted to vector embeddings
   - Embeddings are stored in Convex with vector indexing
   - Similar documents are retrieved based on query embeddings
4. **Response Generation**: AI generates responses with context from retrieved documents
5. **Response Streaming**: Responses are streamed back to the client in real-time

### Key Components

- **Chat API** (`app/api/chat/route.ts`): Handles message processing with Gemini model and tool execution
- **Embedding Service** (`lib/ai/embedding.ts`): Generates vector embeddings for documents
- **Database Schema** (`convex/schema.ts`): Defines document storage with vector index for similarity search
- **Chat UI** (`app/page.tsx`): Real-time chat interface with message streaming

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Adding Custom Tools

Edit `app/api/chat/route.ts` to add more tools:

```typescript
tools: {
  yourTool: tool({
    description: 'Tool description',
    inputSchema: z.object({
      // Define inputs here
    }),
    execute: async (input) => {
      // Tool implementation
    },
  }),
}
```

## API Reference

### POST /api/chat

Send a message and get an AI response with RAG capabilities.

**Request:**
```json
{
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Your question here"
    }
  ]
}
```

**Response:**
Streaming text response from the AI model

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.

### Deploy Backend with Convex

Follow [Convex deployment guide](https://docs.convex.dev/production) to deploy your backend.

## Troubleshooting

- **API Key Issues**: Ensure your Google API key is valid and has the necessary permissions
- **Embedding Errors**: Check that the embedding model (`google/gemini-embedding-001`) is available
- **Convex Connection**: Verify your Convex deployment ID and URL are correctly set in `.env`

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.
