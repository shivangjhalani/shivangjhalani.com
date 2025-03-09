# Notes Structure Documentation

This document explains how to use the new structured notes section in the blog.

## Overview

The notes section provides a folder-like structure for organizing and presenting notes, making it easier for readers to navigate through different categories and topics.

## Directory Structure

```
content/notes/
├── _index.md           # Main notes page
├── [Category]/         # Category folder (e.g., AI, Programming)
│   ├── _index.md       # Category index page
│   └── [Topic]/        # Topic folder
│       ├── index.md    # Content page with embedded PDF
│       └── [assets]    # PDFs, images, etc.
```

## Adding New Notes

### 1. Create a New Category (if needed)

If you're adding notes for a new category:

```bash
# Create the category directory
mkdir -p content/notes/NewCategory

# Create the category index file
cat > content/notes/NewCategory/_index.md << EOF
---
title: New Category Notes

---

# New Category Notes

Browse through my collection of notes on this category.
EOF
```

### 2. Add a New Note

```bash
# Create the note directory
mkdir -p content/notes/Category/NewTopic

# Create the note index file
cat > content/notes/Category/NewTopic/index.md << EOF
---
title: New Topic
description: Description of the note
date: $(date +"%Y-%m-%d %H:%M:%S%z")
tags:
  - tag1
  - tag2
categories:
  - Notes
  - Category
weight: 0
toc: true
readingTime: true
comments: true
math: false
hidden: false

---

# New Topic Title

Description or introduction to the note.

<object data="./your-pdf-file.pdf" type="application/pdf" width="100%" height="800px">
  <p>Your browser doesn't support PDF viewing. <a href="./your-pdf-file.pdf">Download PDF</a> instead.</p>
</object>
EOF

# Copy your PDF file to the note directory
cp path/to/your-pdf-file.pdf content/notes/Category/NewTopic/
```

## Migration Script

A migration script (`migrate-notes.sh`) is provided to help migrate existing notes from the old structure (`content/post/5.Notes/`) to the new structure (`content/notes/`).

To use the script:

```bash
# Make the script executable
chmod +x migrate-notes.sh

# Run the script
./migrate-notes.sh
```

The script will:
1. Copy all PDFs and other assets from the old location to the new one
2. Copy the index.md files without modification
3. Maintain the same folder structure within each category

## Layout and Styling

The notes section reuses the same layouts and components as the blog section:

1. Uses the same article list component for displaying notes and folders
2. Uses the same article component for displaying individual notes
3. Embedded PDF viewer for note content
4. Perfectly matches the styling of the rest of the site

By reusing the blog components, the notes section maintains complete consistency with the blog section, ensuring a unified look and feel across the entire site.

## Breadcrumb Navigation

The site now includes breadcrumb navigation on all pages (except the homepage), which helps users navigate through the site's structure. The breadcrumb starts with a "~" symbol that links to the home page, followed by the current page's path.

For example, when viewing a note at `/notes/ai/supervised-ml/`, the breadcrumb will show:
```
~/notes/ai/supervised-ml
```

This makes it easy to navigate back to parent directories or the home page.
