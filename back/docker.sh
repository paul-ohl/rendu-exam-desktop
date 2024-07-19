# Build and run the docker container in the current directory

# Build the docker image
docker build -t whysapp-backend .

# Run the docker container
docker run -d -p 3000:3000 whysapp-backend
