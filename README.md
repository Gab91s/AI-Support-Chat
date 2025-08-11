© 2025 Gabrielle Saab — Licensed under the Apache License 2.0

# AI Support Chatbot (React Version)

This is the full-featured version of my AI chatbot app built with React and Next.js. It currently supports OpenAI integration and will be expanded in future phases to include user authentication, chat history, dashboard features, and more.

Portions of this codebase were generated with the assistance of ChatGPT and reviewed/modified by the project author.

## 🌐 Live Demo
*Coming soon – hosted on Vercel or AWS*

## 🧠 Features
- Real-time chat UI using OpenAI’s API
- Responsive interface built with MUI and Emotion
- Serverless API routing via Next.js
- Planned expansion: user logins, saved conversations, custom dashboards

## 📦 Tech Stack
- React 18
- Next.js
- OpenAI API
- MUI (Material UI)
- Emotion (CSS-in-JS)
- Vercel / AWS (deployment)

## 🧪 Local Development

```bash
git clone https://github.com/Gab91s/AI-Support-Chat.git
cd ai-support2
npm install

# Add your OpenAI API key
echo "OPENAI_API_KEY=your-key-here" > .env.local

npm run dev
```

Visit `http://localhost:3000` to begin chatting.

## 🗂 Project Structure
/app
  /api/route.js         # API endpoint for OpenAI
  /chat/page.js         # Chat interface
  /widget/page.js       # Planned lightweight widget
/styles/global.css

## 🛣️ Roadmap
- [x] OpenAI message routing
- [x] Responsive UI
- [ ] Create widget-only version (HTML/iframe)
- [ ] User authentication (Clerk, Firebase, or NextAuth)
- [ ] Save and retrieve chat history
- [ ] User dashboard with chat insights
- [ ] Failover logic (local model fallback)

## 🧭 Project Management
This repo follows a lightweight Agile workflow (see `workflow.md`) and uses GitHub Projects for story tracking. You’re welcome to fork or contribute!

## 📄 License & Attribution

This project is licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Portions of this codebase were generated with the assistance of ChatGPT
and have been reviewed and modified by the project author.

See the [LICENSE](./LICENSE) and [NOTICE](./NOTICE) files for details.
