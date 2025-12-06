# Jerry's Mall - E-Commerce Platform

A modern full-stack e-commerce solution built with .NET Core and React, featuring complete shopping cart functionality, secure payments, and cloud integration.

## 🚀 Features

- **Product Management** - Full CRUD operations for products with image uploads
- **Shopping Cart** - Real-time cart management with session persistence
- **Order Processing** - Complete order workflow from cart to checkout
- **Secure Payments** - Stripe integration for payment processing
- **User Authentication** - JWT-based authentication with role management
- **Cloud Storage** - AWS S3 for file storage and Cloudinary for image management
- **Responsive Design** - Modern React frontend with Material-UI components
- **Docker Support** - Containerized deployment for easy scaling

## 🛠 Technology Stack

### Backend
- **.NET 9.0** - Modern web framework
- **Entity Framework Core** - ORM with PostgreSQL
- **JWT Authentication** - Secure token-based auth
- **AutoMapper** - Object mapping
- **Stripe** - Payment processing
- **Cloudinary** - Image management
- **AWS S3** - File storage
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Stripe.js** - Payment integration

## 📁 Project Structure

```
├── Backend/                    # .NET Core API
│   ├── Controller/             # API endpoints
│   ├── Domain/                 # Business logic
│   │   ├── Entity/            # Database models
│   │   ├── DTO/               # Data transfer objects
│   │   └── VO/                # Value objects
│   ├── Service/               # Business services
│   ├── Middleware/            # Custom middleware
│   ├── Extension/             # Extension methods
│   └── Migrations/            # Database migrations
├── frontend/                   # React application
│   ├── src/
│   │   ├── app/              # Application components
│   │   └── feature/          # Feature modules
│   └── public/               # Static assets
└── JerrysMall.sln            # Solution file
```

## 🚀 Quick Start

### Prerequisites
- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend Setup
```bash
cd Backend
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Setup
```bash
# Build and run both services
docker-compose up --build
```

## ⚙️ Configuration

### Environment Variables
Create `appsettings.Development.json` in the Backend folder:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=JerrysMall;Username=postgres;Password=your_password"
  },
  "JWTSettings": {
    "TokenKey": "your_super_secret_key_at_least_32_characters_long"
  },
  "Stripe": {
    "PublishableKey": "pk_test_your_stripe_key",
    "SecretKey": "sk_test_your_stripe_key"
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  },
  "AWS": {
    "AccessKey": "your_aws_access_key",
    "SecretKey": "your_aws_secret_key",
    "Region": "your-region",
    "ServiceUrl": "http://localhost:9000"
  }
}
```

### Database Setup
```bash
cd Backend
dotnet ef database update
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:5000/swagger`
- **ReDoc**: `http://localhost:5000/swagger/docs/v1/swagger.json`

### Key Endpoints
- `GET /api/products` - List products with pagination
- `POST /api/products` - Create new product (admin only)
- `GET /api/basket` - Get user's shopping cart
- `POST /api/orders` - Create new order
- `POST /api/payments` - Process payment

## 🧪 Testing

### Backend Tests
```bash
cd Backend
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Deployment
1. Configure production environment variables
2. Build the application:
   ```bash
   dotnet publish -c Release
   cd ../frontend
   npm run build
   ```
3. Use Docker for containerized deployment:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-Specific Considerations
- **Development**: Uses local PostgreSQL and development settings
- **Production**: Supports Fly.io deployment with PostgreSQL integration
- **Docker**: Multi-stage builds for optimized images

---

**Built with ❤️ by Karigen**
