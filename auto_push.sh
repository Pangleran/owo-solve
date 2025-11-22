#!/bin/bash

while true
do
  # 1. Pull dulu untuk sync
  git pull --rebase

  # 2. Jika ada perubahan file, commit + push
  if ! git diff-index --quiet HEAD --; then
    git add .
    git commit -m "auto commit $(date)"
    git push
    echo "Auto committed & pushed at $(date)"
  else
    # jika tidak ada perubahan, coba push sisa rebase
    git push
  fi
  
  sleep 10
done
