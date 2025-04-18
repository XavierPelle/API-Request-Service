FROM node:21-alpine
 
WORKDIR /app

COPY . .
 
EXPOSE 3000

CMD ["npm", "run", "dev"]