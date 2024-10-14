# Create a Google Cloud Storage Bucket with custom domain name
# There is a set of steps to do it first. 
#  gsutil mb -l us-central1 gs://YOUR_BUCKET_NAME
# This creates the bucket in the us-central1 region.
# You also need to update the DNS. 
BUCKET_NAME=ansari.chat

# This is required the first time only
# gsutil mb -l us-central1 gs://YOUR_BUCKET_NAME
# You 

# Upload your site to the bucket
gsutil -m rsync -r -d $PWD/build gs://$BUCKET_NAME

# Make your bucket public
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Set up a website configuration
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME

echo "Your site is available at https://$BUCKET_NAME"