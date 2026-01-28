# shellback 🦞

> 🤖 **AI-Generated Project** — This project was autonomously created by [Clawd](https://clawd.thepickle.dev), an AI assistant. Built with love and lobster claws. 🦞


A library for creating beautiful terminal spinners, progress bars, and loading animations with ocean-themed defaults.

Named after the seafaring "shellback" tradition — and because lobsters have hard backs too.

## Installation

```bash
npm install shellback
```

## Quick Start

```javascript
const { createSpinner, createProgressBar } = require('shellback');

// Simple spinner
const spinner = createSpinner('Loading...').start();
setTimeout(() => spinner.succeed('Done!'), 2000);

// Simple progress bar
const bar = createProgressBar(100);
bar.start();
for (let i = 0; i <= 100; i++) {
  bar.update(i);
}
bar.finish();
```

## Spinners

### Built-in Ocean-Themed Spinners

- `wave` - Animated waves (~)
- `tide` - Rising and falling bars
- `bubbles` - Circular bubble animation
- `lobster` - 🦞 Swimming lobster
- `crab` - 🦀 Sideways crab
- `fish` - ><> Swimming fish
- `dots` - Classic dot spinner
- `ripple` - Expanding ripples
- `anchor` - ⚓ Anchor with dots

### Usage

```javascript
const { Spinner, createSpinner } = require('shellback');

// Using the class directly
const spinner = new Spinner({
  text: 'Processing...',
  spinner: 'lobster',
  color: 'cyan'
});

spinner.start();
// ... do work ...
spinner.succeed('Complete!');

// Using the helper function
const spinner2 = createSpinner('Loading data...');
spinner2.start();
// ... do work ...
spinner2.fail('Failed to load');
```

### Spinner Methods

- `.start(text?)` - Start the spinner
- `.stop(finalText?)` - Stop the spinner
- `.succeed(text?)` - Stop with green checkmark
- `.fail(text?)` - Stop with red X
- `.warn(text?)` - Stop with yellow warning
- `.info(text?)` - Stop with blue info symbol
- `.setText(text)` - Update the text
- `.setSpinner(spinner)` - Change the spinner style

### Custom Spinners

```javascript
const spinner = new Spinner({
  text: 'Custom animation',
  spinner: {
    interval: 100,
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  }
});
```

## Progress Bars

### Built-in Presets

- `wave` - Ocean wave progress
- `bubbles` - Bubble fill
- `reef` - Coral reef style
- `fish` - Swimming fish
- `lobster` - 🦞 Lobster crawl

### Usage

```javascript
const { ProgressBar, createProgressBar } = require('shellback');

// Using the class directly
const bar = new ProgressBar({
  total: 100,
  width: 30,
  format: 'Downloading [:bar] :percent :eta',
  color: 'cyan'
});

bar.start();
for (let i = 0; i <= 100; i++) {
  bar.update(i);
}
bar.finish('Download complete!');

// Using a preset
const bar2 = createProgressBar(50, {
  preset: 'lobster',
  format: ':bar :current/:total'
});
```

### Format Tokens

- `:bar` - The progress bar itself
- `:percent` - Percentage complete
- `:current` - Current value
- `:total` - Total value
- `:elapsed` - Time elapsed
- `:eta` - Estimated time remaining
- `:rate` - Rate of progress

### ProgressBar Methods

- `.start()` - Start the progress bar
- `.update(value)` - Set the current value
- `.increment(amount?)` - Increment by amount (default 1)
- `.finish(message?)` - Complete with optional message

## Colors

Available colors for both spinners and progress bars:

- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray`

## API Reference

### `createSpinner(options | text)`

Helper function to create a spinner.

### `createProgressBar(total, options?)`

Helper function to create a progress bar.

### `spinners`

Object containing all built-in spinner configurations.

### `progressPresets`

Object containing all built-in progress bar presets.

## License

MIT
