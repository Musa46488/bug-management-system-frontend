# Bug Management System

A full-stack bug tracking platform for managing tickets throughout their lifecycle with secure authentication, filtering, and status management.

## Overview

The Bug Management System is designed to help users create, track, filter, and manage software issues through a responsive web interface.

The project is split into separate frontend and backend applications.

## Features

- Secure JWT authentication
- Bug and ticket management
- Status workflow management
- Ticket filtering
- Responsive dashboard
- REST API integration
- PostgreSQL-backed data storage

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT

## Architecture

Frontend  
Next.js + React + Tailwind CSS

↓

REST API

↓

Node.js + Express.js

↓

PostgreSQL

## Backend Repository

[View Backend API](https://github.com/Musa46488/bug-management-system-api)

## Running Locally

```bash
git clone https://github.com/Musa46488/bug-management-system-frontend.git
cd bug-management-system-frontend
npm install
npm run dev
