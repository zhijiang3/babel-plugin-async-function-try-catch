async function foo() {
  try {
    await bar();
  } catch (e) {
    console.log("oops!");
  }
}
