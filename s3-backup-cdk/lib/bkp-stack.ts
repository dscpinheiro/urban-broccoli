import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as kms from '@aws-cdk/aws-kms';
import * as iam from '@aws-cdk/aws-iam';

export class BackupStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const keyAdmin = iam.User.fromUserName(this, 'BackupKeyAdmin', 'keyadmin');

        const backupKey = new kms.Key(this, 'S3BackupKey', {
            admins: [keyAdmin],
            alias: 's3-backup-key',
            description: 'Key to be used for S3 SSE-KMS',
            enabled: true
        });

        const inventoryBucket = new s3.Bucket(this, 'InventoryBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            lifecycleRules: [
                {
                    id: 'InventoryLifecycleRule',
                    enabled: true,
                    abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
                    expiration: cdk.Duration.days(365),
                    transitions: [
                        {
                            storageClass: s3.StorageClass.INFREQUENT_ACCESS,
                            transitionAfter: cdk.Duration.days(180)
                        }
                    ]
                }
            ]
        });

        const backupBucket = new s3.Bucket(this, 'BackupBucket', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            bucketKeyEnabled: true,
            encryption: s3.BucketEncryption.KMS,
            encryptionKey: backupKey,
            lifecycleRules: [
                {
                    id: 'BackupLifecycleRule',
                    enabled: true,
                    abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
                    noncurrentVersionExpiration: cdk.Duration.days(90),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: s3.StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
                            transitionAfter: cdk.Duration.days(45)
                        }
                    ],
                    transitions: [
                        {
                            storageClass: s3.StorageClass.INFREQUENT_ACCESS,
                            transitionAfter: cdk.Duration.days(60)
                        },
                        {
                            storageClass: s3.StorageClass.GLACIER,
                            transitionAfter: cdk.Duration.days(365)
                        }
                    ]
                }
            ],
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
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
