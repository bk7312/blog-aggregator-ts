import { commReg, runCommand } from "./lib/commands/commands";

async function main() {
  const parameters = process.argv.slice(2);
  const [comm, ...args] = parameters;
  if (!comm) {
    console.error("no command found");
    console.error(
      "try 'npm run start help' to see the list of available commands"
    );
    process.exit(1);
  }
  await runCommand(commReg, comm, ...args);

  process.exit(0);
}

main();
