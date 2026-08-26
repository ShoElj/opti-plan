# Opti-Plan Prototype Isolation Boundary

> ⚠️ **NON-PRODUCTION PROTOTYPE ISOLATION NOTICE**  
> Files in this directory (`src/prototype/`) contain mock visual data, seed records, and UI prototype constants used strictly for design demonstration and UI prototype testing.

### Rules:
1. **Production Code Isolation:** Production domain modules (`src/domain/`), database repositories (`src/data/`), API routes, and backend services MUST NEVER import anything from `src/prototype/`.
2. **Phase 6+ Real Engine Migration:** Real domain logic and user financial records MUST consume trusted domain services (`src/services/`) and authenticated Supabase backend data.
