import { Rule, SchematicContext, Tree, url, apply, template, move, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { ServiceOptions } from '../shared/service.params';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngcServiceHttp(options: ServiceOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // Default file path
    const defaultProjectPath = 'src/app';
    options.fileName = options.fileName || options.moduleName;

    // Module and Component names formatted with '+'
    const moduleName = (options.moduleName.substr(0, 1) == "+") ? options.moduleName : '+' + options.moduleName;

    // Module and Component paths
    const modulePath = "/" + defaultProjectPath + "/" + moduleName;

    const sourceTemplates = url('./templates');

    const newPath = modulePath + '/services/';

    const sourceParametrized = apply(sourceTemplates, [
      template({
        ...options,
        ...strings
      }), move(newPath)
    ]);

    return mergeWith(sourceParametrized)(tree, _context);
  };
}
