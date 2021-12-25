import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
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
});
