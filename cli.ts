import { parse } from "./deps.ts";
import { cidr2range, range2cidr } from "./convert.ts";

const args = parse(Deno.args);

type Command = "cidr2range" | "range2cidr";

const help = `
To convert range of IP address to CIDR:

    deno run -A cli.ts range2cidr --range <start ip>,<end ip>

To convert CIDR to IP address:

    deno run -A cli.ts cidr2range --cidr <cidr>
`;

function printHelp() {
  console.log(help);
  Deno.exit(1);
}

function cli() {
  const command = args._[0] as Command;
  if (command != "cidr2range" && command != "range2cidr") {
    printHelp();
  }

  if (command == "cidr2range") {
    const cidr = args.cidr;
    if (!cidr) {
      printHelp();
    }
    console.log(cidr2range(cidr));
  } else if (command == "range2cidr") {
    const range = args.range;
    if (!range) {
      printHelp();
    }
    console.log(range2cidr(range.split(",")).join("\n"));
  } else {
    printHelp();
  }
}

cli();
