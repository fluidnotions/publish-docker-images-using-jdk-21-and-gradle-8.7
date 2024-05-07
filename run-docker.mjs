import { input } from "@inquirer/prompts";
import checkbox from "@inquirer/checkbox";
import { readdirSync, existsSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

const runDockerContainer = (projectName, hostProjectsParentDir, dockerTag) => {
  const command = `docker run -it -v ${hostProjectsParentDir}:/app/projects -v /var/run/docker.sock:/var/run/docker.sock -e PROJECT_NAME=${projectName} -e DOCKER_TAG=${dockerTag} cybicom/dockerize-boot-services:slim-1.0.0`;
  const child = spawn("start", ["cmd", "/k", `"${command}"`], { shell: true });
  child.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });
};
const selectAndRun = async () => {
  const hostProjectsParentDir = await input({
    message: "Enter path to the directory containing the microservices:",
  });
  const dockerTag = await input({
    message: "Enter the version tag to use for docker images",
    default: "latest",
  });
  const files = readdirSync(hostProjectsParentDir).filter((f) => {
    const hasGradleSub = existsSync(join(hostProjectsParentDir, f, "gradle"));
    const isNotHidden = !f.startsWith(".");
    return hasGradleSub && isNotHidden;
  });
  const include = await checkbox({
    message: "Select microservices to dockerize",
    choices: files.map((f) => {
      return { name: f, value: f };
    }),
  });
  for (const name of include) {
    runDockerContainer(name, hostProjectsParentDir, dockerTag);
  }
};
await selectAndRun();
