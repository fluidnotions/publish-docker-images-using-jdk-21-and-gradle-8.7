import { input } from "@inquirer/prompts";
import select from "@inquirer/select";
import checkbox from "@inquirer/checkbox";
import { readdirSync, existsSync } from "fs";
import { exec } from "child_process";
import { join } from "path";

const execPromise = (command, projectDir) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd: projectDir });
    process.stdout.on("data", (data) => {
      console.log(data);
    });
    process.stderr.on("data", (data) => {
      console.error(data);
    });
    process.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    process.on("error", (err) => {
      reject(err);
    });
  });
};

const removeLocks = async (projectDir) => {
  console.log("Removing lock files...");
  try {
    await execPromise(
      `find ./.gradle -type f -name "*.lock" -exec rm {} +`,
      projectDir
    );
    console.log("Lock files removed.");
  } catch (err) {
    console.error("Failed to Removing lock files:", err);
  }
};

const bootBuildImageWithGradle = async (projectDir, tag) => {
  await removeLocks(projectDir);
  console.log(`process.env.GRADLE_HOME: ${process.env.GRADLE_HOME}`);
  const gradleBin = process.env.GRADLE_HOME
    ? `${process.env.GRADLE_HOME}/bin/gradle`
    : "gradle";
  console.log(
    `Building Docker image for project in directory: ${projectDir}, with gradleBin: ${gradleBin}`
  );
  const command = `${gradleBin} bootBuildImage -PimageTag=${tag}`;
  try {
    await execPromise(command, projectDir);
  } catch (err) {
    console.error("Failed to build Docker image:", err);
  }
};

const selectAndDockerize = async (directory, headless = false) => {
  let dockerTag = "latest";
  if (!headless) {
    const check = await select({
      message:
        "Have you updated all repo branches to the latest version, for your env branch of the microservices?\nHave you disconnected from the VPN?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    });
    if (!check) {
      console.log(
        "Please update all branches to the latest version, for your env branch of the microservices and disconnect from the VPN"
      );
      return;
    }
    dockerTag = await input({
      message: "Enter the version tag to use for docker images",
      default: "latest",
    });
  }

  const files = readdirSync(directory).filter((f) => {
    const hasGradleSub = existsSync(join(directory, f, "gradle"));
    const isNotHidden = !f.startsWith(".");
    return hasGradleSub && isNotHidden;
  });
  let include = files;
  if (!headless) {
    include = await checkbox({
      message: "Select microservices to dockerize",
      choices: files.map((f) => {
        return { name: f, value: f };
      }),
    });
  }
  console.log("selected microservices", include, " building docker images");
  const concurrent = process.env.CONCURRENT;
  if (concurrent) {
    Promise.all(
      include.map((f) => {
        const projectDir = join(directory, f);
        return bootBuildImageWithGradle(projectDir, dockerTag);
      })
    );
  } else {
    for (const f of include) {
      const projectDir = join(directory, f);
      await bootBuildImageWithGradle(projectDir, dockerTag);
    }
  }

  console.log("finished building selected docker images");
};

const directory = "/app/projects";
const headless = !!process.env.CLI;
const projectName = process.env.PROJECT_NAME;
const dockerTag = process.env.DOCKER_TAG || "latest";
if (!projectName) {
  await selectAndDockerize(directory, headless);
} else {
  await bootBuildImageWithGradle(join(directory, projectName), dockerTag);
}
