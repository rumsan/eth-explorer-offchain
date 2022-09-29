FROM node:16.13.2-alpine3.15
#RUN apk add --update bash git
#set working directory
WORKDIR /usr/src/app 
COPY . .
#install packages
RUN yarn
#expose application working port
EXPOSE 4400
CMD ["yarn","production"]