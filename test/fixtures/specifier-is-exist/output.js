function handleError(error) {
  console.error(error);
}

async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
