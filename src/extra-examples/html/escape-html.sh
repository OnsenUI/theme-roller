#!/bin/bash
# Use this to turn the human-readable HTML files in html/ to the escaped format
# needed for ../extra-examples.json
sed 's/"/\\"/g; s/^\s*//' $1 | perl -p -e 's/\n//'
