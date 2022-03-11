#!/usr/bin/env node

import { program, Option } from 'commander';
import { guided } from './guided';
import { handlerTypes } from './utils';
import { templateServiceFactory } from './services/template-service';

const templateService = templateServiceFactory();

program.command('generate').description('Generate files for a lambda function')
    .addOption(new Option('-F, --function-name <name>', 'Name of the function').makeOptionMandatory())
    .addOption(new Option('-S, --functions-folder <folder>', 'Location of the lambda functions').makeOptionMandatory())
    .addOption(new Option('-T, --handler-type <type>', 'Type of the lambda handler').makeOptionMandatory().choices(handlerTypes))
    .action(templateService.createNewFunction)

program.command('guided')
    .description('Interactive version')
    .action(guided(templateService));

program.parse();
// // TODO absolute path import

