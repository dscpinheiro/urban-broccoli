import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
    aws_s3 as s3,
    aws_kms as kms,
    aws_iam as iam
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

        const inventoryBucket = new s3.Bucket(this, 'InventoryBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            lifecycleRules: [
                {
                    id: 'InventoryLifecycleRule',
                    enabled: true,
                    abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
                    expiration: cdk.Duration.days(60)
                }
            ]
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
                    noncurrentVersionExpiration: cdk.Duration.days(60),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: s3.StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
                            transitionAfter: cdk.Duration.days(30),
                            noncurrentVersionsToRetain: 3
                        }
                    ],
                    transitions: [
                        {
                            storageClass: s3.StorageClass.INTELLIGENT_TIERING,
                            transitionAfter: cdk.Duration.days(30)
                        }
                    ]
                }
            ],
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
            versioned: true,
            inventories: [
                {
                    inventoryId: 'backup-inventory',
                    frequency: s3.InventoryFrequency.WEEKLY,
                    includeObjectVersions: s3.InventoryObjectVersion.CURRENT,
                    enabled: true,
                    destination: {
                        bucket: inventoryBucket,
                        bucketOwner: cdk.Aws.ACCOUNT_ID
                    },
                    optionalFields: ['Size', 'LastModifiedDate', 'StorageClass', 'ETag']
                }
            ]
        });

        new cdk.CfnOutput(this, 'KmsKeyArn', { value: backupKey.keyArn });
        new cdk.CfnOutput(this, 'BackupBucketArn', { value: backupBucket.bucketArn });
        new cdk.CfnOutput(this, 'InventoryBucketArn', { value: inventoryBucket.bucketArn });
    }
}
