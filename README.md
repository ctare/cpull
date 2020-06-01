# cpull
ファイルのテンプレートを作成するツールです。
`cpull py3`などして予め作成しておいたファイル群を手元にコピーします。

# 簡単使用法
1. テンプレートを保存しておく適当なディレクトリを作成します(`mkdir ~/templates`など)
2. `cpull ~/tempaltes`などして1.で作成したディレクトリを指定します
3. templatesの直下に適当なディレクトリを作ります(`mkdir templates/test`など)
4. `cpull test`とやるとtemplates/testの中身がcwdにコピーされます

help: cpull -h
