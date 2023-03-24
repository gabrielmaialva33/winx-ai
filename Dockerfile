FROM node:19

# Install pm2
RUN npm install pm2 -g

# Create app directory
WORKDIR /home/winx

# Copy all files
COPY . .

# Install app dependencies and build
RUN yarn && yarn build

# Copy the main.gpt.txt file
COPY ./tmp/main.gpt.txt ./tmp/main.gpt.txt

# Expose the port
EXPOSE 80

# Run the app
CMD [ "pm2", "start", "ecosystem.config.js" ]



