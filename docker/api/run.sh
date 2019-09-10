#!/bin/bash

trapIt () { "$@"& pid="$!"; trap "kill -INT $pid" INT TERM; while kill -0 $pid > /dev/null 2>&1; do wait $pid; ec="$?"; done; exit $ec;};

symfony local:server:prod

export JWT_PASSPHRASE=$(cat /root/jwt_variable);

echo "Waiting for db to be ready..."
until bin/console doctrine:query:sql "SELECT 1" > /dev/null 2>&1; do
  sleep 1
done

bin/console doctrine:migrations:migrate -n --allow-no-migration --all-or-nothing
userCount=$(bin/console doctrine:query:sql "select COUNT(*) FROM user" | grep "string" | cut -d'"' -f 2)

if [[ $userCount -lt 1 ]]; then
  bin/console user:create -u test@example.com -p Test1234 -f Test -l Test
fi;

trapIt symfony --ansi "$@"
