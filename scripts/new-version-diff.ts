import child_process from "child_process"
import { getCurrentFactorioVersion } from "./util.js"

function run(cmd: string) {
  return child_process.execSync(cmd, { stdio: "inherit", cwd: ".." })
}

// get current branch
const currentBranch = run("git rev-parse --abbrev-ref HEAD").toString().trim()

run(`git branch -f new-version-diff`)
run(`git checkout new-version-diff`)

run("npm run generate -- --no-link")
function commit(message: string) {
  run(`git add .`)
  run(`git commit -m "${message}"`)
}
commit("Run generator without link")

run("npm run download-latest-json-apis")
run("npm run generate -- --no-link")
const newFactorioVersion = getCurrentFactorioVersion()
commit(`Diff for factorio version ${newFactorioVersion}`)

// switch back to previous branch
run(`git checkout ${currentBranch}`)