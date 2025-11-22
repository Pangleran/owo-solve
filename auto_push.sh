#!/bin/bash

while true
do
  # cek apakah ada perubahan
  if ! git diff-index --quiet HEAD --; then
    git add .
    git commit -m "auto commit $(date)"
    git push
    echo "Auto committed & pushed at $(date)"
  fi
  sleep 10
done
