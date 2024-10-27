#!/bin/bash
set -e

# Configurations
BUCKET_NAME=${BUCKET_NAME:-"ansari.chat"}
REGION=${REGION:-"us-west1"}
BUILD_DIR=${BUILD_DIR:-"$PWD/build"}
MAIN_PAGE=${MAIN_PAGE:-"index.html"}
# Make the error page also index.html to do client-side routing
ERROR_PAGE=${ERROR_PAGE:-"index.html"}

# Validations
[[ -z "$BUCKET_NAME" || ! "$BUCKET_NAME" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] && { echo "Invalid BUCKET_NAME."; exit 1; }
command -v gcloud &>/dev/null || { echo "gcloud not found."; exit 1; }

# Build React App (if applicable)
[[ "$REBUILD_APP" == true ]] && { command -v yarn &>/dev/null && yarn build || { echo "Yarn not found."; exit 1; }; }
[[ ! -d "$BUILD_DIR" ]] && { echo "BUILD_DIR not found."; exit 1; }

# Create Bucket if Not Exists
gcloud storage buckets list --filter="name:$BUCKET_NAME" --format="value(name)" | grep -q "$BUCKET_NAME" || \
  gcloud storage buckets create "gs://$BUCKET_NAME" --location="$REGION"

# Upload Files
gcloud storage rsync -r --delete-unmatched-destination-objects "$BUILD_DIR" "gs://$BUCKET_NAME"

# Set Website Configuration
gcloud storage buckets update "gs://$BUCKET_NAME" --web-main-page-suffix="$MAIN_PAGE" --web-error-page="$ERROR_PAGE"

# Make Bucket Public (if applicable)
[[ "$MAKE_BUCKET_PUBLIC" == true ]] && \
  gcloud storage buckets add-iam-policy-binding "gs://$BUCKET_NAME" --member="allUsers" --role="roles/storage.objectViewer"

# Output Final URL
echo "Deployment complete. Your site: https://$BUCKET_NAME"

