# Collaboration Diagram

```mermaid
flowchart LR
    FE[Frontend Components] --> AUTH[AuthContext]
    FE --> API[apiClient]
    API --> CTRL[Spring Controllers]
    CTRL --> SRV[Service Implementations]
    SRV --> REPO[Repository Layer]
    REPO --> MYSQL[(MySQL)]
    SRV --> EXT1[Razorpay]
    SRV --> EXT2[Cloudinary]
    SRV --> EXT3[Email Service]
```
