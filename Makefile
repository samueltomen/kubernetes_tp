# Variables
CLIENT=dytsaw94 # A modifier !! remplace par votre nom docker hub
SERVICES=client event-bus moderation query posts comments

# Build tous les Docker images
.PHONY: build
build:
	@echo "Building all Docker images..."
	@for service in $(SERVICES); do \
		echo "Building $$service..."; \
		docker build -t $(CLIENT)/$$service ./$$service; \
	done

# Push tous les Docker images
.PHONY: push
push: build
	@echo "Pushing all Docker images..."
	@for service in $(SERVICES); do \
		echo "Pushing $$service..."; \
		docker push $(CLIENT)/$$service; \
	done

# Demarre tous les containers
.PHONY: run
run:
	@echo "Starting all containers..."
	@for service in $(SERVICES); do \
		echo "Starting $$service..."; \
		docker run -d --name $$service $(CLIENT)/$$service; \
	done

# Stop tous les containers
.PHONY: stop
stop:
	@echo "Stopping all containers..."
	@for service in $(SERVICES); do \
		echo "Stopping $$service..."; \
		docker stop $$service 2>/dev/null || true; \
	done

# Supprime tous les containers et images
.PHONY: clean
clean:
	@echo "Stopping and removing containers..."
	@for service in $(SERVICES); do \
		docker stop $$service 2>/dev/null || true; \
		docker rm $$service 2>/dev/null || true; \
	done
	@echo "Removing images..."
	@for service in $(SERVICES); do \
		docker rmi $(CLIENT)/$$service 2>/dev/null || true; \
	done

# Stop et supprime les containers
.PHONY: remove
remove:
	@echo "Stopping and removing containers..."
	@for service in $(SERVICES); do \
		docker stop $$service 2>/dev/null || true; \
		docker rm $$service 2>/dev/null || true; \
	done

.PHONY: stop-all
stop-all:
	@echo "Stopping all containers..."
	@docker stop $(docker ps -a -q)

# Commandes Kubernetes
.PHONY: apply
apply:
	@echo "Applying all Kubernetes resources..."
	@kubectl apply -f k8s/

.PHONY: delete
delete:
	@echo "Deleting all Kubernetes resources..."
	@kubectl delete -f k8s/

# Supprime tous les pods et les recrée
.PHONY: recreate-pods
recreate-pods:
	@echo "Recreating all pods..."
	@kubectl delete pods --all
	@echo "Waiting for pods to terminate..."
	@sleep 5
	@echo "New pods are being created by deployments..."

# Supprime tous les services sauf kubernetes
.PHONY: delete-services
delete-services:
	@echo "Deleting all services except kubernetes..."
	@kubectl get services | grep -v 'kubernetes' | tail -n +2 | awk '{print $$1}' | xargs -I{} kubectl delete service {}

# Supprime tous les pods, deployments et services sauf kubernetes
.PHONY: delete-all
clear:
	@echo "Deleting all services except kubernetes..."
	@kubectl get services | grep -v 'kubernetes' | tail -n +2 | awk '{print $$1}' | xargs -I{} kubectl delete service {} 2>/dev/null || true
	@echo "Deleting all pods..."
	@kubectl delete pods --all 2>/dev/null || true
	@echo "Deleting all deployments..."
	@kubectl get deployments -o name | xargs -I{} kubectl delete {} 2>/dev/null || true

# Affiche les ressources Kubernetes
.PHONY: status
status:
	@echo "Getting all Kubernetes resources..."
	@echo "\Pods:"
	@kubectl get pods
	@echo "\Services:"
	@kubectl get services
	@echo "\Deployments:"
	@kubectl get deployments
	@echo "\Ingress:"
	@kubectl get ingress

# Affiche les pods
.PHONY: pods
pods:
	@echo "Getting Kubernetes pods..."
	@kubectl get pods

# Affiche les services
.PHONY: services
services:
	@echo "Getting Kubernetes services..."
	@kubectl get services

# Affiche les deployments
.PHONY: deploy
deploy:
	@echo "Getting Kubernetes deployments..."
	@kubectl get deployments

