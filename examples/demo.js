const { createSpinner, createProgressBar, spinners, Spinner, ProgressBar } = require("../dist");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demoSpinners() {
  console.log("\n🦞 Shellback Demo - Spinners\n");
  console.log("Available spinner styles:\n");

  for (const [name, config] of Object.entries(spinners)) {
    const spinner = createSpinner({ text: `${name} spinner`, spinner: name, color: "cyan" });
    spinner.start();
    await sleep(2000);
    spinner.succeed(`${name} - complete!`);
    await sleep(300);
  }
}

async function demoProgressBar() {
  console.log("\n🦞 Shellback Demo - Progress Bars\n");

  // Basic progress bar
  const bar1 = createProgressBar(100, {
    format: "Downloading [:bar] :percent",
    color: "cyan",
  });

  bar1.start();
  for (let i = 0; i <= 100; i += 5) {
    bar1.update(i);
    await sleep(100);
  }
  bar1.finish("Download complete!");

  await sleep(500);

  // Wave preset
  const bar2 = createProgressBar(50, {
    preset: "wave",
    format: "Ocean progress :bar :current/:total",
    color: "blue",
  });

  bar2.start();
  for (let i = 0; i <= 50; i++) {
    bar2.update(i);
    await sleep(80);
  }
  bar2.finish("Waves are rolling!");

  await sleep(500);

  // Lobster preset
  const bar3 = createProgressBar(30, {
    preset: "lobster",
    format: "Lobster crawl :bar :percent",
    color: "red",
  });

  bar3.start();
  for (let i = 0; i <= 30; i++) {
    bar3.update(i);
    await sleep(100);
  }
  bar3.finish("Lobster reached the destination!");
}

async function demoSpinnerMethods() {
  console.log("\n🦞 Shellback Demo - Spinner Status Methods\n");

  const spinner = createSpinner("Processing...");
  spinner.start();
  await sleep(1500);
  spinner.succeed("Task completed successfully");
  await sleep(500);

  const spinner2 = createSpinner("Attempting risky operation...");
  spinner2.start();
  await sleep(1500);
  spinner2.fail("Operation failed");
  await sleep(500);

  const spinner3 = createSpinner("Checking warnings...");
  spinner3.start();
  await sleep(1500);
  spinner3.warn("Completed with warnings");
  await sleep(500);

  const spinner4 = createSpinner("Fetching information...");
  spinner4.start();
  await sleep(1500);
  spinner4.info("Retrieved 42 records");
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  🦞 SHELLBACK - Terminal Animations  ");
  console.log("═══════════════════════════════════════");

  await demoSpinners();
  await demoProgressBar();
  await demoSpinnerMethods();

  console.log("\n✨ Demo complete! Thanks for watching.\n");
}

main().catch(console.error);
