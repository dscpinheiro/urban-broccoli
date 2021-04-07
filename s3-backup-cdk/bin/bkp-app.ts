#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BackupStack } from '../lib/bkp-stack';

const app = new cdk.App();
new BackupStack(app, 'BackupStack');
