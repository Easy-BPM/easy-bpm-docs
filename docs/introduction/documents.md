---
title: Documents
---

# Documents

Documents are files associated with process work, such as invoices, contracts, evidence, or generated reports. Easy BPM stores document content separately from process variables while keeping metadata and relationships available to tasks and instances.

Use a document ID or small metadata object in process variables rather than embedding file content. This keeps process state manageable and lets access, preview, download, and retention behavior remain explicit.

Documents commonly enter a process through a form upload or an integration. Later tasks can present a download action or PDF preview while preserving the same document reference.

Treat documents as potentially sensitive. Validate allowed file types and size, expose them only to authorized users, and align retention with the business and legal lifecycle of the process.

See [Documents](../guides/documents.md) for upload, metadata, preview, listing, and deletion operations.
