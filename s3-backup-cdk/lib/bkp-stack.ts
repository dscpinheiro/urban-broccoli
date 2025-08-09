import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
    aws_s3 as s3,
    aws_kms as kms
} from 'aws-cdk-lib';

export class BackupStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const backupKey = new kms.Key(this, 'S3BackupKey', {
            alias: 's3-backup-key',
            description: 'Key to be used for S3 SSE-KMS',
            enabled: true,
            keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
            keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT
        });

        const backupBucket = new s3.Bucket(this, 'BackupBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            bucketKeyEnabled: true,
            enforceSSL: true,
            encryption: s3.BucketEncryption.KMS,
            encryptionKey: backupKey,
            lifecycleRules: [
                {
                    id: 'BackupLifecycleRule',
                    enabled: true,
                    abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
                    expiredObjectDeleteMarker: true,
                    noncurrentVersionExpiration: cdk.Duration.days(45),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: s3.StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
                            transitionAfter: cdk.Duration.days(30),
                            noncurrentVersionsToRetain: 2
                        }
                    ],
                    transitions: [
                        {
                            storageClass: s3.StorageClass.INTELLIGENT_TIERING,
                            transitionAfter: cdk.Duration.days(14)
                        }
                    ]
                }
            ],
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            versioned: true,
        });

        new cdk.CfnOutput(this, 'KmsKeyArn', { value: backupKey.keyArn });
        new cdk.CfnOutput(this, 'BackupBucketArn', { value: backupBucket.bucketArn });
    }
}
