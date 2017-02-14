#!/bin/bash

echo "export default quizImgs = {"
for img in *.jpg; do
    echo "  \"$img\": require('./imgs/quiz/$img'),"
done

echo "  version: '140331'"
echo "};"
