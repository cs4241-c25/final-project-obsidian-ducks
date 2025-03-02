import {S3Client} from "@aws-sdk/client-s3";
import uploadFile from "@/lib/uploadFile";

export default class PhotoManager {
    private readonly allowedTypes: string[];
    private readonly maxSize: number;

    constructor();
    constructor(allowedTypes: string[], maxSize: number);

    constructor(allowedTypes?: string[], maxSize?: number) {
        this.allowedTypes = allowedTypes ?? ['image/jpeg', 'image/png', 'image/gif'];
        this.maxSize = maxSize ?? 5 * 1024 * 1024;
    }

    async upload(file: File) {
        const S3 = new S3Client();
        const result = await uploadFile(file, S3, this.allowedTypes, this.maxSize);
        if (!result.success) {
            throw new Error("Photo upload failed");
        }
        return result.url;
    }
}