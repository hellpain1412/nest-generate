#!/usr/bin/env node

const pjson = require(__dirname + '/package.json');
const prog = require('caporal');
const fs = require('fs');
const path = require('path');
const generate = require('./lib/generator');

let version = pjson ? pjson.version : '<unknown version>';

prog
  .version(version)

  .argument('<name>', 'Name of the model or module')

  .option(
    '-a',
    'Generate all (Module + Controller + Service + Interface + Schema)',
  )
  .option(
    '--all',
    'Generate all (Module + Controller + Service + Interface + Schema)',
  )

  .option('-m', 'Generate a Module')
  .option('--module', 'Generate a Module')

  .option('--sch', 'Generate a Schema for the model')
  .option('--schema', 'Generate a Schema for the model')
  .option('--schema-class <name>', 'Specify a custom class name for the schema')
  .option(
    '--schema-dir <dir>',
    "Specify a subdirectory to put the Schema in (ie. 'schema')",
  )

  .option('-c', 'Generate a Controller for the model')
  .option('--controller', 'Generate a Controller for the model')

  .option('-s', 'Generate a Service for the model')
  .option('--service', 'Generate a Service for the model')

  .option('-d', 'Generate dtos for the model')
  .option('--dto', 'Generate dtos for the model')

  // make interface?
  .option('--crud', 'Generates CRUD actions within the Controller and Service')

  .option('-i', 'Generate a Interface')
  .option('--interface', 'Generate a Interface')

  .option(
    '--old',
    'Generate a Schema and interface for the model with old nest version',
  )
  // add prefix/subdir to generate in
  .option('-p <prefix>', 'Specify root/prefix dir to generate in')
  .option('--prefix <prefix>', 'Specify root/prefix dir to generate in')

  // add authentication guards?
  .option(
    '--auth <name>',
    'CRUD actions will add authentication guards, requiring a logged in user. Name of a custom @(Guard<name>) class to use',
  )

  .option(
    '--no-subdir',
    "Don't put generated files in <name> subdirectory (only if not using a module)",
  )

  .option(
    '--casing <pascal>',
    'default = "example.controller.ts", pascal = "ExampleController.ts"',
  )

  .action((args, o, logger) => {
    console.log(`Running nest-generate v${version} generator...`);

    // normalize and validate
    if (o.p) {
      o.prefix = o.p;
    }
    if (o.old) {
      o.old = true;
      o.interface = true;
    }
    if (o.a || o.all) {
      o.all = true;
    }
    if (o.m || o.module) {
      o.module = true;
    }
    if (o.sch || o.schema) {
      o.schema = true;
      if (o.old) {
        o.interface = true;
      }
    }
    if (o.i || o.interface) {
      o.interface = true;
    }
    if (o.c || o.controller) {
      o.controller = true;
    }
    if (o.s || o.service) {
      o.service = true;
    }

    if (o.all) {
      o.module = o.schema = o.controller = o.service = o.dto = true;
      if (o.old) {
        o.interface = true;
      }
    }

    o.name = args.name.toLowerCase();
    o.nameUpper = _capitalize(args.name);
    o.nameUpperCase = args.name.toUpperCase();

    // set auth guarding params if applicable?
    if (o.auth && typeof o.auth !== 'string')
      throw 'Auth guard <name> must be specified if using authentication';

    // make containing folder for the module, if using, or otherwise the package name
    let outPath = path.resolve(o.prefix ? o.prefix : './src');
    if (o.module) {
      outPath += `/modules/${o.name}`;
    } else {
      outPath += o.noSubdir ? '' : `/${o.name}`;
    }

    fs.mkdirSync(outPath, { recursive: true });

    // Stage generation of each type of file...

    let stagedFiles = [];

    // SCHEMA ?
    if (o.schema || o.interface || o.crud || o.old) {
      if (!o.schemaClass) {
        o.schemaClass = o.nameUpper;
        if (o.schemaClass.charAt(o.schemaClass.length - 1) === 's') {
          o.schemaClass = o.schemaClass.substr(0, o.schemaClass.length - 1);
        }
      }

      o.schemaClassLower = o.schemaClass.toLowerCase();
      o.schemaClassUpperCase = o.schemaClass.toUpperCase();

      let outPathSchema = outPath;
      if (o.schemaDir) {
        outPathSchema += '/' + o.schemaDir;
        o.schemaDir = _ensureTrailingSlash(o.schemaDir);
      } else {
        outPathSchema += '/schemas';
        o.schemaDir = _ensureTrailingSlash('schemas');
      }

      fs.mkdirSync(outPathSchema, { recursive: true });

      o.schemaFileName = _getFileName(o.schemaClass, 'schema', o.casing);
      let outFile = `${outPathSchema}/${o.schemaFileName}.ts`;
      stagedFiles.push({ type: 'schema', outFile });
    }

    // INTERFACE ?
    if (o.old || o.interface) {
      if (!o.interfaceClass) {
        o.interfaceClass = o.nameUpper;
        if (o.interfaceClass.charAt(o.interfaceClass.length - 1) === 's') {
          o.interfaceClass = o.interfaceClass.substr(
            0,
            o.interfaceClass.length - 1,
          );
        }
      }

      o.interfaceClassLower = o.interfaceClass.toLowerCase();
      o.interfaceClassUpperCase = o.interfaceClass.toUpperCase();

      let outPathSchema = outPath;
      if (o.interfaceDir) {
        outPathSchema += '/' + o.interfaceDir;
        o.interfaceDir = _ensureTrailingSlash(o.interfaceDir);
      } else {
        outPathSchema += '/interfaces';
        o.interfaceDir = _ensureTrailingSlash('interfaces');
      }

      fs.mkdirSync(outPathSchema, { recursive: true });

      o.interfaceFileName = _getFileName(
        o.interfaceClass,
        'interface',
        o.casing,
      );
      let outFile = `${outPathSchema}/${o.interfaceFileName}.ts`;
      stagedFiles.push({ type: 'interface', outFile });
    }

    // DTO ?
    if (o.dto) {
      if (!o.dtoClass) {
        o.dtoClass = o.nameUpper;
        if (o.dtoClass.charAt(o.dtoClass.length - 1) === 's') {
          o.dtoClass = o.dtoClass.substr(
            0,
            o.dtoClass.length - 1,
          );
        }
      }

      o.dtoClassLower = o.dtoClass.toLowerCase();
      o.dtoClassUpperCase = o.dtoClass.toUpperCase();

      let outPathSchema = outPath;
      if (o.dtoDir) {
        outPathSchema += '/' + o.dtoDir;
        o.dtoDir = _ensureTrailingSlash(o.dtoDir);
      } else {
        outPathSchema += '/dto';
        o.dtoDir = _ensureTrailingSlash('dto');
      }

      fs.mkdirSync(outPathSchema, { recursive: true });

      o.dtoFileName = _getFileName(
        o.dtoClass,
        'dto',
        o.casing,
      );
      let outFile = `${outPathSchema}/${o.dtoFileName}.ts`;
      stagedFiles.push({ type: 'dto', outFile });
    }

    // MODULE ?
    if (o.module) {
      o.moduleFileName = _getFileName(o.name, 'module', o.casing);
      let outFile = `${outPath}/${o.moduleFileName}.ts`;
      stagedFiles.push({ type: 'module', outFile });
    }

    // CONTROLLER ?
    if (o.controller || o.crud) {
      o.controllerFileName = _getFileName(o.name, 'controller', o.casing);
      let outFile = `${outPath}/${o.controllerFileName}.ts`;
      stagedFiles.push({ type: 'controller', outFile });
    }

    // SERVICE ?
    if (o.service) {
      o.serviceFileName = _getFileName(o.name, 'service', o.casing);
      let outFile = `${outPath}/${o.serviceFileName}.ts`;
      stagedFiles.push({ type: 'service', outFile });
    }

    // Actually output the staged files
    stagedFiles.forEach((fd) => {
      generate(fd.type, o, fd.outFile);
    });
  });

prog.parse(process.argv);

// Utils ------------------------

function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function _getFileName(className, type, casing) {
  let _default = `${className.toLowerCase()}.${type}`;
  return casing
    ? casing === 'pascal'
      ? `${_capitalize(className)}${_capitalize(type)}`
      : _default
    : _default;
}

function _ensureTrailingSlash(str) {
  return str.charAt(str.length - 1) !== '/' ? str + '/' : str;
}
