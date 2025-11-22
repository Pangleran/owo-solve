# AUTO COMMIT GITHUB

1. open shells & nano auto_push.sh
2. paste > #!/bin/bash

```
while true
do
  if ! git diff-index --quiet HEAD --; then
    git add .
    git commit -m "auto commit $(date)"
    git push
    echo "Auto committed & pushed at $(date)"
  fi
  sleep 10
done
```

3. chmod +x auto_push.sh
4. ./auto_push.sh
