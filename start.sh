#!/bin/bash

npx prisma db push
node ./build/index.js