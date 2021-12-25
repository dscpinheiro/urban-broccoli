import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { BudgetAppStack } from '../lib/cost-budget-stack';

test('creates cost budget', () => {
    const app = new cdk.App();
    const stack = new BudgetAppStack(app, 'TestStack', {
        synthesizer: new cdk.DefaultStackSynthesizer({
            generateBootstrapVersionRule: false
        })
    });

    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
});
