import { WriteStream } from "tty";

// Ocean-themed spinner frames
export const spinners = {
  wave: {
    interval: 120,
    frames: ["~", "~~", "~~~", "~~~~", "~~~", "~~", "~"],
  },
  tide: {
    interval: 150,
    frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"],
  },
  bubbles: {
    interval: 100,
    frames: ["○", "◔", "◑", "◕", "●", "◕", "◑", "◔"],
  },
  lobster: {
    interval: 200,
    frames: ["🦞", " 🦞", "  🦞", "   🦞", "  🦞", " 🦞"],
  },
  crab: {
    interval: 150,
    frames: ["🦀", "🦀 ", " 🦀", "🦀 ", "🦀"],
  },
  fish: {
    interval: 120,
    frames: ["><>", " ><>", "  ><>", "   ><>", "  ><>", " ><>"],
  },
  dots: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
  ripple: {
    interval: 140,
    frames: ["◉", "◎", "○", "◎"],
  },
  anchor: {
    interval: 200,
    frames: ["⚓", "⚓.", "⚓..", "⚓...", "⚓..", "⚓."],
  },
} as const;

export type SpinnerName = keyof typeof spinners;

export interface SpinnerOptions {
  text?: string;
  spinner?: SpinnerName | { interval: number; frames: string[] };
  color?: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";
  stream?: WriteStream;
  hideCursor?: boolean;
}

const colors: Record<string, string> = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
};

export class Spinner {
  private text: string;
  private frames: string[];
  private interval: number;
  private color: string;
  private stream: WriteStream;
  private hideCursor: boolean;
  private frameIndex: number = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private isSpinning: boolean = false;

  constructor(options: SpinnerOptions = {}) {
    this.text = options.text ?? "";
    const spinnerConfig =
      typeof options.spinner === "string"
        ? spinners[options.spinner]
        : options.spinner ?? spinners.wave;
    this.frames = [...spinnerConfig.frames];
    this.interval = spinnerConfig.interval;
    this.color = options.color ? colors[options.color] : colors.cyan;
    this.stream = options.stream ?? process.stderr;
    this.hideCursor = options.hideCursor ?? true;
  }

  start(text?: string): this {
    if (this.isSpinning) return this;

    if (text) this.text = text;
    this.isSpinning = true;

    if (this.hideCursor) {
      this.stream.write("\x1b[?25l");
    }

    this.render();
    this.timer = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      this.render();
    }, this.interval);

    return this;
  }

  stop(finalText?: string): this {
    if (!this.isSpinning) return this;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.isSpinning = false;
    this.clear();

    if (this.hideCursor) {
      this.stream.write("\x1b[?25h");
    }

    if (finalText) {
      this.stream.write(finalText + "\n");
    }

    return this;
  }

  succeed(text?: string): this {
    return this.stop(`${colors.green}✔${colors.reset} ${text ?? this.text}`);
  }

  fail(text?: string): this {
    return this.stop(`${colors.red}✖${colors.reset} ${text ?? this.text}`);
  }

  warn(text?: string): this {
    return this.stop(`${colors.yellow}⚠${colors.reset} ${text ?? this.text}`);
  }

  info(text?: string): this {
    return this.stop(`${colors.blue}ℹ${colors.reset} ${text ?? this.text}`);
  }

  setText(text: string): this {
    this.text = text;
    return this;
  }

  setSpinner(spinner: SpinnerName | { interval: number; frames: string[] }): this {
    const config = typeof spinner === "string" ? spinners[spinner] : spinner;
    this.frames = [...config.frames];
    this.interval = config.interval;
    this.frameIndex = 0;

    if (this.isSpinning && this.timer) {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.render();
      }, this.interval);
    }

    return this;
  }

  private render(): void {
    const frame = this.frames[this.frameIndex];
    const line = `${this.color}${frame}${colors.reset} ${this.text}`;
    this.clear();
    this.stream.write(line);
  }

  private clear(): void {
    this.stream.clearLine?.(0);
    this.stream.cursorTo?.(0);
  }
}

// Progress bar
export interface ProgressBarOptions {
  total: number;
  width?: number;
  complete?: string;
  incomplete?: string;
  head?: string;
  format?: string;
  color?: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray";
  stream?: WriteStream;
  hideCursor?: boolean;
}

export class ProgressBar {
  private total: number;
  private current: number = 0;
  private width: number;
  private complete: string;
  private incomplete: string;
  private head: string;
  private format: string;
  private color: string;
  private stream: WriteStream;
  private hideCursor: boolean;
  private startTime: number = 0;
  private isActive: boolean = false;

  constructor(options: ProgressBarOptions) {
    this.total = options.total;
    this.width = options.width ?? 30;
    this.complete = options.complete ?? "█";
    this.incomplete = options.incomplete ?? "░";
    this.head = options.head ?? "";
    this.format = options.format ?? ":bar :percent :current/:total";
    this.color = options.color ? colors[options.color] : colors.cyan;
    this.stream = options.stream ?? process.stderr;
    this.hideCursor = options.hideCursor ?? true;
  }

  start(): this {
    if (this.isActive) return this;

    this.isActive = true;
    this.startTime = Date.now();

    if (this.hideCursor) {
      this.stream.write("\x1b[?25l");
    }

    this.render();
    return this;
  }

  update(value: number): this {
    this.current = Math.min(value, this.total);
    if (this.isActive) {
      this.render();
    }
    return this;
  }

  increment(amount: number = 1): this {
    return this.update(this.current + amount);
  }

  finish(message?: string): this {
    this.current = this.total;
    this.render();
    this.isActive = false;

    if (this.hideCursor) {
      this.stream.write("\x1b[?25h");
    }

    this.stream.write("\n");

    if (message) {
      this.stream.write(message + "\n");
    }

    return this;
  }

  private render(): void {
    const percent = this.total > 0 ? this.current / this.total : 0;
    const filledWidth = Math.round(this.width * percent);
    const emptyWidth = this.width - filledWidth;

    const bar =
      this.color +
      this.complete.repeat(Math.max(0, filledWidth - (this.head ? 1 : 0))) +
      (filledWidth > 0 && this.head ? this.head : "") +
      colors.reset +
      this.incomplete.repeat(emptyWidth);

    const elapsed = Date.now() - this.startTime;
    const rate = this.current / (elapsed / 1000) || 0;
    const eta = rate > 0 ? (this.total - this.current) / rate : 0;

    let output = this.format
      .replace(":bar", bar)
      .replace(":percent", `${(percent * 100).toFixed(0)}%`)
      .replace(":current", String(this.current))
      .replace(":total", String(this.total))
      .replace(":elapsed", this.formatTime(elapsed / 1000))
      .replace(":eta", this.formatTime(eta))
      .replace(":rate", rate.toFixed(1));

    this.stream.clearLine?.(0);
    this.stream.cursorTo?.(0);
    this.stream.write(output);
  }

  private formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}

// Ocean-themed progress bar presets
export const progressPresets = {
  wave: {
    complete: "≋",
    incomplete: "~",
    head: "🌊",
  },
  bubbles: {
    complete: "●",
    incomplete: "○",
    head: "",
  },
  reef: {
    complete: "▓",
    incomplete: "░",
    head: "🪸",
  },
  fish: {
    complete: "═",
    incomplete: "─",
    head: "><>",
  },
  lobster: {
    complete: "▓",
    incomplete: "░",
    head: "🦞",
  },
} as const;

export type ProgressPreset = keyof typeof progressPresets;

// Helper functions
export function createSpinner(options?: SpinnerOptions | string): Spinner {
  if (typeof options === "string") {
    return new Spinner({ text: options });
  }
  return new Spinner(options);
}

export function createProgressBar(
  total: number,
  options?: Partial<ProgressBarOptions> & { preset?: ProgressPreset }
): ProgressBar {
  const preset = options?.preset ? progressPresets[options.preset] : {};
  return new ProgressBar({
    total,
    ...preset,
    ...options,
  });
}

// Multi-spinner support for concurrent tasks
export class MultiSpinner {
  private spinners: Map<string, { spinner: Spinner; line: number }> = new Map();
  private stream: WriteStream;
  private lineCount: number = 0;

  constructor(stream?: WriteStream) {
    this.stream = stream ?? process.stderr;
  }

  add(id: string, text: string, options?: Omit<SpinnerOptions, "text" | "stream">): this {
    const spinner = new Spinner({
      ...options,
      text,
      stream: this.stream,
    });

    this.spinners.set(id, { spinner, line: this.lineCount });
    this.lineCount++;
    this.stream.write("\n");
    spinner.start();

    return this;
  }

  update(id: string, text: string): this {
    const entry = this.spinners.get(id);
    if (entry) {
      entry.spinner.setText(text);
    }
    return this;
  }

  succeed(id: string, text?: string): this {
    const entry = this.spinners.get(id);
    if (entry) {
      entry.spinner.succeed(text);
    }
    return this;
  }

  fail(id: string, text?: string): this {
    const entry = this.spinners.get(id);
    if (entry) {
      entry.spinner.fail(text);
    }
    return this;
  }

  stopAll(): this {
    for (const [, entry] of this.spinners) {
      entry.spinner.stop();
    }
    return this;
  }
}

export default {
  Spinner,
  ProgressBar,
  MultiSpinner,
  spinners,
  progressPresets,
  createSpinner,
  createProgressBar,
};
