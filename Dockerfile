FROM node:6.9.4

RUN npm install pm2 -g

CMD ["pm2-docker", "/opt/content-predictor-service/src/app.js", "--", "--prod"]