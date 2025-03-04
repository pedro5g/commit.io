#!/bin/bash
export $(grep -v '^#' .env | xargs)
echo apps running in ${NODE_ENV} mode
npm run dev -w apps/services/users