# HostelMate

**AI-powered hostel and PG finder for college students in Gujarat.**

> Find • Compare • Choose

A full-stack web application for discovering, comparing, and managing student
hostels across Ahmedabad, Anand, and Vadodara.

---

## Table of Contents

1. [What This Project Does](#what-this-project-does)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Supabase Setup](#supabase-setup)
7. [Google OAuth Setup](#google-oauth-setup)
8. [Running the Project](#running-the-project)
9. [Creating the First Admin](#creating-the-first-admin)
10. [Available Scripts](#available-scripts)
11. [Project Structure](#project-structure)
12. [Routes](#routes)
13. [Troubleshooting](#troubleshooting)
14. [Deployment](#deployment)

---

## What This Project Does

HostelMate lets students in Gujarat:

- Search hostels by city, budget, gender, rating, facilities, and availability
- View detailed hostel information with images, facilities, and location
- Save favourites and compare up to 3 hostels side by side
- Submit enquiries directly to hostel owners

And lets HostelMate admins:

- Manage the entire hostel database (create, edit, publish, delete)
- Review statistics per city
- Import hostel data in bulk via JSON

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Icons | lucide-react |
| Theme | next-themes (light / dark) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email + Google OAuth) |
| API | Next.js Route Handlers |

---

## Prerequisites

Before you start, install:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | 18.17+ or 20+ | https://nodejs.org |
| **npm** | 9+ (comes with Node) | — |
| **Git** | any recent version | https://git-scm.com |

Verify they are installed. Open a terminal and run:

```powershell
node -v
npm -v
git --version
