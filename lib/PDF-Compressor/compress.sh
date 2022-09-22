#!/bin/sh
INPUT_FILE=$1
OUTPUT_FILE=$2
exec ./bin/gs -sDEVICE=pdfwrite -q -dCompatibilityLevel=$4 -r$3 -dNOPAUSE -dBATCH -dSAFER -dOverprint=/$5 -sDEVICE=pdfwrite -dPDFSETTINGS=/$6 -dEmbedAllFonts=$7 -dSubsetFonts=$8 -dAutoRotatePages=/$9 -dColorImageDownsampleType=/${10} -dColorImageResolution=${11} -dGrayImageDownsampleType=/${10} -dGrayImageResolution=${11} -dMonoImageDownsampleType=/${10} -dMonoImageResolution=${11} -sOutputFile="$OUTPUT_FILE" "$INPUT_FILE"
