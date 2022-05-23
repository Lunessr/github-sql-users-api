FROM node

WORKDIR /github-users-api

COPY package.json /github-users-api
COPY . /github-users-api

RUN npm install

EXPOSE 3000

CMD [ "/src/main.ts", "ts-node"]