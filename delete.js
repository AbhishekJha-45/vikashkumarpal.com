const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

// Cloudflare R2 Configuration
const client = new S3Client({
    region: "auto",
    endpoint: "https://9e0668376f976c0b5bd61f0bd52727bf.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: "0126d854ea4e57f432fc0641a9c87ae6",
        secretAccessKey: "4142d4cdaab556b72b78283cb2946e4ba59164eb593e28b277a778f7893897c2",
    },
});

const bucketName = "static";  // Replace with your bucket name

// Function to delete all files in the bucket
async function deleteAllFiles() {
    try {
        console.log(`🔍 Listing all objects in bucket: ${bucketName}...`);

        // Step 1: List all objects in the bucket
        let listedObjects;
        do {
            const listParams = {
                Bucket: bucketName,
                MaxKeys: 1000, // Adjust the limit if necessary
                ContinuationToken: listedObjects?.NextContinuationToken
            };

            const listResponse = await client.send(new ListObjectsV2Command(listParams));
            listedObjects = listResponse;

            if (!listResponse.Contents || listResponse.Contents.length === 0) {
                console.log("✅ No files found. Bucket is empty.");
                return;
            }

            // Step 2: Prepare batch delete params
            const objectsToDelete = listResponse.Contents.map((obj) => ({
                Key: obj.Key
            }));

            const deleteParams = {
                Bucket: bucketName,
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: false
                }
            };

            // Step 3: Delete objects
            await client.send(new DeleteObjectsCommand(deleteParams));
            console.log(`🗑️ Deleted ${objectsToDelete.length} files`);

        } while (listedObjects.IsTruncated);

        console.log("🎯 All files have been deleted successfully.");
    } catch (error) {
        console.error("❌ Error deleting files:", error);
    }
}

deleteAllFiles();
