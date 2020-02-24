async function handleError(error) {
  try {
    console.error(error);
  } catch (error) {}
}

async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
