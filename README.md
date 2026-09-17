# Ace Company CMS

Corporate website + CMS/admin platform built with **Laravel 12**, **Inertia.js**, **React**, and **Tailwind CSS**.

Website content (company name, logo, services, team, portfolio, theme colors, etc.) is managed from the admin dashboard — not hard-coded.

## Quick start

```bash
cd company_site
composer install
cp .env.example .env   # if needed
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
npm install
npm run dev
php artisan serve
```

- Public site: http://127.0.0.1:8000  
- Admin: http://127.0.0.1:8000/admin (login at `/login`)

### Default admin

- Email: `admin@ace.local`
- Password: `password`

## What’s included (Phase 1)

### Public website
- Homepage sections: Hero, About, Services, Why Us, Stats, Portfolio, Testimonials, Team, FAQ, CTA
- Pages: About, Services (+ detail), Portfolio (+ detail), Team, FAQ, Contact, Request Quote, Place Order
- Contact form, quote requests, service orders, newsletter signup
- Company address seeded for Kalutara, Sri Lanka

### Admin CMS
- Dashboard overview (orders, leads, messages, revenue)
- Company settings (name, logo upload, contact, social, theme colors)
- Homepage section manager (enable/edit content)
- CRUD: Services, Projects, Team, Testimonials, FAQs, Why Choose Us, Statistics
- Orders, Quote leads, Contact messages

## Customer & Employee CRM

Admin sidebar includes a full CRM:

### Customers (`/admin/customers`)
- Profiles with code, company, status (lead → prospect → active → vip)
- Source, priority, tags, assigned staff
- Auto-created from website contact / quote / order forms
- Orders, quotes, messages, activity timeline, CRM notes (call/email/meeting/task)

### Employees (`/admin/employees`)
- Staff directory with departments, roles, employment type
- Roles: Super Admin, Manager, Content Manager, Sales, Support, Staff
- Permission presets per role
- Optional login account creation
- Manager hierarchy, assigned orders, notes

Website **Team** (public page) is separate from **Employees** (internal CRM).


In **Admin → Company Settings** you can update:
- Company name & logo
- Phone, email, WhatsApp, address
- Social links
- Primary / accent theme colors

No code changes required.

## Stack

- Laravel 12 + Inertia React starter kit
- Tailwind CSS v4
- SQLite by default (switch to MySQL in `.env` when ready)
