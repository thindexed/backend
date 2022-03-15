FROM --platform=linux/amd64 node:17-alpine

WORKDIR /app
RUN apk add g++ make python3

COPY server ./server
COPY package.json .
COPY package-lock.json .

RUN npm install

#RUN addgroup beaker && \
#    adduser --gecos "" --ingroup beaker --disabled-password beaker
#
#USER beaker:beaker

ENTRYPOINT ["node", "server/index.js"]
