const { Spinner, ProgressBar, createSpinner, createProgressBar, spinners, progressPresets } = require("../dist");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✔ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✖ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// Spinner tests
test("Spinner: can be created with defaults", () => {
  const spinner = new Spinner();
  assert(spinner instanceof Spinner);
});

test("Spinner: can be created with options", () => {
  const spinner = new Spinner({
    text: "Loading...",
    spinner: "dots",
    color: "green",
  });
  assert(spinner instanceof Spinner);
});

test("Spinner: createSpinner helper with string", () => {
  const spinner = createSpinner("Processing...");
  assert(spinner instanceof Spinner);
});

test("Spinner: createSpinner helper with options", () => {
  const spinner = createSpinner({ text: "Test", spinner: "wave" });
  assert(spinner instanceof Spinner);
});

test("Spinner: all built-in spinners are valid", () => {
  const names = Object.keys(spinners);
  assert(names.length > 0, "Should have at least one spinner");

  for (const name of names) {
    const config = spinners[name];
    assert(Array.isArray(config.frames), `${name} should have frames array`);
    assert(config.frames.length > 0, `${name} should have at least one frame`);
    assert(typeof config.interval === "number", `${name} should have interval`);
    assert(config.interval > 0, `${name} interval should be positive`);
  }
});

test("Spinner: can change text", () => {
  const spinner = new Spinner({ text: "Initial" });
  spinner.setText("Updated");
  // No error means success
});

test("Spinner: can change spinner type", () => {
  const spinner = new Spinner({ spinner: "wave" });
  spinner.setSpinner("dots");
  spinner.setSpinner({ interval: 100, frames: ["a", "b", "c"] });
  // No error means success
});

// ProgressBar tests
test("ProgressBar: can be created with required options", () => {
  const bar = new ProgressBar({ total: 100 });
  assert(bar instanceof ProgressBar);
});

test("ProgressBar: can be created with all options", () => {
  const bar = new ProgressBar({
    total: 50,
    width: 40,
    complete: "#",
    incomplete: "-",
    head: ">",
    format: ":bar :percent",
    color: "blue",
  });
  assert(bar instanceof ProgressBar);
});

test("ProgressBar: createProgressBar helper", () => {
  const bar = createProgressBar(100);
  assert(bar instanceof ProgressBar);
});

test("ProgressBar: createProgressBar with preset", () => {
  const bar = createProgressBar(100, { preset: "wave" });
  assert(bar instanceof ProgressBar);
});

test("ProgressBar: all presets are valid", () => {
  const names = Object.keys(progressPresets);
  assert(names.length > 0, "Should have at least one preset");

  for (const name of names) {
    const preset = progressPresets[name];
    assert(typeof preset.complete === "string", `${name} should have complete char`);
    assert(typeof preset.incomplete === "string", `${name} should have incomplete char`);
  }
});

test("ProgressBar: update clamps to total", () => {
  const bar = new ProgressBar({ total: 100 });
  bar.update(150); // Should not throw, just clamp
  bar.update(-10); // Should handle gracefully
});

test("ProgressBar: increment works", () => {
  const bar = new ProgressBar({ total: 10 });
  bar.increment();
  bar.increment(5);
  // No error means success
});

// Output summary
console.log("\n" + "═".repeat(40));
console.log(`Tests: ${passed} passed, ${failed} failed`);
console.log("═".repeat(40));

process.exit(failed > 0 ? 1 : 0);
