FROM node:18-alpine as angular

WORKDIR /app

COPY swp-stub/package*.json /app/
RUN npm install

COPY swp-stub /app/
RUN npm run build -- --base-href='/assets/island-explorer/' --deploy-url='/assets/island-explorer/'


FROM python:3.13 as python

RUN pip install Jinja2

COPY user_stories /app/user_stories
WORKDIR /app/user_stories
RUN python3 generate_site.py

COPY architecture /app/architecture
WORKDIR /app/architecture
RUN python3 generate_site.py


FROM alpine:3.22 as final


COPY index-en.html /app/index-en.html
COPY index.html /app/index.html
COPY style.css /app/style.css
COPY design /app/design

COPY  architecture/mermaid.min.js /app/assets/mermaid.min.js

COPY --from=angular /app/dist /app/assets/island-explorer

COPY --from=python /app/user_stories/index.html /app/user_stories/index.html 
COPY --from=python /app/user_stories/style.css /app/user_stories/style.css 
COPY --from=python /app/architecture/index.html /app/architecture/index.html 

WORKDIR /app

RUN mv assets/island-explorer/assets/* assets/

CMD [ "cd" ]