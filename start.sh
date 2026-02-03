#!/bin/bash
cd backend
npm install
npm run migrate
npm run seed
npm start