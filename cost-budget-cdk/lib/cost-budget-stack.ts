import * as cdk from '@aws-cdk/core';
import * as budgets from '@aws-cdk/aws-budgets';

export class BudgetAppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Parameters
        const thresholdAmount = new cdk.CfnParameter(this, 'BudgetThreshold', {
            type: 'Number',
            default: 50,
            minValue: 0
        });

        const notificationEmail = new cdk.CfnParameter(this, 'NotificationEmail');

        // Resources
        const budgetSubscribers = [{
            address: notificationEmail.valueAsString,
            subscriptionType: 'EMAIL'
        }];

        const myBudget = new budgets.CfnBudget(this, 'MonthlyBudget', {
            budget: {
                budgetName: `monthly-budget-${cdk.Aws.ACCOUNT_ID}`,
                budgetType: 'COST',
                budgetLimit: {
                    amount: thresholdAmount.valueAsNumber,
                    unit: 'USD'
                },
                timeUnit: 'MONTHLY'
            },
            notificationsWithSubscribers: [
                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'FORECASTED',
                        threshold: 50,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: budgetSubscribers
                },
                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'FORECASTED',
                        threshold: 100,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: budgetSubscribers
                },

                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'ACTUAL',
                        threshold: 100,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: budgetSubscribers
                },
                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'ACTUAL',
                        threshold: 200,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: budgetSubscribers
                },
                {
                    notification: {
                        comparisonOperator: 'GREATER_THAN',
                        notificationType: 'ACTUAL',
                        threshold: 300,
                        thresholdType: 'PERCENTAGE'
                    },
                    subscribers: budgetSubscribers
                }
            ]
        });

        // Outputs
        new cdk.CfnOutput(this, 'BudgetName', { value: myBudget.ref });
    }
}
