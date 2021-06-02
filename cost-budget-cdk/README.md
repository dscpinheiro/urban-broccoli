Sample CDK stack that creates an [AWS Budget](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html).

- Type of budget: Cost (_"Monitor your costs against a specified amount and receive alerts when your user-defined thresholds are met"_)
- Period: Monthly
- Budgeted amount: 50 USD (can be specified via the `BudgetThreshold` parameter)
- Notification: E-mail (can be specified via the `NotificationEmail` parameter)
- Thresholds:
    - Forecasted cost is greater than 50%
    - Forecasted cost is greater than 100%
    - Actual cost is greater than 100%
    - Actual cost is greater than 200%
    - Actual cost is greater than 300%

----

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
