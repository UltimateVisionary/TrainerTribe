# TrainerTribe - Microservices and Database Architecture

## Overview

TrainerTribe is a fitness-focused social platform that connects users with trainers, enables sharing of fitness content, and fosters community engagement. This document outlines a scalable microservices architecture and database design to support the application requirements.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client Applications                         │
│                   (React Native iOS/Android Apps)                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                             API Gateway                              │
│                    (Authentication, Routing, Load Balancing)         │
└─┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬───────┘
  │         │         │         │         │         │         │
┌─▼───────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐
│  User   │ │Content│ │Message│ │Fitness│ │Support│ │Payment│ │Analytics│
│ Service │ │Service│ │Service│ │Service│ │Service│ │Service│ │Service │
└─┬───────┘ └─┬─────┘ └─┬─────┘ └─┬─────┘ └─┬─────┘ └─┬─────┘ └─┬─────┘
  │           │         │         │         │         │         │
┌─▼───────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐ ┌─▼─────┐
│User DB  │ │Content│ │Message│ │Fitness│ │Support│ │Payment│ │Analytics│
│(Postgres)│ │  DB   │ │  DB   │ │  DB   │ │  DB   │ │  DB   │ │  DB    │
└─────────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

## Microservices Architecture

### 1. User Service

**Responsibilities:**
- User registration and authentication
- User profile management
- Social connections (following/followers)
- User preferences and settings

**APIs:**
- `POST /users` - Register new user
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile
- `GET /users/{id}/followers` - Get user followers
- `GET /users/{id}/following` - Get users followed by user
- `POST /users/{id}/follow` - Follow a user
- `DELETE /users/{id}/follow` - Unfollow a user
- `GET /users/search` - Search users by criteria

**Database: User DB (PostgreSQL)**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  handle VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  bio TEXT,
  profile_image VARCHAR(255),
  is_trainer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE social_links (
  user_id INTEGER REFERENCES users(id),
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id, platform)
);

CREATE TABLE specialties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_specialties (
  user_id INTEGER REFERENCES users(id),
  specialty_id INTEGER REFERENCES specialties(id),
  PRIMARY KEY (user_id, specialty_id)
);

CREATE TABLE user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  language VARCHAR(10) DEFAULT 'en',
  dark_mode BOOLEAN DEFAULT FALSE,
  notification_settings JSONB
);

CREATE TABLE followers (
  follower_id INTEGER REFERENCES users(id),
  followed_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, followed_id)
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Content Service

**Responsibilities:**
- Creating, retrieving, updating, and deleting posts
- Content moderation
- Content discovery and recommendations

**APIs:**
- `POST /posts` - Create post
- `GET /posts/{id}` - Get specific post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `GET /posts/feed` - Get personalized feed
- `GET /posts/user/{userId}` - Get user's posts
- `POST /posts/{id}/like` - Like post
- `DELETE /posts/{id}/like` - Unlike post
- `POST /posts/{id}/comment` - Comment on post
- `GET /posts/{id}/comments` - Get post comments
- `GET /posts/trending` - Get trending content

**Database: Content DB (PostgreSQL)**
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT,
  type VARCHAR(20) NOT NULL, -- regular, premium, trainer
  visibility VARCHAR(20) NOT NULL, -- public, followers, private
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  media_url VARCHAR(255) NOT NULL,
  media_type VARCHAR(20) NOT NULL, -- image, video
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  post_count INTEGER DEFAULT 0
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
  user_id INTEGER NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE comment_likes (
  user_id INTEGER NOT NULL,
  comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);
```

### 3. Messaging Service

**Responsibilities:**
- Direct messaging between users
- Group chat management
- Message delivery and read receipts
- Message search

**APIs:**
- `POST /conversations` - Create new conversation
- `GET /conversations` - List user conversations
- `GET /conversations/{id}` - Get specific conversation
- `POST /conversations/{id}/messages` - Send message
- `GET /conversations/{id}/messages` - Get conversation messages
- `PUT /messages/{id}/read` - Mark message as read
- `POST /groups` - Create new group
- `GET /groups` - List user's groups
- `PUT /groups/{id}` - Update group details
- `POST /groups/{id}/members` - Add member to group
- `DELETE /groups/{id}/members/{userId}` - Remove group member

**Database: Messaging DB (PostgreSQL + Redis)**
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  last_message_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL,
  content TEXT,
  media_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE message_read_status (
  message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  read_at TIMESTAMP NOT NULL,
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  owner_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Redis for online status, typing indicators, and unread counts
```

### 4. Fitness Service

**Responsibilities:**
- Workout content management
- Fitness programs and challenges
- Progress tracking
- Nutrition content

**APIs:**
- `POST /workouts` - Create workout
- `GET /workouts` - List workouts
- `GET /workouts/{id}` - Get workout details
- `POST /programs` - Create fitness program
- `GET /programs` - List programs
- `GET /programs/{id}` - Get program details
- `POST /progress` - Log workout progress
- `GET /progress/user/{userId}` - Get user progress
- `GET /categories` - Get workout categories
- `GET /nutrition` - Get nutrition content

**Database: Fitness DB (PostgreSQL)**
```sql
CREATE TABLE workout_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER, -- in minutes
  difficulty VARCHAR(20), -- beginner, intermediate, advanced
  category_id INTEGER REFERENCES workout_categories(id),
  image_url VARCHAR(255),
  video_url VARCHAR(255),
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  video_url VARCHAR(255),
  instructions TEXT
);

CREATE TABLE workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  sets INTEGER,
  reps INTEGER,
  duration INTEGER, -- in seconds
  rest_time INTEGER, -- in seconds
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER, -- in days
  difficulty VARCHAR(20),
  image_url VARCHAR(255),
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE program_workouts (
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  workout_id INTEGER REFERENCES workouts(id),
  day_number INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (program_id, workout_id, day_number)
);

CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  workout_id INTEGER REFERENCES workouts(id),
  completed BOOLEAN DEFAULT FALSE,
  duration INTEGER, -- actual time taken
  rating INTEGER, -- 1-5
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE nutrition_content (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- meal plan, recipe, guide
  content JSONB,
  image_url VARCHAR(255),
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Support Service

**Responsibilities:**
- AI fitness chatbot
- Help center content
- User support tickets

**APIs:**
- `POST /chatbot/message` - Get AI response
- `GET /help` - Get help center articles
- `GET /help/{id}` - Get specific help article
- `POST /support/tickets` - Create support ticket
- `GET /support/tickets` - Get user's tickets
- `PUT /support/tickets/{id}` - Update ticket

**Database: Support DB (PostgreSQL)**
```sql
CREATE TABLE chatbot_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chatbot_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES chatbot_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE help_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE help_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES help_categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE help_article_tags (
  article_id INTEGER REFERENCES help_articles(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (article_id, tag)
);

CREATE TABLE support_tickets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL, -- open, in_progress, resolved, closed
  priority VARCHAR(20) NOT NULL, -- low, medium, high, urgent
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Payment Service

**Responsibilities:**
- Subscription management
- Payment processing
- Billing history

**APIs:**
- `POST /subscriptions` - Create subscription
- `GET /subscriptions/{id}` - Get subscription details
- `PUT /subscriptions/{id}` - Update subscription
- `DELETE /subscriptions/{id}` - Cancel subscription
- `GET /payment-methods` - Get user payment methods
- `POST /payment-methods` - Add payment method
- `GET /transactions` - Get user transactions

**Database: Payment DB (PostgreSQL)**
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  plan_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  payment_method_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  token VARCHAR(255) NOT NULL,
  last_four VARCHAR(4),
  expiry_date VARCHAR(7),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  subscription_id INTEGER REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_method_id INTEGER REFERENCES payment_methods(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Analytics Service

**Responsibilities:**
- User engagement metrics
- Creator insights
- Platform analytics

**APIs:**
- `GET /analytics/user/{userId}` - Get user analytics
- `GET /analytics/content/{contentId}` - Get content analytics
- `GET /analytics/creator/{userId}` - Get creator insights
- `GET /analytics/platform` - Get platform-wide metrics

**Database: Analytics DB (TimeseriesDB + PostgreSQL)**
```sql
-- Using TimescaleDB (PostgreSQL extension) for time-series data

CREATE TABLE user_events (
  time TIMESTAMPTZ NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  content_id VARCHAR(255),
  metadata JSONB
);
SELECT create_hypertable('user_events', 'time');

CREATE TABLE content_metrics (
  time TIMESTAMPTZ NOT NULL,
  content_id VARCHAR(255) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0
);
SELECT create_hypertable('content_metrics', 'time');

CREATE TABLE creator_metrics (
  time TIMESTAMPTZ NOT NULL,
  creator_id VARCHAR(255) NOT NULL,
  profile_views INTEGER DEFAULT 0,
  new_followers INTEGER DEFAULT 0,
  content_engagement FLOAT DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0
);
SELECT create_hypertable('creator_metrics', 'time');

CREATE TABLE platform_metrics (
  time TIMESTAMPTZ NOT NULL,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  content_created INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0
);
SELECT create_hypertable('platform_metrics', 'time');
```

## Service Communication Patterns

### Synchronous Communication
- REST APIs for direct client requests
- gRPC for internal service-to-service communication requiring immediate responses

### Asynchronous Communication
- Message queue (RabbitMQ or Kafka) for event-driven communication:
  - User actions (new post, follow, like)
  - Notifications
  - Background processing tasks

## Infrastructure Considerations

### API Gateway
- Authentication and authorization
- Request routing
- Rate limiting
- Logging and monitoring

### Caching
- Redis for high-speed data caching:
  - User sessions
  - Frequently accessed content
  - Feed data
  - Messaging status

### Search Functionality
- Elasticsearch for advanced search capabilities:
  - Content search
  - User search
  - Message search

### Media Storage
- Cloud object storage (S3 or equivalent):
  - Profile images
  - Post media (images, videos)
  - Workout videos

### CDN
- Content Delivery Network for static assets and media files

## Scaling Considerations

### Horizontal Scaling
- Stateless services designed for horizontal scaling
- Database sharding strategies for large data sets

### Vertical Partitioning
- Separate read and write operations
- Read replicas for high-read services

### Regional Deployment
- Multi-region deployment for global user base
- Data replication strategy for regional data centers

## Security Measures

### Authentication & Authorization
- JWT-based authentication
- OAuth2 for social login
- Role-based access control (RBAC)

### Data Protection
- Data encryption at rest and in transit
- PII handling in compliance with privacy regulations
- Payment data security compliant with PCI DSS

### Monitoring & Logging
- Centralized logging system
- Real-time performance monitoring
- Anomaly detection for security threats

## Development & Deployment

### CI/CD Pipeline
- Automated testing for each microservice
- Containerization using Docker
- Orchestration with Kubernetes
- Infrastructure as Code using Terraform or equivalent

### Environment Strategy
- Development, Staging, Production environments
- Feature toggles for gradual rollouts
- Canary deployments for risk minimization

## Conclusion

This architecture provides a scalable foundation for TrainerTribe's growth. The microservices approach allows for:

1. Independent scaling of components based on demand
2. Technology flexibility for each service
3. Improved fault isolation
4. Easier feature development and deployment
5. Team autonomy through service ownership

As the platform grows, additional services may be introduced or existing ones may be further decomposed to maintain manageable complexity and ensure optimal performance. 