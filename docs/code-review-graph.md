# Code Review Graph — Sun Pyramids Tours (sun-front)

> Generated: 2026-04-27
> Framework: Nuxt 3 (Vue 3, SSR)
> Purpose: AI-assisted code review dependency mapping

---

## 1. High-Level Architecture

```mermaid
graph TD
  subgraph "Nuxt App Root"
    APP["app.vue"]
    ERR["error.vue"]
  end

  subgraph "Layouts"
    L_DEFAULT["layouts/default.vue<br/>(Header, Footer, ChairIcon, WhatsApp)"]
    L_AUTH["layouts/auth.vue<br/>(minimal auth shell)"]
  end

  subgraph "Global Middleware"
    MW_AUTH["middleware/auth.global.js<br/>(token guard, social-login, /profile redirect)"]
    MW_SLASH["middleware/trailing-slash.global.js<br/>(301 normalize)"]
    MW_SRSLTID["middleware/removeSrsltid.global.js"]
  end

  subgraph "Server Middleware"
    SRV_REDIRECT["server/middleware/redirect-http-protocol.ts<br/>(www. strip, lowercase)"]
  end

  APP --> L_DEFAULT
  APP --> L_AUTH
  MW_AUTH -->|guards| PAGES_PROFILE["/profile/*"]
  MW_SLASH -->|redirects| PAGES_ALL["All Pages"]
  MW_SRSLTID -->|cleans| PAGES_ALL
  SRV_REDIRECT -->|server-side| PAGES_ALL

  L_DEFAULT --> PAGES_PUBLIC["Public Pages"]
  L_AUTH --> PAGES_AUTH["Auth Pages"]
```

---

## 2. Page → Section Component Mapping

```mermaid
graph LR
  subgraph "Home /index"
    P_HOME["pages/index.vue"]
    C_HOME_BANNER["HomeMainBanner"]
    C_HOME_POPULAR["HomePopularDistnation"]
    C_HOME_TRIP["LazyHomeMakeYourTrip"]
    C_HOME_OFFERS["LazyHomeSpecialOffers"]
    C_HOME_STEPS["LazyHomeBookingSteps"]
    C_HOME_HIGHLIGHTS["LazyHomeHighlights"]
    C_HOME_BLOGS["LazyHomeTravelBlogs"]
    C_HOME_CERT["LazyHomeCertificationOverview"]
    C_HOME_GALLERY["LazyHomeGallary"]
    C_HOME_FAQ["LazyHomeFrequentlyAsked"]
    C_HOME_HELP["LazyHomeNeedHelp"]
    C_HOME_PARTNERS["LazyHomeParteners"]
    C_BOTTOM["SharedBottomBar"]

    P_HOME --> C_HOME_BANNER
    P_HOME --> C_HOME_POPULAR
    P_HOME --> C_HOME_TRIP
    P_HOME --> C_HOME_OFFERS
    P_HOME --> C_HOME_STEPS
    P_HOME --> C_HOME_HIGHLIGHTS
    P_HOME --> C_HOME_BLOGS
    P_HOME --> C_HOME_CERT
    P_HOME --> C_HOME_GALLERY
    P_HOME --> C_HOME_FAQ
    P_HOME --> C_HOME_HELP
    P_HOME --> C_HOME_PARTNERS
    P_HOME --> C_BOTTOM
  end

  subgraph "Auth Pages"
    P_SIGNIN["pages/auth/sign-in.vue"]
    P_SIGNUP["pages/auth/sign-up.vue"]
    P_FORGET["pages/auth/forget-password.vue"]
    P_RESET["pages/auth/reset-password.vue"]
    P_CONFIRM["pages/auth/confirm-code.vue"]
    P_CREATE["pages/auth/create-password.vue"]

    P_SIGNIN --> C_SIGNIN["AuthSignIn"]
    P_SIGNUP --> C_SIGNUP["AuthSignUp"]
    P_FORGET --> C_FORGET["AuthForgetPassword"]
    P_RESET --> C_RESET["AuthResetPassword"]
    P_CONFIRM --> C_CONFIRM["AuthConfirmCode"]
    P_CREATE --> C_CREATE["AuthCreatePassword"]
  end

  subgraph "Tour Detail /tour/:id"
    P_TOUR["pages/tour/[id].vue"]
    C_TOURS["Tours"]
    C_BREADCRUMB["SharedBreadcrumb"]
    C_ERROR["SharedError"]
    P_TOUR --> C_BREADCRUMB
    P_TOUR --> C_TOURS
    P_TOUR --> C_ERROR
  end

  subgraph "Cart & Checkout"
    P_CART["pages/cart/index.vue"]
    P_CHECKOUT["pages/cart/checkout.vue"]
    C_CART["Cart"]
    C_CHECKOUT["Checkout"]
    C_BREADCRUMB2["SharedBreadcrumb"]
    P_CART --> C_CART
    P_CHECKOUT --> C_BREADCRUMB2
    P_CHECKOUT --> C_CHECKOUT
  end
```

---

## 3. Component Hierarchy — Cart / Checkout (Critical Path)

```mermaid
graph TD
  subgraph "Cart Flow"
    PAGE_CART["pages/cart/index.vue"] --> CART_INDEX["Cart/index.vue"]
    CART_INDEX --> CART_STEP["Cart/steps/Cart/index.vue"]
    CART_STEP --> CART_CARD["Cart/steps/Cart/Card.vue"]
    CART_STEP --> CART_EDIT["Cart/steps/Cart/Edit.vue"]
    CART_STEP --> CART_RENT["Cart/steps/Cart/rentCard.vue"]

    PAGE_CHECKOUT["pages/cart/checkout.vue"] --> CHECKOUT_INDEX["Checkout/index.vue"]
    CHECKOUT_INDEX --> CHECKOUT_BILLING["Checkout/steps/Billing.vue"]
    CHECKOUT_INDEX --> CHECKOUT_PAYMENT["Checkout/steps/Paymet.vue"]
    CHECKOUT_INDEX --> CHECKOUT_SUMMARY["Checkout/summary.vue"]
  end

  subgraph "Shared UI in Cart/Checkout"
    CART_CARD --> UI_BUTTON["UIButton"]
    CART_CARD --> UI_COUNTER["UICounter"]
    CART_EDIT --> UI_TEXT["UIText"]
    CART_EDIT --> UI_SELECT["UISelect"]
    CART_EDIT --> UI_DATE["UIDate"]
    CHECKOUT_BILLING --> UI_TEXT
    CHECKOUT_BILLING --> UI_PHONE["UIPhone"]
    CHECKOUT_BILLING --> UI_SELECT
    CHECKOUT_BILLING --> UI_TEXTEREA["UITexterea"]
    CHECKOUT_BILLING --> UI_BUTTON
    CHECKOUT_PAYMENT --> UI_BUTTON
    CHECKOUT_PAYMENT --> CHECKOUT_SUMMARY
  end
```

---

## 4. Component Hierarchy — Auth (Critical Path)

```mermaid
graph TD
  subgraph "Auth Flow"
    P_SIGNIN["pages/auth/sign-in.vue"] --> AUTH_SIGNIN["Auth/SignIn.vue"]
    P_SIGNUP["pages/auth/sign-up.vue"] --> AUTH_SIGNUP["Auth/SignUp.vue"]
    P_FORGET["pages/auth/forget-password.vue"] --> AUTH_FORGET["Auth/ForgetPassword.vue"]
    P_RESET["pages/auth/reset-password.vue"] --> AUTH_RESET["Auth/ResetPassword.vue"]
    P_CONFIRM["pages/auth/confirm-code.vue"] --> AUTH_CONFIRM["Auth/ConfirmCode.vue"]
    P_CREATE["pages/auth/create-password.vue"] --> AUTH_CREATE["Auth/CreatePassword.vue"]
  end

  subgraph "Shared Auth UI"
    AUTH_SIGNIN --> UI_TEXT["UIText"]
    AUTH_SIGNUP --> UI_TEXT
    AUTH_FORGET --> UI_TEXT
    AUTH_RESET --> UI_TEXT
    AUTH_CONFIRM --> UI_TEXT
    AUTH_CREATE --> UI_TEXT
    AUTH_SIGNIN --> UI_PHONE["UIPhone"]
    AUTH_SIGNUP --> UI_PHONE
  end

  subgraph "State"
    AUTH_SIGNIN --> USER_STORE[("userStore<br/>~/stores/userStore.js")]
    MW_AUTH["middleware/auth.global.js"] --> USER_STORE
  end
```

---

## 5. Composable & Store Dependency Graph

```mermaid
graph TD
  subgraph "Composables"
    USE_API["composables/useApi.js<br/>($fetch wrapper, auth token, locale header)"]
    USE_SEO["composables/useSeo.js<br/>(canonical, OG, hreflang, JSON-LD)"]
    USE_STATE["composables/useState.js"]
    RECAPTCHA["composables/recapcha.js"]
  end

  subgraph "Stores"
    STORE_SHARED[("stores/sharedStore.js<br/>(settings, nationalities, currencies)")]
    STORE_USER[("stores/userStore.js<br/>(auth user data)")]
  end

  subgraph "Utils"
    UTIL_SEO["utils/seo.js<br/>(getPathWithoutLocale, pageStructureSchema)"]
    UTIL_DATE["utils/dateFormat.js"]
  end

  subgraph "High-Impact Consumers"
    PAGES["Most Pages<br/>(~40 .vue files)"] -->|"getData / postData / deleteData / putData"| USE_API
    PAGES -->|"addSeo"| USE_SEO
    LAYOUT_DEFAULT["layouts/default.vue"] -->|"sharedStore"| STORE_SHARED
    LAYOUT_AUTH["layouts/auth.vue"] -->|"sharedStore"| STORE_SHARED
    HEADER["Header/index.vue"] -->|"sharedStore"| STORE_SHARED
    FOOTER["Footer/index.vue"] -->|"sharedStore"| STORE_SHARED
    TOURS["Tours/RightPanal/index.vue"] -->|"sharedStore"| STORE_SHARED
    CART["Cart/steps/Cart/index.vue"] -->|"sharedStore"| STORE_SHARED
    CHECKOUT["Checkout/index.vue"] -->|"sharedStore"| STORE_SHARED
    AUTH_SIGNIN["Auth/SignIn.vue"] -->|"userStore"| STORE_USER
    MW_AUTH -->|"userStore"| STORE_USER
    USE_SEO -->|"uses"| UTIL_SEO
  end
```

---

## 6. Feature Area — Egypt Tours

```mermaid
graph TD
  subgraph "Egypt Tours Listing Pages"
    P_MULTI["pages/egypt-tours/multi-days-tours/index.vue"] --> C_MULTI["EgyptTours/MultiDays/Tours.vue"]
    P_NILE["pages/egypt-tours/nile-cruises/index.vue"] --> C_NILE["EgyptTours/Nile/Tours.vue"]
    P_ONEDAY["pages/egypt-tours/one-day-tours/index.vue"] --> C_ONEDAY["EgyptTours/OneDay/Tours.vue"]
    P_SHORE["pages/egypt-tours/shore-excursions/index.vue"] --> C_SHORE["EgyptTours/Shore/Tours.vue"]
  end

  subgraph "Shared Tour Components"
    C_MULTI --> SHARED_TOUR_CARD["SharedTourCard"]
    C_NILE --> SHARED_TOUR_CARD
    C_ONEDAY --> SHARED_TOUR_CARD
    C_SHORE --> SHARED_TOUR_CARD
    SHARED_TOUR_CARD --> STORE_SHARED
  end

  subgraph "Marketing Landing Pages"
    P_TAILOR["pages/egypt-tours/tailor-your-egypt-trip.vue"] --> C_TAILOR["EgyptTripLandingFrance"]
    P_PLAN["pages/egypt-tours/plan-your-egypt-journy.vue"] --> C_PLAN["EgyptTripLandingGerman"]
    P_SLUG["pages/egypt-tours/[slug].vue"] --> C_MARKETING["MarktingPages"]
  end
```

---

## 7. Feature Area — Blogs / Travel Guide

```mermaid
graph TD
  subgraph "Blog Pages"
    P_BLOGS["pages/blogs/all-blogs.vue"] --> C_BLOGS_CATS["Blogs/Categories/index.vue"]
    P_BLOGS --> C_BLOGS_MB["Blogs/Categories/MainBanner.vue"]
    P_BLOGS --> C_BLOGS_SEARCH["Blogs/Categories/SearchInput.vue"]
    P_BLOG["pages/blog/[slug].vue"] --> C_BLOG_BANNER["Blogs/Blog/MainBanner.vue"]
    P_BLOG --> C_BLOG_BODY["Blogs/Blog/index.vue"]
    P_BLOG --> C_BLOG_RELATED["Blogs/Blog/Related.vue"]
    P_BLOG --> TOURS_RELATED["Tours/LeftPanal/Related.vue"]
  end

  subgraph "Travel Guide Pages"
    P_GUIDE["pages/egypt-travel-guide/index.vue"] --> C_GUIDE_BANNER["Blogs/Categories/MainBanner.vue"]
    P_GUIDE --> C_GUIDE_CATS["Blogs/Categories/index.vue"]
    P_GUIDE_CATE["pages/egypt-travel-guide/[cate]/index.vue"] --> C_GUIDE_CATE_BANNER["Blogs/Category/MainBanners.vue"]
    P_GUIDE_CATE --> C_GUIDE_CATE_BLOGS["Blogs/Category/Blogs.vue"]
    P_GUIDE_ID["pages/egypt-travel-guide/[cate]/[id].vue"] --> C_GUIDE_ID_BANNER["Blogs/Category/MainBanners.vue"]
    P_GUIDE_ID --> C_GUIDE_ID_BLOGS["Blogs/Category/Blogs.vue"]
  end

  subgraph "Shared Blog UI"
    C_BLOGS_CATS --> SHARED_BLOG_CARD["SharedBlogCard"]
    C_GUIDE_CATE_BLOGS --> SHARED_BLOG_CARD
    C_BLOG_RELATED --> USE_API
    C_BLOG_BANNER --> USE_API
  end
```

---

## 8. Feature Area — Events

```mermaid
graph TD
  P_EVENTS["pages/events.vue"] --> C_EVENTS["Events/index.vue"]
  C_EVENTS --> C_EVENTS_HERO["Events/Hero.vue"]
  C_EVENTS --> C_EVENTS_DESC["Events/Description.vue"]
  C_EVENTS --> C_EVENTS_GALLERY["Events/Gallary.vue"]
  C_EVENTS --> C_EVENTS_LIST["Events/List.vue"]
  C_EVENTS --> C_EVENTS_CARD["Events/EventCard.vue"]

  P_EVENT["pages/event/[slug].vue"] --> C_EVENT["Event/index.vue"]
  C_EVENT --> C_EVENT_HERO["Event/Hero.vue"]
  C_EVENT --> C_EVENT_DESC["Event/Description.vue"]
  C_EVENT --> C_EVENT_GALLERY["Event/Gallary.vue"]
  C_EVENT --> C_EVENT_RIGHT["Event/RightPanal/index.vue"]
  C_EVENT_RIGHT --> C_EVENT_BOOK["Event/RightPanal/Book.vue"]
  C_EVENT_RIGHT --> C_EVENT_DETAILS["Event/RightPanal/Details.vue"]
  C_EVENT --> C_EVENT_RELATED_BLOGS["Event/RelatedBlogs.vue"]
  C_EVENT --> C_EVENT_RELATED_TOURS["Event/RelatedTours.vue"]
```

---

## 9. Impact Heatmap for Code Review

| File / Module | Consumers | Risk Level | Notes |
|---|---|---|---|
| `composables/useApi.js` | ~40 files | **HIGH** | Central HTTP client; changes affect every data fetch |
| `composables/useSeo.js` | ~25 files | **HIGH** | SEO composable; affects search visibility |
| `stores/sharedStore.js` | ~25 files | **HIGH** | Settings, currency, nationality; layout + many components |
| `stores/userStore.js` | ~5 files | **MEDIUM** | Auth state; middleware + auth components |
| `layouts/default.vue` | ~40 pages | **HIGH** | Global shell; Header/Footer injected here |
| `middleware/auth.global.js` | All routes | **MEDIUM** | Guards /profile; handles social login |
| `components/UI/*.vue` | ~50+ files | **HIGH** | Shared UI primitives; widespread blast radius |
| `components/Shared/TourCard.vue` | Many | **MEDIUM** | Core tour display card |
| `components/Shared/BlogCard.vue` | Many | **MEDIUM** | Core blog display card |
| `pages/index.vue` | Entry point | **HIGH** | Homepage; uses many Lazy-loaded components |
| `pages/cart/checkout.vue` | Conversion | **CRITICAL** | Payment/checkout flow |
| `pages/tour/[id].vue` | Core product | **HIGH** | Main tour detail page |

---

## 10. Review Checklist by Layer

### 10.1 Infrastructure Layer
- [ ] `nuxt.config.ts` — route rules, runtimeConfig, module order
- [ ] `tailwind.config.js` — theme tokens, content paths
- [ ] `server/middleware/redirect-http-protocol.ts` — redirect logic correctness
- [ ] `.github/workflows/main.yml` — **CRITICAL: hardcoded PAT present**

### 10.2 Global Layer
- [ ] `app.vue` — GTM/GA4 injection, `html lang` binding
- [ ] `layouts/default.vue` — global layout, store hydration
- [ ] `middleware/*.global.js` — auth guard, trailing slash, srsltid cleanup

### 10.3 Composables & Stores
- [ ] `composables/useApi.js` — auth header injection, error handling
- [ ] `composables/useSeo.js` — canonical logic, hreflang correctness
- [ ] `stores/sharedStore.js` — cookie-backed currency selection
- [ ] `stores/userStore.js` — token lifecycle

### 10.4 Shared Components (High Blast Radius)
- [ ] `components/UI/*.vue` — form inputs, buttons, icons
- [ ] `components/Shared/TourCard.vue` — pricing display, timer logic
- [ ] `components/Shared/BlogCard.vue` — image lazy-loading
- [ ] `components/Header/index.vue` — navigation, mobile menu, search
- [ ] `components/Footer/index.vue` — links, newsletter

### 10.5 Feature Components
- [ ] `components/Cart/**/*.vue` — cart mutations, rental vs. tour logic
- [ ] `components/Checkout/**/*.vue` — billing validation, payment flow
- [ ] `components/Tours/**/*.vue` — booking panel, calendar, add-ons
- [ ] `components/Auth/**/*.vue` — form validation, password rules

### 10.6 Pages
- [ ] `pages/index.vue` — Lazy component loading, above-the-fold ordering
- [ ] `pages/tour/[id].vue` — SEO, error state, data fetching
- [ ] `pages/cart/checkout.vue` — checkout conversion correctness
- [ ] `pages/profile/**/*.vue` — authenticated data handling

---

*End of Code Review Graph*
