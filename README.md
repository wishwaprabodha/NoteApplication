# Note Taking Application

A robust note-taking application built with modern technologies, featuring full-text search capabilities and efficient data management.

## 🚀 Technology Stack

- **Node.js**: v20.x
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Cache & Search**: Redis with RediSearch module
- **Container**: Docker & Docker Compose

## 🏗️ Architecture Overview

### Database Layer

#### MySQL Configuration
- **ORM**: Sequelize
- **Volume Mount**: `/temp/mysql`
- **Schema Creation**: Auto-generated through Sequelize model sync
- **Schema Location**: `/connectors/db`
- **Optimized Indexes**:
    - Full-text composite index on `content` (WIP)
    - Full-text composite index on `title`   (WIP)
    - Regular index on `user_id`

#### Redis Configuration
- **Purpose**: Fetching All Notes / Caching and Full-text Search (WIP)
- **Volume Mount**: `/temp/redis`
- **Module**: RediSearch for advanced search capabilities

## 🛠️ Setup & Installation

### Prerequisites
```bash
# Required software
- Docker & Docker Compose
- Node.js v20.x
- npm or yarn
```

### Docker Setup
```bash
# Start all services
docker-compose up -d

# Rebuild containers
docker-compose up -d --build
```

## 🚀 Development

### Starting the Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Code Structure
```
/
├── connectors/
│   ├── db/            # Database configurations and schemas
│   └── cache/         # Redis configurations
├── models/            # Sequelize models
├── .env               # Configs
├── services/          # Business logic
├── routes/            # API routes
├── repositories/      # Query Layer
├── controller/        # Controller Layer
├── middlewares/       # Custom middlewares
├── utils/             # Utility Functions goes here
│    ├── logger/       # Logger Implementation
├── Dockerfile         # Docker File for Application
├── swagger.yaml       # Swagger File
└── docker-compose.yml # Docker configuration
```

## 📈 Performance Optimizations

- MySQL indexes for faster queries
- Redis caching layer
- Full-text search optimization
- Connection pooling
- Efficient data synchronization

## 🔒 Security Considerations

- User authentication required for all operations
- User-scoped data access
- Input sanitization (TODO)
- Secure environment configuration (TODO)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




<p align="center">📝 Created using a README Template</p>
<p align="center">© 2024 All Rights Reserved</p>