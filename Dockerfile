FROM node:alpine

COPY . /app

WORKDIR	/app

RUN npm install arcsecond

WORKDIR /app/UnitTest/vm

CMD node index ../examples/x+y.asm

