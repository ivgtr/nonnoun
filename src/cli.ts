#!/usr/bin/env node

import meow from "meow";
import type { Package } from "update-notifier";
import updateNotifier from "update-notifier";
import { exchanging, Options } from "./index.js";

const cli = async () => {
  const cli = meow(
    `
Usage
  $ nonnoun <text> [query]
Examples
  $ nonnoun 吾輩は猫である
  ■■は■である
  $ nonnoun 吾輩は猫である -p ▲
  ▲▲は▲である
  $ nonnoun 吾輩は猫である -p ▲,■,●
  ●■は▲である
`,
    {
      importMeta: import.meta,
      flags: {
        pack: {
          type: "string",
          alias: "p",
          default: "■",
        },
      },
    }
  );

  updateNotifier({ pkg: cli.pkg as Package }).notify();

  const { input, flags } = cli;

  if (cli.flags?.v) cli.showVersion();
  if (!input.length || cli.flags?.h) cli.showHelp();

  const options: Options = {
    text: input[0],
  };

  if (flags?.pack) {
    options.pack = flags.pack.split(",");
  }

  exchanging(options)
    .then((text) => {
      console.log(text);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

cli();
