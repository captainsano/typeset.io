cd paper
pdflatex paper.tex
bibtex paper
pdflatex paper.tex
pdflatex paper.tex
gs -dNOPAUSE -dBATCH -r125 -sDEVICE=pngalpha -sOutputFile=../result/paper-%d.png paper.pdf