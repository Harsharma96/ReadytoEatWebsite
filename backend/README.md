# ⚙️ FoodEat™ Backend Server

Standalone Node.js / Express / TypeScript REST API Backend.

## 🚀 Endpoints

- `GET /api/orders` — List all orders
- `POST /api/orders` — Place order
- `GET /api/orders/:id` — Live order tracking & telemetry
- `PATCH /api/orders/:id` — Update kitchen pipeline status
- `DELETE /api/orders/:id` — Delete order
- `POST /api/promo/validate` — Validate voucher code
- `POST /api/contact` — VIP catering inquiries
- `POST /api/newsletter` — Subscribe to VIP club
- `GET /api/admin/stats` — Live revenue & operational telemetry

## 🛠️ Run Backend
```bash
npm install
npm run dev
```
Runs on `http://localhost:5000`.
