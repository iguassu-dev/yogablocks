Gives Cursor rules for handling internal document linking logic

# Linking Logic

## Format

Use Markdown-style links in content:

```md
[Mountain Pose](library/mountain-pose-id)

## Insert

From editor, insert links via:

Library Drawer → + button beside doc → calls onLinkInsert() handler

Inserted at current cursor position

## Parse

In reader mode, parse links inside content:

Match [Title](doc-id) format

Render as navigable link
```
