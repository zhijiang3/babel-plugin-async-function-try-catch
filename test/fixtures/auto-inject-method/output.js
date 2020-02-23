import { checkBit, handleError } from "/src/utils";

async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
