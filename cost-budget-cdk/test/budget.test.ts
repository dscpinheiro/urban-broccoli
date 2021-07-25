import * as cdk from '@aws-cdk/core';
import { SynthUtils } from '@aws-cdk/assert';
import { BudgetAppStack } from '../lib/cost-budget-stack';

test('creates cost budget', () => {
    const app = new cdk.App();
    const stack = new BudgetAppStack(app, 'TestStack');
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
