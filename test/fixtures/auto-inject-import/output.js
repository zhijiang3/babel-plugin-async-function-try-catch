import { handleError } from "/src/utils/handleError";

async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
