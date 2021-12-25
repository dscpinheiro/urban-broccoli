#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BudgetAppStack } from '../lib/cost-budget-stack';

const app = new cdk.App();
new BudgetAppStack(app, 'CostBudgetCdkStack', {
    synthesizer: new cdk.DefaultStackSynthesizer({
        generateBootstrapVersionRule: false
    })
});
