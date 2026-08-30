# Backend Documentation

## 1. Backend Overview

The backend is a Spring Boot REST application for the Government Subsidy & Grant Disbursement Tracking System.

It provides APIs for:
- User registration and login
- Beneficiary applications
- Scheme and department management
- Officer management
- Document handling
- Verification workflows
- Disbursement and milestone processing
- Notifications
- Dashboard analytics
- Audit logs
- Reports
- OTP/password recovery

The backend uses a layered structure with controllers, services, repositories, entities, DTOs, and security components.

## 2. Backend Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Backend programming language/runtime target |
| Spring Boot 4.1.0 | Application framework |
| Spring Web MVC | REST API development |
| Spring Data JPA | Persistence and repository abstraction |
| Spring Security | Authentication and authorization |
| JJWT 0.12.6 | JWT creation and validation |
| MySQL Connector/J | MySQL database connectivity |
| Microsoft SQL Server JDBC | SQL Server connectivity dependency |
| Twilio SDK 12.1.1 | Twilio integration |
| Lombok | Boilerplate reduction |
| Spring Validation | Request/entity validation |
| OpenPDF | PDF report generation |
| Apache POI | Excel report generation |
| Maven Wrapper/Maven | Build and dependency management |

These technologies are confirmed from the project's `pom.xml`.

## 3. Backend Architecture

The application follows a layered REST architecture:

```text
React Frontend
      ↓
REST Controllers
      ↓
Service Layer
      ↓
Repository Layer
      ↓
JPA / Hibernate
      ↓
Relational Database
```

Cross-cutting concerns include:
- JWT authentication
- Spring Security authorization
- CORS
- Validation
- Exception handling
- Audit logging

## 4. Backend Project Structure

The main backend source is under:

```text
src/main/java/com/example/Government/subsidy/Project/
├── Controller/
├── DTO/
├── Entity/
├── Expection/
├── Repository/
├── Security/
├── Service/
└── GovernmentSubsidyProjectApplication.java
```

### Controller

REST endpoints exposed to the frontend.

### DTO

Data-transfer objects used for request/response structures such as login, scheme requests, dashboard summaries, and milestone/report data.

### Entity

JPA entities representing application/domain data.

### Repository

Spring Data repositories for database access.

### Service

Business logic and workflow processing.

### Security

JWT and Spring Security configuration.

### Expection

Custom API exception and global exception handling classes.

## 5. Configuration

The application configuration is stored under:

```text
src/main/resources/application.properties
```

It includes configuration for:
- Spring application
- Database connection
- JPA/Hibernate
- File uploads
- Twilio
- Application development-mode settings

**Sensitive values must be supplied through protected environment/local configuration and must never be committed as plaintext secrets.**

## 6. Database

The application uses JPA entities and relational database connectivity. The Maven configuration contains drivers for both MySQL and Microsoft SQL Server.

The current entity model includes:

| Entity | Purpose |
|---|---|
| `User` | Registered system user and role information |
| `Department` | Government department information |
| `Officer` | Officer assignment to a user and department |
| `Scheme` | Welfare/subsidy scheme definition |
| `SchemeCategory` | Scheme category information |
| `SchemeRequiredDocument` | Documents required for a scheme |
| `SchemeMilestone` | Scheme-level disbursement milestones |
| `Application` | Beneficiary scheme application |
| `ApplicationMilestone` | Milestone state for an application |
| `Document` | Application documents |
| `VerificationAssignment` | Officer verification assignment |
| `VerificationReview` | Verification review records |
| `PaymentTransaction` | Payment transaction information |
| `PaymentAttempt` | Payment attempt records |
| `Notification` | User notifications |
| `AuditLog` | Audit event records |
| `Otp` | OTP-related data |
| `PasswordResetVerification` | Password-reset verification data |

## 7. Entity / Model Layer

### User

The `User` entity maps to the `users` table and stores identity, contact, demographic, address, income, bank, role, status, and creation information.

Important fields include:
- `userId`
- `fullName`
- `email`
- `mobileNumber`
- `password`
- `aadhaarNumber`
- location-related fields
- `annualIncome`
- bank account information
- `role`
- `status`
- `createdAt`

The default role in the entity is `ROLE_BENEFICIARY`.

### Department

The `Department` entity maps to `departments`.

It contains:
- Department name
- Description
- Status
- Creation timestamp

It also has relationships to officers and schemes.

### Officer

The `Officer` entity maps to `officers`.

An officer:
- References one `User`
- References one `Department`
- Has a unique employee code
- Has a designation
- Has a creation timestamp

### Scheme

The `Scheme` entity maps to `schemes`.

Important fields include:
- Scheme name
- Description
- Total budget
- Budget used
- Minimum and maximum grant
- Maximum income
- Minimum eligibility score
- Application dates
- Eligibility score
- Status
- Creation timestamp

A scheme is associated with a department and the user who created it.

## 8. Repository Layer

The project contains Spring Data repositories corresponding to the domain entities, including repositories for:
- Applications
- Application milestones
- Audit logs
- Departments
- Documents
- Notifications
- Officers
- OTP/password recovery data
- Payment attempts and transactions
- Schemes and scheme-related entities
- Users
- Verification assignments and reviews

Repositories provide the persistence layer used by services.

## 9. Service Layer

Important services include:

| Service | Responsibility |
|---|---|
| `UserService` | Registration, login, user retrieval/update/delete |
| `DepartmentService` | Department CRUD |
| `OfficerService` | Officer CRUD and officer assignment data |
| `SchemeService` | Scheme CRUD |
| `ApplicationService` | Application submission, retrieval, assignment and workflow status changes |
| `EligibilityScoreService` | Income/category/document scoring and application evaluation |
| `VerificationService` | Verification assignment, review and history |
| `DisbursementService` | Milestones, finance queue, release, rejection and overdue resolution |
| `DisbursementSchedulerService` | Upcoming reminders and overdue milestone processing |
| `DocumentService` | Upload and document verification/rejection |
| `NotificationService` | Notification creation and retrieval |
| `DashboardService` | System overview and analytical summaries |
| `AuditLogService` | Audit event creation and retrieval |
| `ReportService` | PDF and Excel scheme summary reports |
| `OtpService` | Password recovery OTP workflow |
| `TwilioVerifyService` | Twilio Verify integration |
| `SchemeCategoryService` | Scheme category operations |
| `SchemeRequiredDocumentService` | Required-document configuration |
| `ApplicationService` | Application lifecycle and role-based workflow operations |

## 10. Controller Layer

The backend contains these main controllers:

| Controller | Responsibility |
|---|---|
| `UserController` | Registration, login and user management |
| `DepartmentController` | Super Admin department management |
| `OfficerController` | Super Admin officer management |
| `SchemeController` | Scheme CRUD |
| `ApplicationController` | Application lifecycle |
| `VerificationController` | Verification assignment/review |
| `DocumentController` | Document upload and verification |
| `DisbursementController` | Milestones and staged disbursement |
| `DashboardController` | Dashboard/analytics APIs |
| `AuditLogController` | Audit log retrieval |
| `NotificationController` | User notifications |
| `OtpController` | OTP/password recovery |
| `ReportController` | Reports |
| `SchemeCategoryController` | Scheme categories |
| `SchemeRequiredDocumentController` | Required scheme documents |
| `DisbursementTestController` | Development/test scheduler triggers |

## 11. REST API Documentation

### Authentication and Users

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/users/register` | Register user | Public |
| POST | `/users/login` | Authenticate user and return user response/token | Public |
| GET | `/users/all` | List users | Authenticated |
| GET | `/users/{id}` | Get user | Authenticated |
| PUT | `/users/update/{id}` | Update user | Authenticated |
| DELETE | `/users/delete/{id}` | Delete user | Authenticated |

### Super Admin Departments

| Method | Endpoint | Purpose | Authentication/Role |
|---|---|---|---|
| POST | `/superadmin/departments` | Create department | Super Admin/admin role rule |
| GET | `/superadmin/departments` | List departments | Super Admin/admin role rule |
| GET | `/superadmin/departments/{id}` | Get department | Super Admin/admin role rule |
| PUT | `/superadmin/departments/{id}` | Update department | Super Admin/admin role rule |
| DELETE | `/superadmin/departments/{id}` | Delete department | Super Admin/admin role rule |

### Super Admin Officers

| Method | Endpoint | Purpose | Authentication/Role |
|---|---|---|---|
| POST | `/superadmin/officers` | Create/assign officer | Super Admin/admin role rule |
| GET | `/superadmin/officers` | List officers | Super Admin/admin role rule |
| GET | `/superadmin/officers/{id}` | Get officer | Super Admin/admin role rule |
| PUT | `/superadmin/officers/{id}` | Update officer | Super Admin/admin role rule |
| DELETE | `/superadmin/officers/{id}` | Delete officer | Super Admin/admin role rule |

### Schemes

| Method | Endpoint | Purpose | Authentication/Role |
|---|---|---|---|
| POST | `/departmentadmin/schemes` | Create scheme | Department Admin/Super Admin/admin rule |
| GET | `/departmentadmin/schemes/all` | List schemes | Public route in current security configuration |
| GET | `/departmentadmin/schemes/{id}` | Get scheme | Public GET route in current security configuration |
| PUT | `/departmentadmin/schemes/{id}` | Update scheme | Department Admin/Super Admin/admin rule |
| DELETE | `/departmentadmin/schemes/{id}` | Delete scheme | Department Admin/Super Admin/admin rule |

### Dashboard

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| GET | `/dashboard/overview` | System overview | Department Admin, Super Admin, Finance Officer |
| GET | `/dashboard/schemes` | Scheme summary | Department Admin, Super Admin, Finance Officer |
| GET | `/dashboard/regions` | Regional summary | Department Admin, Super Admin, Verification Officer |
| GET | `/dashboard/performance` | Approval performance | Department Admin, Super Admin |

### Audit Logs

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| GET | `/audit-logs` | Get all audit logs | Super Admin, Department Admin |
| GET | `/audit-logs/entity` | Get logs for an entity | Super Admin, Department Admin |

### Reports

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| GET | `/reports/overdue` | Overdue milestone report | Department Admin, Super Admin, Verification Officer, Finance Officer |
| GET | `/reports/scheme-summary/pdf` | Download PDF scheme summary | Department Admin, Super Admin |
| GET | `/reports/scheme-summary/excel` | Download Excel scheme summary | Department Admin, Super Admin |

### Applications

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| POST | `/applications/submit` | Submit application | Authenticated/publicity depends on security configuration |
| GET | `/applications` | Get visible applications | Authenticated |
| GET | `/applications/all` | Get all applications | Authenticated |
| GET | `/applications/mine` | Get current user's applications | Authenticated |
| GET | `/applications/{id}` | Get application | Authenticated |
| GET | `/applications/search` | Search applications | Authenticated |
| PUT | `/applications/{id}/resubmit` | Resubmit application | Authenticated |
| PATCH | `/applications/{id}/assign` | Assign application | Department Admin/Super Admin |
| PATCH | `/applications/{id}/field-approve` | Field approval | Front Desk/Field Officer/Super Admin/Department Admin |
| PATCH | `/applications/{id}/field-return` | Return from field stage | Front Desk/Field Officer/Super Admin/Department Admin |
| PATCH | `/applications/{id}/field-reject` | Reject at field stage | Front Desk/Field Officer/Super Admin/Department Admin |
| PATCH | `/applications/{id}/verify-approve` | Verification approval | Verification/District Officer/Super Admin/Department Admin |
| PATCH | `/applications/{id}/verify-return` | Verification return | Verification/District Officer/Super Admin/Department Admin |
| PATCH | `/applications/{id}/verify-reject` | Verification rejection | Verification/District Officer/Super Admin/Department Admin |

### Verification

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| POST | `/verifications/{applicationId}/assign` | Assign verification | Department Admin/Super Admin |
| PATCH | `/verifications/{applicationId}/review` | Review verification | Front Desk/Verification Officer |
| GET | `/verifications/{applicationId}/history` | Verification history | Authenticated |

### Disbursement

| Method | Endpoint | Purpose | Role restriction |
|---|---|---|---|
| POST | `/disbursement/plan/{schemeId}/configure` | Configure milestone plan | Department Admin/Super Admin |
| POST | `/disbursement/schemes/{schemeId}/milestones` | Add scheme milestone | Department Admin/Super Admin |
| POST | `/disbursement/applications/{applicationId}/init` | Initialize application milestones | Department Admin/Super Admin |
| GET | `/disbursement/applications/{applicationId}` | Get application milestones | Authenticated |
| PATCH | `/disbursement/milestone/{id}/complete` | Complete milestone | Authenticated |
| GET | `/disbursement/queue` | Finance queue | Finance Officer/Finance Approver/Super Admin/Department Admin |
| POST | `/disbursement/release/{applicationMilestoneId}` | Release milestone | Finance Officer/Finance Approver/Super Admin/Department Admin |
| PATCH | `/disbursement/milestones/{id}/reject` | Reject milestone | Finance Officer/Finance Approver/Super Admin/Department Admin |
| PUT | `/disbursement/milestone/{id}/resolve` | Resolve overdue milestone | Department Admin/Super Admin |

### Documents

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/documents/upload` | Upload application document | Authenticated |
| GET | `/documents/application/{applicationId}` | Get application documents | Authenticated |
| PATCH | `/documents/{documentId}/verify` | Verify document | Authenticated |
| PATCH | `/documents/{documentId}/reject` | Reject document | Authenticated |

### Notifications

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| GET | `/notifications/user/{userId}` | Get user notifications | Authenticated |
| GET | `/notifications/user/{userId}/unread` | Get unread notifications | Authenticated |
| GET | `/notifications/user/{userId}/count` | Get unread count | Authenticated |
| PUT | `/notifications/{notificationId}/read` | Mark notification as read | Authenticated |

### OTP

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/otp/forgot-password` | Send password recovery OTP | Public |
| POST | `/otp/verify` | Verify OTP | Public |
| POST | `/otp/reset-password` | Reset password | Public |

## 12. Authentication

The backend uses a JWT-based authentication flow.

```text
Login Request
   ↓
UserService.login()
   ↓
Credentials / password validation
   ↓
JwtUtil.generateToken()
   ↓
JWT returned to frontend
   ↓
Frontend sends Bearer token
   ↓
JwtFilter validates token
   ↓
SecurityContext receives authenticated principal/authorities
   ↓
Spring Security authorization
```

The JWT contains:
- Mobile number as subject
- Role claim
- User ID claim
- Issued-at time
- Expiration time

The configured token lifetime in `JwtUtil` is 24 hours.

## 13. JWT and Security

### JwtUtil

`JwtUtil` is responsible for:
- Token generation
- Mobile number extraction
- Role extraction
- User ID extraction
- Token validation

### JwtFilter

`JwtFilter`:
1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Validates the token.
4. Extracts the mobile number and role.
5. Creates Spring Security authorities.
6. Places the authenticated principal in the security context.

The filter normalizes role strings and creates both `ROLE_...` and non-prefixed authority forms in several cases.

### SecurityConfig

The security configuration:
- Enables method-level security.
- Configures CORS.
- Disables CSRF for the stateless API.
- Uses stateless session management.
- Allows CORS preflight requests.
- Defines public routes.
- Defines role-restricted administrative routes.
- Requires authentication for protected application endpoints.

## 14. Role-Based Authorization

Roles found in the implementation include:

| Role | Confirmed usage |
|---|---|
| `ROLE_BENEFICIARY` | Default registered-user role |
| `SUPER_ADMIN` / Super Admin variants | System-level administration |
| `DEPT_ADMIN` / Department Admin variants | Department administration |
| `FRONT_DESK_OFFICER` | Front-desk application workflow |
| `FIELD_OFFICER` | Field application workflow |
| `VERIFICATION_OFFICER` | Verification workflow |
| `DISTRICT_OFFICER` | Verification/application workflow |
| `FINANCE_OFFICER` | Finance/disbursement workflow |
| `FINANCE_APPROVER` | Finance approval workflow |

The exact effective authority depends on the role value in the JWT and the normalization performed by `JwtFilter`.

## 15. Super Admin Backend

The backend provides dedicated Super Admin endpoints for department and officer management:

```text
/superadmin/departments
/superadmin/officers
```

It also provides Super Admin access to system-level dashboard analytics, audit logs, reports, application operations, verification assignments, and disbursement administration where explicitly permitted.

### Department Management

`DepartmentService` supports:
- Create
- List
- Get by ID
- Update
- Delete

### Officer Management

`OfficerService` supports:
- Create officer
- List officers
- Get officer by ID
- Update officer
- Delete officer

An officer is linked to a user and a department.

### Dashboard Analytics

`DashboardService` calculates:
- Regional summaries
- Scheme summaries
- Approval performance
- System overview

The dashboard service reads application, scheme, officer, department, and milestone repositories.

### Audit Logs

`AuditLogService` provides:
- Audit event creation
- All-log retrieval
- Entity-specific log retrieval

### Reports

`ReportService` generates:
- Scheme summary PDF
- Scheme summary Excel

## 16. Eligibility Scoring

The backend contains `EligibilityScoreService`, which evaluates applications using:
- Income score
- Category score
- Document score
- Total score

The service also evaluates applications and provides an evaluation summary.

## 17. Verification Workflow

The verification service supports:
- Assigning verification work
- Reviewing verification
- Checking assignment state
- Maintaining verification history
- Creating beneficiary notifications

Application-level workflow endpoints also support field and verification approval, return, and rejection transitions.

## 18. Disbursement and Milestones

The disbursement layer supports staged processing.

It includes:
- Scheme milestone configuration
- Application milestone initialization
- Milestone completion
- Finance queue retrieval
- Stage release
- Milestone rejection
- Overdue resolution
- Overdue reporting

`DisbursementSchedulerService` handles upcoming reminders and overdue milestone processing.

## 19. Documents and Notifications

### Documents

`DocumentService` supports:
- Uploading documents
- Retrieving documents for an application
- Verifying documents
- Rejecting documents

Uploaded files use multipart form data and the configured upload directory.

### Notifications

`NotificationService` supports:
- Creating notifications
- Retrieving all user notifications
- Retrieving unread notifications
- Counting unread notifications
- Marking notifications as read

## 20. Twilio / OTP Integration

The project includes the Twilio SDK and a `TwilioVerifyService`.

The OTP/password recovery flow is exposed through `OtpController` and delegates to `OtpService`.

Configuration is supplied through application properties/environment configuration. Sensitive Twilio values must never be included in source-control documentation.

Relevant configuration keys in the current project include:

```text
twilio.account.sid
twilio.auth.token
twilio.verify.service.sid
```

Only variable/key names should be documented; actual values must remain private.

## 21. File Uploads

`DocumentController` accepts multipart uploads through:

```text
POST /documents/upload
```

The request includes:
- Application ID
- Document type
- File

The upload directory is configured through the backend application configuration.

## 22. Validation and Exception Handling

The project uses:
- Spring Validation dependency
- Jakarta validation annotations on entities/request data
- `ApiException`
- `GlobalExceptionHandler`

The exception layer provides centralized handling for API-level errors.

## 23. CORS and Security Configuration

The current `SecurityConfig`:
- Allows configured CORS origins using an origin pattern.
- Allows GET, POST, PUT, PATCH, DELETE, and OPTIONS.
- Allows all request headers.
- Exposes the Authorization header.
- Enables credentials.
- Disables CSRF.
- Uses stateless sessions.

The configuration also has explicit role-based rules for administrative and workflow endpoints.

## 24. Environment Variables / Sensitive Configuration

The project currently references configuration values for:

| Configuration | Purpose | Sensitive? |
|---|---|---|
| `spring.datasource.url` | Database connection | Potentially sensitive |
| `spring.datasource.username` | Database user | Sensitive |
| `spring.datasource.password` | Database password | Sensitive |
| `twilio.account.sid` | Twilio account | Sensitive |
| `twilio.auth.token` | Twilio authentication | Highly sensitive |
| `twilio.verify.service.sid` | Twilio Verify service | Sensitive |
| `file.upload-dir` | File storage location | Usually non-secret |
| `app.dev-mode` | Development/test behavior | No |

**Important:** actual values must not be committed to GitHub.

The current source also contains a hard-coded JWT signing secret in `JwtUtil`. This should be moved to protected configuration/environment storage before production deployment.

## 25. Running the Backend

The project contains Maven Wrapper scripts.

From the project root on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On systems with Maven Wrapper shell support:

```bash
./mvnw spring-boot:run
```

The backend uses Java 21 according to `pom.xml`.

## 26. Testing

The Maven configuration includes Spring Boot test dependencies for:
- Spring Data JPA testing
- Spring Web MVC testing

The repository also contains a dedicated `DisbursementTestController` for development/test scheduler triggers.

API behavior can additionally be verified through manual frontend flows and REST API tools such as Postman if configured in the project.

## 27. Backend Security Considerations

### Currently Implemented

- Spring Security
- Stateless JWT authentication
- JWT request filtering
- Role-based authorization
- Method-level security
- Password hashing using BCrypt
- CORS configuration
- CSRF disabled for the stateless API
- Protected application/workflow endpoints
- Audit logging service

