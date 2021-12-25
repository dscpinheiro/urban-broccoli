import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_budgets as budgets } from 'aws-cdk-lib';

export class BudgetAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Parameters
        const thresholdAmount = new cdk.CfnParameter(this, 'BudgetThreshold', {
            type: 'Number',
            default: 50,
            minValue: 0
        });

        const notificationAddress = new cdk.CfnParameter(this, 'NotificationAddress');

        const notificationType = new cdk.CfnParameter(this, 'NotificationType', {
            type: 'String',
            default: 'EMAIL',
            allowedValues: ['EMAIL', 'SNS']
        });

        this.templateOptions.metadata = {
            'AWS::CloudFormation::Interface': {
                ParameterGroups: [
                    {
                        Label: { default: 'AWS Budget configuration' },
                        Parameters: [
                            thresholdAmount.logicalId,
                            notificationAddress.logicalId,
                            notificationType.logicalId
                        ]
                    }
                ],
                ParameterLabels: {
                    [thresholdAmount.logicalId]: {
                        default: 'Budgeted amount (in USD)'
                    },
                    [notificationAddress.logicalId]: {
                        default: 'Address that AWS sends budget notifications to, either an SNS topic or an email'
                    },
                    [notificationType.logicalId]: {
                        default: 'Type of notification that AWS sends to a subscriber'
                    }
                }
            }
        };

        // Resources
        const budgetSubscribers = [{
            address: notificationAddress.valueAsString,
            subscriptionType: notificationType.valueAsString
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
