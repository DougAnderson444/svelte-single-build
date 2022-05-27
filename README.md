# Svelte App in a single page

## Minimal example of how to rollup a Svelte app into a single file

Takes the svelte code on places it in the template so that this can be used as the srcdoc in an iframe.

base64 turns out to be super big though (28k or so)

The other option is to simply escape the javascript code for (5k) size.

## Rollup.config.js

Where the magic happens.
