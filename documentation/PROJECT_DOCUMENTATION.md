# Jewelry E-Commerce Platform - Detailed Project Documentation

## Document Control
- Project Name: Jewelry E-Commerce Platform
- Repository Root: E-Commerce_Website
- Prepared On: 2026-05-30
- Version: 1.0
- Prepared For: Academic/Project Submission and Engineering Reference

## Table of Contents with Page Mapping

The page mapping below follows the exact requested format. When exporting this markdown to PDF/Word, use this mapping as the target pagination plan.

| Topic | Page No |
|---|---|
| 1 INTRODUCTION & OVERVIEW | 1 - 7 |
| 1.1 Introduction | 1 |
| 1.2 Company Profile | 2 |
| 1.3 Problem Definition | 3 - 4 |
| 1.4 Existing System and Need for the System | 5 |
| 1.5 Proposed System and Objectives | 6 |
| 1.6 Scope of the Work | 7 |
| 2 SYSTEM REQUIREMENTS & FEASIBILITY | 8 - 12 |
| 2.1 Feasibility Study | 8 - 9 |
| 2.1.1 Technical Feasibility | 8 |
| 2.1.2 Economical Feasibility | 9 |
| 2.1.3 Operational Feasibility | 9 |
| 2.2 Hardware & Software Requirement Specification | 10 |
| 2.3 Technology Stack & Operating Environment | 11 - 12 |
| 3 SYSTEM ANALYSIS & DESIGN | 13 - 35 |
| 3.1 System Architecture Diagram | 13 - 14 |
| 3.2 Entity-Relationship (E-R) Diagram | 15 |
| 3.3 UML Diagrams | 16 - 26 |
| 3.3.1 Class Diagram | 16 |
| 3.3.2 Object Diagram | 17 |
| 3.3.3 Use-Case Diagram | 18 |
| 3.3.4 Sequence Diagram | 19 - 22 |
| 3.3.5 Activity Diagram | 23 |
| 3.3.6 Collaboration Diagram | 24 |
| 3.3.7 Components Diagram | 25 |
| 3.3.8 Deployment Diagram | 26 |
| 3.4 Normalized Database Design & Data Dictionary | 27 - 35 |
| 4 SYSTEM IMPLEMENTATION & INTERFACE | 36 - 60 |
| 4.1 Core Modules Description | 36 - 37 |
| 4.2 Security Implementation | 38 - 39 |
| 4.3 User Interface Design | 40 - 60 |
| 5 TESTING & DEPLOYMENT | 61 - 66 |
| 5.1 Testing Strategy & Implementation Plan | 61 - 62 |
| 5.2 Test Cases | 63 - 64 |
| 5.3 Deployment Setup | 65 - 66 |
| 6 PROJECT WRAP-UP | 67 - 69 |
| 6.1 Drawbacks and Limitations | 67 |
| 6.2 Proposed Enhancements (Future Scope) | 68 |
| 6.3 Conclusion | 69 |
| 7 BIBLIOGRAPHY & REFERENCE | 70+ |

---

## 1 INTRODUCTION & OVERVIEW (Page 1 - 7)

### 1.1 Introduction (Page 1)
The Jewelry E-Commerce Platform is a full-stack web application developed to digitalize jewelry retail operations. It enables customers to discover products, manage a cart, place orders, and complete payments, while providing an administrative panel for business operations such as product, order, category, coupon, user, and analytics management.

The system follows a layered architecture:
- Frontend: React + Vite single-page application (SPA).
- Backend: Spring Boot REST API.
- Database: MySQL relational schema.
- Integrations: Razorpay payment gateway, Cloudinary media hosting, SMTP email, Google OAuth2.

Key value delivered:
- Better customer shopping experience with responsive UI and filtered catalog.
- Centralized order lifecycle tracking.
- Strong role-based access (USER and ADMIN).
- Extensible service-oriented backend design.

### 1.2 Company Profile (Page 2)
For report purposes, the solution is positioned for a jewelry retail business that wants to transition from manual/semi-manual sales management to a digital omnichannel model.

Business profile characteristics:
- Domain: Fashion and fine jewelry retail.
- Sales channels: Web storefront and admin-operated internal dashboard.
- Primary stakeholders:
  - End customers (B2C buyers).
  - Catalog managers and operations team.
  - Business admins and decision makers.

Operational goals:
- Increase sales conversion through online visibility.
- Reduce manual entry and stock/order mistakes.
- Improve business insight using dashboard analytics.

### 1.3 Problem Definition (Page 3 - 4)
Traditional jewelry store operations face recurring issues:

1. Product catalog fragmentation
- Product details are spread across spreadsheets/messages.
- Inconsistent naming, pricing, and image quality.

2. Manual cart and order handling
- No reliable cart persistence.
- Manual order tracking causes delays and status mismatch.

3. Inventory visibility gaps
- Stock updates are delayed or manual.
- Over-selling risk for limited jewelry items.

4. Customer account and trust concerns
- Weak identity verification and security controls.
- Lack of secure, role-based access for staff/admin.

5. Marketing and discount management inefficiency
- Coupon handling done outside primary system.
- No structured usage checks and expiry enforcement.

6. Limited decision intelligence
- Low visibility into sales patterns, popular products, and customer behavior.

Problem statement:
Design and implement a scalable, secure, and user-friendly full-stack e-commerce solution for jewelry retail that supports complete customer and admin workflows from discovery to payment and post-order management.

### 1.4 Existing System and Need for the System (Page 5)
Existing system (typical baseline):
- Static listing pages or social media catalogs.
- Manual order confirmation through calls/chats.
- No unified audit trail for customer activity.

Why a new system is required:
- To unify catalog, users, cart, orders, payments, and admin tasks.
- To maintain data consistency through relational integrity.
- To enforce security (JWT, password hashing, role rules).
- To improve deployment agility (Vercel + Render + managed DB).

### 1.5 Proposed System and Objectives (Page 6)
Proposed system:
A distributed web solution with a modern frontend, stateless JWT-secured backend APIs, and normalized MySQL database.

Primary objectives:
- Build a reliable product discovery and purchase flow.
- Implement role-based admin workflows for operations.
- Support payment processing with verification.
- Provide extensible architecture for future modules.
- Keep deployment cloud-ready and CI/CD-friendly.

Measurable targets:
- Fast page/API response under standard load.
- Reduced order lifecycle errors through automation.
- Improved operational visibility via analytics endpoints.

### 1.6 Scope of the Work (Page 7)
In-scope:
- Authentication, registration, OAuth login, email verification.
- Product/category browsing, search, filtering.
- Cart, coupon apply, order placement, payment records.
- User profile, addresses, wishlist, reviews.
- Admin panel: products, categories, orders, users, coupons, analytics, payments.
- Cloud deployment configurations and environment-driven setup.

Out-of-scope (current phase):
- Marketplace multi-vendor model.
- Native Android/iOS mobile apps.
- Advanced recommendation engine.
- Full ERP integration.

---

## 2 SYSTEM REQUIREMENTS & FEASIBILITY (Page 8 - 12)

### 2.1 Feasibility Study (Page 8 - 9)

#### 2.1.1 Technical Feasibility (Page 8)
Assessment:
- Frontend stack (React + Vite) is mature and suitable for SPA e-commerce UIs.
- Backend stack (Spring Boot + JPA + Security) supports enterprise patterns and clear modularity.
- MySQL schema supports transactional workloads and relational consistency.
- Integrations (Razorpay, Cloudinary, OAuth, SMTP) are standard and well-supported.

Risk control points:
- Environment variable management for secrets.
- CORS alignment between frontend and backend domains.
- Proper token and session handling in cross-origin deployments.

Conclusion: Technically feasible with available frameworks and proven cloud patterns.

#### 2.1.2 Economical Feasibility (Page 9)
Cost structure:
- Initial development using open-source frameworks reduces license cost.
- Hosting can begin on cost-efficient plans (Vercel, Render, Railway/managed MySQL).
- Maintenance cost remains moderate due to standardized tooling.

Business benefit:
- Reduced manual effort in order and inventory operations.
- Better conversion via always-on online storefront.
- Improved reporting and quicker decisions from analytics.

Conclusion: Economically viable, especially for SMB-scale deployment.

#### 2.1.3 Operational Feasibility (Page 9)
Operational fit:
- UI supports both customer and admin workflows with route protection.
- CRUD-heavy admin tasks map well to existing store operations.
- Logging and audit-related structures improve accountability.

Adoption factors:
- Minimal user training required for customer workflows.
- Admin modules are grouped by business function for easy onboarding.

Conclusion: Operationally feasible and practical for day-to-day retail management.

### 2.2 Hardware & Software Requirement Specification (Page 10)
Minimum development environment:
- CPU: 4-core processor.
- RAM: 8 GB (16 GB recommended for smoother concurrent backend/frontend/database use).
- Storage: 20 GB free.
- OS: Windows 10/11, Linux, or macOS.

Backend requirements:
- Java 17+
- Maven 3.6+
- MySQL 8+

Frontend requirements:
- Node.js 18+
- npm 9+
- Modern browser (Chrome/Edge/Firefox)

Production environment:
- Frontend hosting via CDN (Vercel).
- Backend container/service runtime (Render).
- Managed MySQL with backup and SSL.

### 2.3 Technology Stack & Operating Environment (Page 11 - 12)
Backend stack:
- Spring Boot 3.2.2
- Spring Security
- Spring Data JPA (Hibernate)
- JWT (jjwt)
- ModelMapper
- SpringDoc OpenAPI
- Thymeleaf + Spring Mail
- Razorpay Java SDK
- Cloudinary SDK

Frontend stack:
- React 18
- Vite 7
- React Router 6
- Axios
- Ant Design
- Tailwind CSS
- Recharts
- React Hook Form
- Toast and motion libraries

Operating environment model:
- Local development:
  - Frontend: localhost:5173
  - Backend: localhost:8080
  - DB: local or cloud-hosted MySQL
- Production:
  - Frontend on Vercel
  - Backend on Render
  - MySQL managed cloud instance

---

## 3 SYSTEM ANALYSIS & DESIGN (Page 13 - 35)

### 3.1 System Architecture Diagram (Page 13 - 14)

See the detailed diagram file: [documentation/diagrams/system-architecture.md](documentation/diagrams/system-architecture.md)

Architecture notes:
- Browser consumes SPA assets from CDN and calls backend APIs.
- Backend is mostly stateless with JWT-driven authorization.
- Persistent state is stored in relational DB.
- External services handle payment, media, and communication.

erDiagram
### 3.2 Entity-Relationship (E-R) Diagram (Page 15)

See the ER diagram: [documentation/diagrams/er-diagram.md](documentation/diagrams/er-diagram.md)

### 3.3 UML Diagrams (Page 16 - 26)

The UML and sequence diagrams are split into individual files for clarity. See the diagrams folder for each diagram:

- Class Diagram: [documentation/diagrams/uml-class.md](documentation/diagrams/uml-class.md)
- Object Diagram: [documentation/diagrams/uml-object.md](documentation/diagrams/uml-object.md)
- Use-Case Diagram: [documentation/diagrams/use-case.md](documentation/diagrams/use-case.md)
- Sequence Diagrams:
  - Login flow: [documentation/diagrams/sequence-login.md](documentation/diagrams/sequence-login.md)
  - Cart→Order flow: [documentation/diagrams/sequence-cart-order.md](documentation/diagrams/sequence-cart-order.md)
  - Payment verification: [documentation/diagrams/sequence-payment.md](documentation/diagrams/sequence-payment.md)
- Activity Diagram: [documentation/diagrams/activity-diagram.md](documentation/diagrams/activity-diagram.md)
- Collaboration Diagram: [documentation/diagrams/collaboration.md](documentation/diagrams/collaboration.md)
- Components Diagram: [documentation/diagrams/components.md](documentation/diagrams/components.md)
- Deployment Diagram: [documentation/diagrams/deployment.md](documentation/diagrams/deployment.md)

### 3.4 Normalized Database Design & Data Dictionary (Page 27 - 35)

#### 3.4.1 Database Analysis Summary
The SQL dump contains 25 tables:
- activity_logs
- addresses
- cart
- cart_items
- categories
- contact_messages
- coupon_usage
- coupons
- email_verification_tokens
- inventory_logs
- newsletter_subscribers
- notifications
- order_items
- order_tracking
- orders
- password_reset_tokens
- payments
- product_images
- product_questions
- product_variants
- products
- returns
- reviews
- user_sessions
- users
- wishlist

Active domain entities implemented in backend JPA model include 17 core entities (users, products, orders, payment, cart, wishlist, etc.). The remaining tables indicate extension-ready design for CRM, notifications, returns, and operational logs.

#### 3.4.2 Normalization Review
1NF compliance:
- Atomic fields are maintained in primary tables.
- Repeating groups are separated (order_items, cart_items, product_images).

2NF compliance:
- Non-key attributes in line-item tables depend on full key context.
- Entity attributes are functionally tied to their table identity.

3NF compliance:
- Category, user, product, order, and payment information is separated to avoid transitive dependency.
- Linking tables (wishlist, cart_items, order_items) reduce redundancy.

Practical denormalization decisions:
- orders.address_snapshot stores JSON-like text for immutable historical shipping data.
- products contains SEO and merchandising attributes for query efficiency.

#### 3.4.3 Data Dictionary (Core and Extended)

| Table | Primary Key | Important Columns | Foreign Keys | Purpose |
|---|---|---|---|---|
| users | id | full_name, email, password, role, email_verified, provider | - | User identity and account control |
| addresses | id | full_name, phone, address_line1, city, state, postal_code | user_id -> users.id | Saved delivery addresses |
| categories | id | name, description, parent_id | parent_id -> categories.id | Product grouping hierarchy |
| products | id | name, sku, price, discount_price, stock_quantity, is_active | category_id -> categories.id | Catalog master records |
| product_images | id | image_url, is_primary, uploaded_at | product_id -> products.id | Product media records |
| product_variants | id | variant_name, additional_price, stock_quantity | product_id -> products.id | Variant-level options |
| cart | id | created_at, updated_at | user_id -> users.id (unique) | Customer cart header |
| cart_items | id | quantity | cart_id -> cart.id, product_id -> products.id, variant_id -> product_variants.id | Cart line items |
| coupons | id | code, discount_type, discount_value, min_order_amount, expiry_date | - | Promotional discounts |
| coupon_usage | id | used_at | coupon_id, user_id, order_id | Coupon redemption tracking |
| orders | id | order_number, total_amount, final_amount, payment_method, order_status | user_id -> users.id | Order header and lifecycle |
| order_items | id | quantity, price | order_id -> orders.id, product_id -> products.id, variant_id -> product_variants.id | Order lines |
| payments | id | amount, payment_gateway, transaction_id, status | order_id -> orders.id | Payment transaction details |
| reviews | id | rating, comment, created_at | product_id -> products.id, user_id -> users.id | Product review/rating |
| wishlist | id | created_at | product_id -> products.id, user_id -> users.id | Saved products |
| activity_logs | id | activity_type, description, status, created_at | user_id -> users.id | Audit/activity timeline |
| password_reset_tokens | id | token, expires_at, used | user_id -> users.id | Password recovery |
| email_verification_tokens | id | token, expires_at, used | user_id -> users.id | Email verification |
| contact_messages | id | name, email, subject, message | - | Contact/support submissions |
| newsletter_subscribers | id | email, subscribed_at | - | Marketing subscription |
| notifications | id | title, message, is_read, created_at | user_id (logical) | User notifications |
| order_tracking | id | status, remarks, created_at | order_id -> orders.id | Detailed tracking events |
| returns | id | reason, status, refund_amount, created_at | order_id (logical) | Return/refund workflow |
| inventory_logs | id | product_id, old_stock, new_stock, reason | product_id (logical) | Stock adjustment auditing |
| user_sessions | id | token, login_time, logout_time, device, ip_address | user_id (logical) | Session history |
| product_questions | id | question, answer, created_at | product_id, user_id (logical) | Q&A interactions |

Indexes and constraints highlights:
- Unique constraints on users.email, products.sku, orders.order_number, coupons.code.
- Performance indexes on orders(user_id, order_status), products(category_id), reviews(product_id), cart(user_id).
- Foreign keys enforce integrity across transactional records.

---

## 4 SYSTEM IMPLEMENTATION & INTERFACE (Page 36 - 60)

### 4.1 Core Modules Description (Page 36 - 37)

1. Authentication and Identity Module
- Registration, login, JWT issuance, current-user endpoint.
- OAuth2 login integration with Google.
- Email verification and password reset token lifecycle.

2. Catalog and Product Module
- Categories and products CRUD.
- Product images and variant support.
- Search/filter/featured presentation support.

3. Cart and Checkout Module
- Add/update/remove cart items.
- Quantity and stock validations.
- Coupon application and final amount calculation.

4. Order and Payment Module
- Order placement with order-item creation.
- Payment record creation and verification (UPI/COD workflows).
- Status updates for order and payment lifecycles.

5. Customer Engagement Module
- Wishlist management.
- Product reviews and ratings.
- Contact/newsletter extension support in schema.

6. Admin and Analytics Module
- Admin role-gated endpoints.
- User/product/order/coupon administration.
- Dashboard analytics endpoints for business metrics.

7. Activity Logging Module
- Tracks customer actions such as add-to-cart and purchase.
- Supports audit and behavior analysis.

### 4.2 Security Implementation (Page 38 - 39)

Implemented security controls:
- Password hashing using BCrypt.
- JWT bearer authentication via request filter.
- Spring Security role-based route authorization.
- Method-level security support enabled.
- CORS policy with allowed origins and credentials.
- Authentication entry point for unauthorized access handling.

Authorization model:
- Public routes: auth bootstrap, categories/products read, Swagger docs, selected review reads.
- User routes: cart, orders, wishlist, payment, profile-related operations.
- Admin routes: all /api/admin/** endpoints restricted to ADMIN.

Frontend security behavior:
- Axios interceptor attaches bearer token.
- Automatic logout/redirect on unauthorized responses for protected calls.
- Route guards:
  - ProtectedRoute for authenticated users.
  - AdminRoute for ADMIN role checks.

Security recommendations for hardening:
- Enforce strong JWT secret rotation strategy.
- Move debug-level security logs to INFO/WARN in production.
- Add brute-force/rate-limiting for auth endpoints.
- Implement refresh-token strategy and token revocation list if required at scale.

### 4.3 User Interface Design (Page 40 - 60)

UI architecture summary:
- Main customer pages under frontend/src/pages.
- Admin dashboard pages under frontend/src/admin/pages.
- Shared reusable components under frontend/src/components/common.
- Context providers handle global theme and authentication state.

Customer-facing UI flows:
1. Home/Landing
- Hero and highlighted sections.
- Product highlights and navigation links.

2. Shop and Product Detail
- Product listing with filters/search.
- Product detail page with image and descriptive information.

3. Authentication and Account
- Login, register, forgot/reset password.
- Email verification and OAuth callback screens.
- Account page for profile/order views.

4. Cart and Checkout
- Cart quantity adjustments, remove items.
- Address and payment method selection at checkout.

5. Auxiliary pages
- About, contact, wishlist.

Admin UI modules:
- Dashboard
- Products
- Categories
- Orders
- Users
- Coupons
- Analytics
- Payments
- Profile
- Settings
- Discount Management

Design principles observed:
- Component reuse for consistency.
- Route-based access segregation.
- Responsive layout with utility-first styling + component library usage.
- Loading and feedback states for async interactions.

---

## 5 TESTING & DEPLOYMENT (Page 61 - 66)

### 5.1 Testing Strategy & Implementation Plan (Page 61 - 62)

Testing levels:
1. Unit testing
- Backend service methods (business rules, calculations).
- Utility and mapper validation.

2. Integration testing
- Controller + service + repository API flow.
- Security and authorization behavior.
- Database transaction integrity.

3. End-to-end testing
- User journey: register/login -> browse -> cart -> checkout -> payment.
- Admin journey: login -> manage products/orders/users.

4. Non-functional testing
- Performance baselines for high-traffic endpoints.
- Security regression checks (auth bypass, role escalation attempts).

Implementation plan:
- Build smoke tests for health and critical APIs first.
- Add regression suite for cart/order/payment paths.
- Add UI journey tests for core pages and route guards.
- Track defects by severity and re-run full regression before release.

### 5.2 Test Cases (Page 63 - 64)

| TC ID | Module | Test Scenario | Expected Result |
|---|---|---|---|
| TC-01 | Auth | Login with valid credentials | JWT issued, user session established |
| TC-02 | Auth | Login with invalid password | 401/validation error |
| TC-03 | Product | Fetch products list | Paginated product data returned |
| TC-04 | Cart | Add product with available stock | Item added to cart |
| TC-05 | Cart | Add product beyond stock | Validation error shown |
| TC-06 | Cart | Update cart quantity | Quantity and totals updated |
| TC-07 | Checkout | Place COD order | Order + payment(PENDING) created |
| TC-08 | Payment | Verify UPI payment success | Payment SUCCESS, order payment status updated |
| TC-09 | Wishlist | Add product to wishlist | Wishlist item created |
| TC-10 | Review | Add product review | Review persisted and retrievable |
| TC-11 | Admin | Non-admin accesses /api/admin/* | Access denied |
| TC-12 | Coupon | Apply valid coupon | Discount applied to order amount |
| TC-13 | Address | Add/update address | Address stored under user |
| TC-14 | Security | Request protected endpoint without token | Unauthorized response |
| TC-15 | Analytics | Admin summary endpoint | Valid aggregate metrics returned |

### 5.3 Deployment Setup (Page 65 - 66)

Deployment topology:
- Frontend deployed to Vercel.
- Backend deployed to Render (Docker-compatible Spring Boot service).
- Database deployed on managed MySQL service.

Deployment checklist:
1. Backend
- Set environment variables:
  - DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD
  - JWT_SECRET
  - CORS_ALLOWED_ORIGINS
  - RAZORPAY keys
  - MAIL and OAuth credentials
  - CLOUDINARY credentials
- Ensure health endpoint is reachable.

2. Frontend
- Set VITE_API_URL to deployed backend /api base.
- Build and verify route fallback behavior for SPA deployment.

3. Database
- Import schema and baseline data where required.
- Validate foreign key consistency and index presence.

4. Post-deployment verification
- Auth flow (including OAuth callback).
- Cart to order to payment flow.
- Admin operations and analytics.

---

## 6 PROJECT WRAP-UP (Page 67 - 69)

### 6.1 Drawbacks and Limitations (Page 67)
Current limitations observed:
- Some schema tables are present but not fully wired into active domain services (for example returns, notifications, product_questions workflows).
- Centralized observability can be improved with structured metrics and tracing.
- Limited explicit automated test assets visible in repository snapshot.
- Token lifecycle can be further strengthened with refresh-token and revocation models.

### 6.2 Proposed Enhancements (Future Scope) (Page 68)
Recommended roadmap:
1. Add comprehensive automated test suites (unit + integration + E2E).
2. Implement event-driven notifications and order tracking timeline UI.
3. Introduce Redis caching for product/category/search hot paths.
4. Expand payment providers and refund automation.
5. Add recommendation and personalization engine.
6. Implement inventory reservation and concurrency guards for high-demand drops.
7. Add centralized monitoring (OpenTelemetry + dashboards + alerts).

### 6.3 Conclusion (Page 69)
The Jewelry E-Commerce Platform demonstrates a strong full-stack implementation for modern retail operations. It combines a responsive React frontend, secure Spring Boot backend, and normalized relational data model with essential integrations for payment, media, and communication. The project is deployable, extensible, and functionally aligned with real-world e-commerce business requirements.

---

## 7 BIBLIOGRAPHY & REFERENCE (Detailed)

### 7.1 Framework and Platform References
1. Spring Boot Official Documentation
- https://docs.spring.io/spring-boot/docs/current/reference/html/

2. Spring Security Reference
- https://docs.spring.io/spring-security/reference/

3. Spring Data JPA Reference
- https://docs.spring.io/spring-data/jpa/reference/

4. Hibernate ORM User Guide
- https://docs.jboss.org/hibernate/orm/current/userguide/html_single/

5. React Official Documentation
- https://react.dev/

6. Vite Documentation
- https://vite.dev/guide/

7. React Router Documentation
- https://reactrouter.com/

8. Axios Documentation
- https://axios-http.com/docs/intro

9. Tailwind CSS Documentation
- https://tailwindcss.com/docs

10. Ant Design Documentation
- https://ant.design/docs/react/introduce

### 7.2 Integration and Infrastructure References
11. Razorpay API Documentation
- https://razorpay.com/docs/api/

12. Cloudinary Documentation
- https://cloudinary.com/documentation

13. Google OAuth2 Documentation
- https://developers.google.com/identity/protocols/oauth2

14. MySQL 8.0 Reference Manual
- https://dev.mysql.com/doc/refman/8.0/en/

15. Maven Documentation
- https://maven.apache.org/guides/

16. Render Deployment Docs
- https://render.com/docs

17. Vercel Deployment Docs
- https://vercel.com/docs

### 7.3 Software Engineering and Design References
18. Sommerville, Ian. Software Engineering. Pearson.
19. Pressman, Roger S. Software Engineering: A Practitioner’s Approach. McGraw-Hill.
20. Fowler, Martin. Patterns of Enterprise Application Architecture. Addison-Wesley.
21. Gamma et al. Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.

### 7.4 Project-Specific Source Artifacts
22. Project README and architecture notes in repository root.
23. Backend source modules under backend/src/main/java/com/jewelryshop.
24. Frontend module structure under frontend/src.
25. Database schema dump in Database/final.sql.

---

## Appendix A - Quick Command Reference

```powershell
# Start both applications from project root
.\start-all.ps1

# Start backend only
cd backend
mvn spring-boot:run

# Start frontend only
cd frontend
npm install
npm run dev
```

## Appendix B - Recommended Submission Packaging
- Export this markdown to PDF to enforce exact page numbering.
- Insert institutional title page and certificate pages before Chapter 1 if required.
- Attach SQL schema and API screenshots as annexures.
