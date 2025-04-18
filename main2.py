# deploy_amplify.py
"""Deploy a local Vite/React static site to AWS Amplify Hosting (us‑west‑2) with **no Git**.

Steps automated:
1. Optional: run the project build (`npm|pnpm run build`) → creates **dist/**.
2. If the project has never been initialised with Amplify, run *amplify init* in **headless** mode.
3. Ensure Amplify Hosting is configured (`amplify add hosting --type amplifyhosting`).
4. Run *amplify publish* to upload static assets & activate CloudFront.

Prerequisites
-------------
* AWS CLI creds (`aws configure`), or use a named profile (default: *amplify-usw2*).
* Amplify CLI ≥ 12 installed globally (`npm i -g @aws-amplify/cli`).
* Node ≥ 18, NPM or PNPM.

Usage
-----
```bash
python deploy_amplify.py --path ./cancel-flow-demo --pkg pnpm --profile amplify-usw2
```
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from textwrap import dedent

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def run(cmd: list[str], cwd: Path | None = None, env: dict[str, str] | None = None):
    """Run a shell command, streaming output. Abort on error."""
    print(" ➜", " ".join(cmd))
    proc = subprocess.Popen(cmd, cwd=cwd, env=env or os.environ, text=True)
    proc.communicate()
    if proc.returncode != 0:
        sys.exit(proc.returncode)


def detect_pkg(path: Path) -> str:
    if (path / "pnpm-lock.yaml").exists():
        return "pnpm"
    if (path / "yarn.lock").exists():
        return "yarn"
    return "npm"

# ---------------------------------------------------------------------------
# Amplify Headless input builders
# ---------------------------------------------------------------------------

def amplify_init_input(project_name: str, env_name: str, profile: str, region: str, pkg_manager: str) -> str:
    frontend = {
        "frontend": "javascript",
        "framework": "react",
        "config": {
            "SourceDir": "src",
            "DistributionDir": "dist",
            "BuildCommand": f"{pkg_manager} run build",
            "StartCommand": f"{pkg_manager} run dev",
        },
    }
    providers = {
        "awscloudformation": {
            "configLevel": "project",
            "useProfile": True,
            "profileName": profile,
            "region": region,
        }
    }
    data = {
        "version": "1",
        "projectName": project_name,
        "envName": env_name,
        "defaultEditor": "code",
        "frontend": frontend,
        "providers": providers,
    }
    return json.dumps(data)


def ensure_amplify_init(project: Path, profile: str, region: str, pkg_manager: str):
    if (project / "amplify").exists():
        print("✔ Amplify already initialised")
        return
    print("⚙️  Running amplify init (headless)")
    json_input = amplify_init_input(project.name, "prod", profile, region, pkg_manager)
    env = os.environ.copy()
    env["AMPLIFY_CLI_HEADLESS"] = "true"
    env["AMPLIFY_CLI_INPUT"] = json_input
    run(["amplify", "init", "--yes", "--profile", profile], cwd=project, env=env)


def ensure_hosting(project: Path, profile: str):
    meta = project / "amplify" / "#current-cloud-backend" / "amplify-meta.json"
    if meta.exists():
        data = json.loads(meta.read_text())
        if "hosting" in data.get("providers", {}).get("awscloudformation", {}):
            print("✔ Amplify hosting already configured")
            return
    print("⚙️  Adding Amplify hosting (PROD)")
    env = os.environ.copy()
    env["AMPLIFY_CLI_HEADLESS"] = "true"
    env["AMPLIFY_CLI_INPUT"] = json.dumps({
        "version": "1",
        "serviceConfiguration": {
            "serviceName": "AmplifyHosting",
            "type": "amplifyhosting",
            "appId": "use-existing",
            "environment": "PROD",
            "enablePullRequestPreview": False,
        }
    })
    run(["amplify", "add", "hosting", "--yes", "--profile", profile, "--type", "amplifyhosting"], cwd=project, env=env)


# ---------------------------------------------------------------------------
# Main deploy pipeline
# ---------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description="Build and deploy to Amplify Hosting (no Git)")
    p.add_argument("--path", default=".", help="Path to the Vite project root")
    p.add_argument("--pkg", choices=["npm", "pnpm", "yarn"], help="Package manager (auto‑detect if omitted)")
    p.add_argument("--profile", default="amplify-usw2", help="AWS CLI profile to use (default: amplify-usw2)")
    p.add_argument("--region", default="us-west-2", help="AWS region (default: us-west-2)")
    p.add_argument("--skip-build", action="store_true", help="Assume dist/ already exists, skip local build")
    args = p.parse_args()

    project = Path(args.path).expanduser().resolve()
    if not project.exists():
        sys.exit(f"❌  Path not found: {project}")

    pkg_manager = args.pkg or detect_pkg(project)
    run_pkg = {
        "npm": ["npm"],
        "pnpm": ["pnpm"],
        "yarn": ["yarn"],
    }[pkg_manager]

    # 1. build ---------------------------------------------------------------
    if not args.skip_build:
        print("🏗  Building project with", pkg_manager)
        run(run_pkg + ["run", "build"], cwd=project)
    elif not (project / "dist").exists():
        sys.exit("❌  --skip-build specified but dist/ folder not found")

    # 2. amplify init (headless) --------------------------------------------
    ensure_amplify_init(project, args.profile, args.region, pkg_manager)

    # 3. hosting -------------------------------------------------------------
    ensure_hosting(project, args.profile)

    # 4. publish -------------------------------------------------------------
    print("🚀  Publishing to Amplify Hosting…")
    run(["amplify", "publish", "--yes", "--profile", args.profile], cwd=project)

    print("🎉  Deployment complete. Check the log above for your Amplify URL.")


if __name__ == "__main__":
    main()

