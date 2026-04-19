# JK Fitness — Responsive Landing Website

## Problem Statement
Dark, cinematic, neon-red fitness landing page for JK Fitness (Dindoli, Surat). Split hero with muscular figure in red hoodie, navbar, about, services, fitness options, pricing packages (Gents/Ladies/PT/Trial), timings, reviews, contact CTA. Sign-up popup stores leads in MongoDB.

## Architecture
- Frontend: React + Tailwind + Shadcn (Dialog/Input/Textarea/Button/Sonner), lucide-react icons, Anton + Montserrat fonts
- Backend: FastAPI + MongoDB (motor)
- Endpoints: POST /api/leads, GET /api/leads, GET /api/status, POST /api/status

## User Personas
- Gym prospects in Dindoli (men/women) seeking affordable training
- Gym owner (JK Fitness) capturing leads from website

## Core Requirements
- Dark cinematic theme (#050505, neon red #FF2D2D → #FF3B1F)
- Split hero + Sign Up dialog form → stored in MongoDB
- All sections: Hero, About, Services, Fitness Options, Packages, Timings, Reviews, Contact CTA, Footer
- Responsive, with data-testid on all interactives

## Implemented (Dec 2025)
- POST/GET /api/leads with Pydantic validation
- Full single-page landing with 9 sections
- Get Started dialog (4 trigger points: navbar, hero, packages, final CTA)
- Marquee, floating accent, grain overlay, animations

## Backlog
- P1: Admin page to view leads (/admin)
- P2: Resend/SendGrid auto-email confirmation on lead capture
- P2: WhatsApp click-to-chat button
