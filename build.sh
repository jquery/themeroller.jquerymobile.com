#!/bin/bash
# determine the project root
output="."

function log {
  echo "[branches preview] $1"
}

# Make the output directory if it doesnt exist
mkdir -p "$output"

branches=$(git ls-remote --heads origin | cut -f2 -s | sed 's@refs/heads/@@')

log "fetching to get new branches"
git fetch origin

# Loop through the array to export each branch
for branch in $branches; do
  # skip master
  if [ $branch = "master" ]; then
      continue
  fi

  # TODO shell escape the $branch value it safe for executing
  log "archiving ref $branch"
  git archive -o "$output/$branch.tar" "origin/$branch"
  mkdir -p "$output/$branch"

  log "untarring $branch.tar into $output/$branch/"
  tar -C "$output/$branch" -xf "$output/$branch.tar"
  rm -f "$output/$branch.tar"
  cp -r upgrade "$output/$branch"
done
