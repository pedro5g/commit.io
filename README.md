# Commit.oi

Commit.oi é uma rede social para desenvolvedores, onde é possível criar perfis, compartilhar posts e snippets de código, interagir com outros devs através de curtidas e comentários, e utilizar um chat em tempo real. O projeto será desenvolvido com uma stack JavaScript moderna e baseada em microsserviços.

## 🚀 Stack Tecnológica

- **Frontend:** Next.js (SSR e SSG para melhor performance)
- **Backend:** Microsserviços com Express.js
- **Banco de Dados:** PostgreSQL + Redis (para cache/chat em tempo real)
- **Autenticação:** JWT + OAuth (GitHub, Google, etc.)
- **Mensageria:** RabbitMQ
- **Armazenamento de Arquivos:** Cloudflare r2

## 📂 Estrutura de Pastas

```plaintext
commit.oi/
│── apps/                      # Aplicações principais (frontend + microsserviços)
│   ├── web/                   # Frontend Next.js
│   ├── services/              # Microsserviços backend
│   │   ├── users/             # Serviço de usuários (perfis, autenticação)
│   │   ├── posts/             # Serviço de posts/snippets
│   │   ├── chat/              # Serviço de mensagens em tempo real
│   │   ├── notifications/     # Serviço de notificações
│── packages/                  # Pacotes reutilizáveis
│   ├── shared/                # Código compartilhado (modelos, utilitários, middlewares)
│   ├── config/                # Configurações globais (variáveis de ambiente)
│── infra/                     # Infraestrutura (Docker, Prisma)
│   ├── docker/                # Configurações do Docker para os serviços
│   ├── database/              # Migrations e configurações do banco
│── docs/                      # Documentação do projeto
│── .env.example               # Exemplo de variáveis de ambiente
│── package.json               # Configuração do monorepo
│── README.md                  # Documentação inicial do projeto
```

## 🔥 Principais Funcionalidades

- **📝 Perfis de Usuário** com bio, foto e informações técnicas.
- **📌 Posts e Snippets** para compartilhar conhecimento.
- **💬 Chat em Tempo Real** para conversas diretas.
- **❤️ Curtidas e Comentários** em publicações.
- **👥 Seguir Usuários** para acompanhar atualizações.
- **🔔 Sistema de Notificações** sobre interações.
