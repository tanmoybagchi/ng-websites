git -C ..\RedditReader pull
node projects\RedditReader\replace.build.js projects/RedditReader/src/environments/environment.prod.ts
cmd /c ng b RedditReader --prod --output-path=../RedditReader/docs/
copy ..\RedditReader\docs\index.html ..\RedditReader\docs\404.html
git -C ..\RedditReader add -A
git -C ..\RedditReader commit --quiet --allow-empty-message -m ''
git -C ..\RedditReader push origin master:master
git add -A
git commit --quiet --allow-empty-message -m ''
git push origin master:master
