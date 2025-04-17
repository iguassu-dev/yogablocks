High-level product overview for Cursor AI to understand project intent and UX

# YogaBlocks Project Overview

YogaBlocks is a **mobile-first** web app for yoga teachers to create, organize, and reuse teaching content. It blends the creative freedom of a rich text editor with the utility of a yoga content library.

## Key principles:

- Designed for mobile screens (320–430px)
- Supports custom document linking
- Stores all user content in a unified `documents` table
- Enables fast creation, editing, duplication, and deletion of documents

## Dev Constraints (from roadmap)

- Week 6: Only support Markdown textarea (TipTap coming later)
- Week 8: Linking enabled via Library Drawer (not inline)
- Week 9+: Add visual feedback (toasts) for link success/failure
- Only `/library` supports creating new docs — drawer is read-only

## Design Guidelines (Mobile)

- Screen width: 320–430px
- FAB: absolute `bottom-6 right-6`, 56x56px
- Header: shows app name in center when not editing
- Library Drawer: slides from bottom, full height on mobile
- Typography: use Tailwind custom components (Heading1, Body, etc.)
