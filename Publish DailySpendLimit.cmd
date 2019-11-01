git -C ..\DailySpendLimit pull
time /T
node projects\DailySpendLimit\replace.build.js projects/DailySpendLimit/src/environments/environment.prod.ts
cmd /c ng b DailySpendLimit --prod --output-path=../DailySpendLimit/docs/
copy ..\DailySpendLimit\docs\index.html ..\DailySpendLimit\docs\404.html
git -C ..\DailySpendLimit add -A
git -C ..\DailySpendLimit commit --quiet --allow-empty-message -m ''
git -C ..\DailySpendLimit push origin master:master
