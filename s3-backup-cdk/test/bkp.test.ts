import * as cdk from '@aws-cdk/core';
import { SynthUtils } from '@aws-cdk/assert';
import { BackupStack } from '../lib/bkp-stack';

test('creates backup bucket and kms key', () => {
    const app = new cdk.App();
    const stack = new BackupStack(app, 'TestStack');
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
