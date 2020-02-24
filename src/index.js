import { types } from "@babel/core";

function getCatchClauseBlockStatement({ injectImport } = {}) {
  if (!injectImport) return [];

  const blockStatement = [];
  const { specifier } = injectImport;

  blockStatement.push(
    types.expressionStatement(
      types.callExpression(types.identifier(specifier), [
        types.identifier("error")
      ])
    )
  );

  return blockStatement;
}

/**
 * @param {*} obj
 * @return {boolean}
 */
function isFunc(obj) {
  return typeof obj === "function";
}

const importVisitor = {
  ImportDeclaration(path, context) {
    if (!types.isStringLiteral(path.node.source) || context.hasImportedSource) return;

    const { specifier, source, checkSourceEqual } = context.injectImport;

    const isEqualSource = isFunc(checkSourceEqual)
      ? checkSourceEqual(path.node.source.value, source)
      : path.node.source.value === source;

    if (isEqualSource) {
      // 标记已经引入了需要引入的模块
      context.hasImportedSource = true;
      path.node.specifiers.push(
        types.importSpecifier(
          types.identifier(specifier),
          types.identifier(specifier)
        )
      );
    }
  }
};

const asyncFunctionVisitor = {
  Function(path, context) {
    // prettier-ignore
    if (!path.node.async
      || path.node.generator
      || !types.isBlockStatement(path.node.body)
      || types.isTryStatement(path.node.body.body[0])) return;

    context.hasAsyncFunction = true;

    // 检查异步方法是否有 try catch 代码块
    path.node.body.body = [
      types.tryStatement(
        types.blockStatement(path.node.body.body),
        types.catchClause(
          types.identifier("error"),
          types.blockStatement(getCatchClauseBlockStatement(context))
        )
      )
    ];
  }
};

/**
 * options: {
 *   injectImport: {
 *     specifier: string;
 *     source: string;
 *     checkSourceEqual(sourcePath, targetPath): boolean;
 *   }
 * }
 */
export default function() {
  return {
    name: "async-function-try-catch",

    visitor: {
      Program(path, state) {
        const { injectImport } = state.opts || {};

        const context = { injectImport };
        path.traverse(asyncFunctionVisitor, context);

        // 如果作用域中已经有需要使用的方法，则不再注入
        if (!injectImport || path.scope.hasBinding(injectImport.specifier) || !context.hasAsyncFunction) return;

        const { specifier, source } = injectImport;

        path.traverse(importVisitor, context);

        // 已经引入了方法
        if (context.hasImportedSource) return;

        // 手动注入依赖
        path.unshiftContainer(
          "body",
          types.importDeclaration(
            [
              types.importSpecifier(
                types.identifier(specifier),
                types.identifier(specifier)
              )
            ],
            types.stringLiteral(source)
          )
        );
      }
    }
  };
}
