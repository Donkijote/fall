# Component gallery

The public entry point exports `ComponentGallery`. The router loads it at
`/dev/components` in development and Hall Settings links to it under the same
development guard.

The screen owns search, category filtering, and theme selection. The preview
catalog under `ui/components` registers shared components with example props
and curated usage locations. Feature modules own their preview fixtures under
`ui/components/previews` and export the registrations through their module
entry points. The gallery imports those registrations and displays them under
their owning module. The fixtures render the same components and artwork as
the feature, with sample data and local interactions where needed. Theme swatches read the existing CSS
variables. Theme selection updates the app preference so portaled controls use
the same theme as their triggers.

Add entries for shared and feature-local styled components and update usage
metadata when consumers move. Edit component styles at the listed source or edit semantic
tokens in `src/index.css`. The gallery reads these sources through the same
imports and CSS as app screens.

Verify the settings entry, search, category filter, and both themes on the
development server. Open the sample select, dialog, and popover and dismiss
them with Escape. Build production and check that the route and entry are
excluded.
