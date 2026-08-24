Preparation Checklist

Phase 1: Initial Setup & Backend Foundation
- Set up Vite + React project
- Set up FastAPI backend with organized project structure
- Configure SQLite database with SQLAlchemy models
- Implement authentication (register, login, JWT handling)
- Seed database with a test barista account

Phase 2: Backend API Development
- Develop customer endpoints: dashboard, QR, history
- Develop barista endpoints: customer lookup, add/redeem point, history
- Implement business logic: point calculation & reward threshold validation
- Add QR code generation functionality (using qrcode library)

Phase 3: Customer-Facing Frontend
- Integrate React Router with role-based layouts
- Build Login & Register pages
- Develop Customer Dashboard with progress bar feature
- Implement QR Code display page
- Create Reward History page

Phase 4: Barista-Facing Frontend
- Implement Barista Login page
- Integrate QR Scanner (with html5-qrcode or react-qr-reader)
- Develop Customer Detail page with add point / redeem actions
- Build Transaction History page

Phase 5: Polish & Final Integration
- Apply UI styling for clean & mobile-friendly experience
- Conduct end-to-end flow testing
- Enhance error handling & cover edge cases
- Seed demo data for demo/presentation

Key Technologies & Libraries

Backend (Python):
- fastapi (web framework)
- uvicorn (ASGI server)
- sqlalchemy (ORM)
- python-jose (JWT tokens)
- passlib[bcrypt] (password hashing)
- qrcode (QR code generation)
- pydantic (data validation)

Frontend (React):
- react-router-dom (routing)
- axios (HTTP client)
- html5-qrcode (camera QR scanning)
- lucide-react (lightweight icons)