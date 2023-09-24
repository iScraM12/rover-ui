# Docker/K8s Workshop
## Lokale Docker Registry auf Minikube Registr setzen
```
eval $(minikube docker-env)
```
## Rover-Ui bauen
```
npm install && npm run build
```
## Rover-Service Docker Image bauen
```
docker build -t rover-ui .
```

### Rover-Service Docker Container testen
```
docker run --rm -d --name rover-ui -p 10101:80 -v ~/source/rover-ui/container/config:/config rover-ui
```

### Im Browser
### URL: http://localhost:10101
