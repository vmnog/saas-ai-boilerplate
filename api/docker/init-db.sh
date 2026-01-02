#!/bin/bash

PGPASSWORD=docker psql -U docker -d acme -c "CREATE DATABASE \"acme-test\";" 2>/dev/null || echo "Database acme-test already exists or skipped"
