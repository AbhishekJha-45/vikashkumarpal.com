const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

// Cloudflare R2 Configuration
const client = new S3Client({
    region: "auto",
    endpoint: "https://9e0668376f976c0b5bd61f0bd52727bf.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: "0126d854ea4e57f432fc0641a9c87ae6",
        secretAccessKey: "4142d4cdaab556b72b78283cb2946e4ba59164eb593e28b277a778f7893897c2",
    },
});

// Function to upload a file to R2
async function uploadFile(filePath, bucketName, key) {
    const fileStream = fs.createReadStream(filePath);
    console.log(`📤 Uploading ${filePath} as ${key} to bucket ${bucketName}`);

    const contentType = getContentType(filePath);
    
    const uploadParams = {
        Bucket: bucketName,
        Key: key.replace(/\\/g, "/"),  // Ensure forward slashes
        Body: fileStream,
        ContentType: contentType,
        ACL: "public-read",  // Ensure files are accessible
        Metadata: {
            "Cache-Control": "public, max-age=31536000" // Cache headers for JS files
        }
    };

    try {
        await client.send(new PutObjectCommand(uploadParams));
        console.log(`✅ Uploaded: ${key}`);
    } catch (err) {
        console.error(`❌ Error uploading ${key}:`, err);
    }
}

// Determine correct content type with explicit handling for JS
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript; charset=utf-8",   // Explicit JS type
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
    };

    return mimeTypes[ext] || "application/octet-stream";
}

// Upload all files from .next/static with correct path structure
async function uploadStaticFiles() {
    const staticDir = path.join(__dirname, ".next", "static");
    const bucketName = "static";  

    if (!fs.existsSync(staticDir)) {
        console.error("❌ Error: .next/static directory does not exist. Run 'next build' first.");
        return;
    }

    // Recursively upload files
    const walkDir = (dir, basePath) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                walkDir(filePath, basePath);
            } else {
                const relativePath = path.relative(basePath, filePath).replace(/\\/g, "/");
                const key = `_next/static/${relativePath}`;   // Ensure consistent path
                uploadFile(filePath, bucketName, key);
            }
        });
    };

    walkDir(staticDir, staticDir);
}

uploadStaticFiles();
