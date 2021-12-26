import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { BackupStack } from '../lib/bkp-stack';

test('creates backup bucket and kms key', () => {
    const app = new cdk.App();
    const stack = new BackupStack(app, 'TestStack', {
        synthesizer: new cdk.DefaultStackSynthesizer({
            generateBootstrapVersionRule: false
        })
    });

    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();

    template.resourceCountIs('AWS::S3::Bucket', 2);
    template.resourceCountIs('AWS::S3::BucketPolicy', 2);

    template.hasResourceProperties('AWS::KMS::Key', {
        Enabled: true,
        EnableKeyRotation: Match.absent()
    });

    template.hasResourceProperties('AWS::KMS::Alias', Match.objectEquals({
        AliasName: 'alias/s3-backup-key',
        TargetKeyId: { 'Fn::GetAtt': ['S3BackupKeyB921581F', 'Arn'] }
    }));

    template.hasOutput('KmsKeyArn', {
        Value: Match.anyValue()
    });
});
