import { types } from "@babel/core";

function getCatchClauseBlockStatement({ injectImport } = {}) {
  if (!injectImport) return [];

  const blockStatement = [];
  const { specifier } = injectImport;

  blockStatement.push(
    types.expressionStatement(types.callExpression(types.identifier(specifier), [types.identifier("error")]))
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
    if (!types.isStringLiteral(path.node.source)) return;

    const { specifier, source, checkSourceEqual } = context.injectImport;

    const isEqualSource = isFunc(checkSourceEqual)
      ? checkSourceEqual(path.node.source.value, source)
      : path.node.source.value === source;

    if (isEqualSource) {
      // 标记已经引入了需要引入的模块
      context.hasImportedSource = true;
      path.node.specifiers.push(types.importSpecifier(types.identifier(specifier), types.identifier(specifier)));
    }
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
export default function () {
  return {
    name: "async-function-try-catch",

    visitor: {
      Program(path, state) {
        const { injectImport } = state.opts || {};

        if (!injectImport) return;

        const { specifier, source } = injectImport;

        // 如果作用域中已经有需要使用的方法，则不再注入
        if (path.scope.hasBinding(specifier)) return;

        const importContext = { injectImport };
        path.traverse(importVisitor, importContext);

        // 已经引入了方法
        if (importContext.hasImportedSource) return;

        // 手动注入依赖
        path.unshiftContainer(
          "body",
          types.importDeclaration(
            [types.importSpecifier(types.identifier(specifier), types.identifier(specifier))],
            types.stringLiteral(source)
          )
        );
      },
      Function(path, state) {
        if (!path.node.async || path.node.generator) return;
        if (!types.isBlockStatement(path.node.body) || types.isTryStatement(path.node.body.body[0])) return;

        // 检查异步方法是否有 try catch 代码块
        path.node.body.body = [
          types.tryStatement(types.blockStatement(path.node.body.body)),
          types.catchClause(types.identifier("error"), types.blockStatement(getCatchClauseBlockStatement(state.opts)))
        ];
      }
    }
  };
};
