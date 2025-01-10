# Variables
CLIENT=dytsaw94
SERVICES=client event-bus moderation query posts comments

# Build all Docker images
.PHONY: build
build:
	@echo "Building all Docker images..."
	@for service in $(SERVICES); do \
		echo "Building $$service..."; \
		docker build -t $(CLIENT)/$$service ./$$service; \
	done

# Push all Docker images to registry
.PHONY: push
push: build
	@echo "Pushing all Docker images..."
	@for service in $(SERVICES); do \
		echo "Pushing $$service..."; \
		docker push $(CLIENT)/$$service; \
	done

# Run all containers
.PHONY: run
run:
	@echo "Starting all containers..."
	@for service in $(SERVICES); do \
		echo "Starting $$service..."; \
		docker run -d --name $$service $(CLIENT)/$$service; \
	done

# Stop all containers
.PHONY: stop
stop:
	@echo "Stopping all containers..."
	@for service in $(SERVICES); do \
		echo "Stopping $$service..."; \
		docker stop $$service 2>/dev/null || true; \
	done

# Remove all containers and images
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

# Remove only containers
.PHONY: remove
remove:
	@echo "Stopping and removing containers..."
	@for service in $(SERVICES); do \
		docker stop $$service 2>/dev/null || true; \
		docker rm $$service 2>/dev/null || true; \
	done

.PHONY: apply-manifest
apply-manifest:
	@echo "Applying Kubernetes manifest..."
	@kubectl apply -f ./k8s/

.PHONY: delete-manifest
delete-manifest:
	@echo "Deleting Kubernetes manifest..."
	@kubectl delete -f ./k8s/

.PHONY: view-all
view-all:
	@echo "Viewing Kubernetes manifest..."
	@kubectl get all
