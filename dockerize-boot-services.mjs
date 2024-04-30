import { input } from "@inquirer/prompts";
import select from "@inquirer/select";
import checkbox from "@inquirer/checkbox";
import { readdirSync, existsSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";


const runCommand = async (command, args, cwd) => {
  try {
      await new Promise((resolve, reject) => {
          const child = spawn(command, args, {
              stdio: 'inherit',
              shell: true,
              options: { cwd },
          });
          child.on('error', reject);
          child.on('close', (code) => {
              if (code === 0) {
                  resolve();
              } else {
                  reject(new Error(`Command exited with code ${code}`));
              }
          });
      });
      console.log('Command completed successfully.');
  } catch (err) {
      console.error('Command failed:', err);
  }
};

const bootBuildImageWithGradle = async (projectDir, tag) => {
  console.log(`img building ${projectDir}`);
  await runCommand('gradle', ['bootBuildImage', `-PimageTag=${tag}`, projectDir])
  console.log(`img built ${projectDir}`)
};

const selectAndDockerize = async (envDir, headless = false) => {
 
  const directory = (envDir && envDir.trim()) || '/app/projects';
  let dockerTag = "latest";
  if(!headless){
    const check = await select({
      message:
        "Have you updated all branches to the latest version, for your env branch of the microservices?\nHave you disconnected from the VPN?",
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
    const hasGradleSub = existsSync(
      join(directory, f, "gradle")
    );
    const isNotHidden = !f.startsWith(".");
    return hasGradleSub && isNotHidden;
  });
  let include = files
  if(!headless){
    include = await checkbox({
      message: "Select microservices to dockerize",
      choices: files.map((f) => {
        return { name: f, value: f };
      }),
    });
  }
  console.log("selected microservices", include, " building docker images");
  await Promise.all(include.map((f) => {
    const projectDir = join(directory, f);
    return bootBuildImageWithGradle(projectDir, dockerTag);
  }));
  console.log("finished building selected docker images");
};

const envDir = process.env.PROJECTS_DIR
const headless = !!process.env.CLI
await selectAndDockerize(envDir, headless);
